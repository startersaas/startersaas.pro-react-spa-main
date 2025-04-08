// pages/Plan/SubscribePlanPage.jsx
import { CreateCustomerCheckoutSession, UpdateAccount } from "api/mutations";
import { Plans } from "api/queries";
import Box from "components/atoms/Box";
import Loader from "components/atoms/Loader";
import AccountForm from "pages/User/AccountForm";
import { ENABLE_CUSTOMER_PORTAL } from "config";
import { formatMoney } from "libs/utils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from 'contexts/AuthContext';
import StripeForm from "./StripeForm";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  Container,
  Alert,
  AlertTitle
} from '@mui/material';
import QueryDebugLogger from 'components/debugging/QueryDebugLogger';

const SubscribePlanPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { planId } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [invoicingUpdated, setInvoicingUpdated] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);

  const mutation = useMutation(UpdateAccount);
  const customerCheckoutSessionMutate = useMutation(CreateCustomerCheckoutSession);

  const redirectToCustomerCheckoutSession = async () => {
    try {
      const response = await customerCheckoutSessionMutate.mutateAsync({
        planId: selectedPlan.id,
      });
      if (response?.data?.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        console.error("No redirect URL returned from checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync({
        accountId: user.accountId,
        data: data,
      });
      setInvoicingUpdated(true);
    } catch (error) {
      setInvoicingUpdated(false);
    }
  };

  // Renamed to plansQuery for consistency with other components
  const plansQuery = useQuery(
    "Plans",
    Plans,
    {
      retry: false,
      onSuccess: (plansData) => {
        if (plansData?.data?.plans) {
          const sp = plansData.data.plans.filter((p) => p.id === planId)[0];
          setSelectedPlan(sp || null);
          
          if (plansData?.data?.publicKey) {
            setStripePromise(loadStripe(plansData.data.publicKey));
          }
        }
      },
    }
  );

  // Effect to check if plan was found
  useEffect(() => {
    // If data is loaded but no plan was found with the given ID
    if (!plansQuery.isLoading && plansQuery.data?.data?.plans && !selectedPlan) {
      console.log(`Plan with ID ${planId} not found in available plans`);
    }
  }, [plansQuery.isLoading, plansQuery.data, selectedPlan, planId]);

  // Optional: Configure Stripe Elements appearance
  const options = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
      },
    ],
    // Add any other Stripe Elements options here
  };

  // Prepare queries for debug logger
  const queriesForDebug = [
    {
      name: "Plans Query",
      isLoading: plansQuery.isLoading,
      isError: plansQuery.isError,
      error: plansQuery.error,
      data: plansQuery.data
    },
    {
      name: "State Variables",
      isLoading: false,
      isError: false,
      data: {
        selectedPlan,
        invoicingUpdated,
        stripePromise: stripePromise ? "Loaded" : "Not Loaded",
        planId
      }
    }
  ];

  if (plansQuery.isLoading) {
    return <Loader />;
  }

  if (plansQuery.isError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>{t("common.error")}</AlertTitle>
          {t("subscribePlanPage.errorLoadingPlans")}
        </Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate("/plan")}
        >
          {t("common.backToPlans")}
        </Button>
        <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
      </Container>
    );
  }

  if (!selectedPlan) {
    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box p={3} border={1} borderColor="warning.main" borderRadius={1}>
              <Typography variant="h6" color="warning.main">
                {t("subscribePlanPage.planDataNotAvailable")}
              </Typography>
              <Typography variant="body2" paragraph>
                {t("subscribePlanPage.planDataCouldNotBeLoaded")}
              </Typography>
              <ul>
                <li>{t("subscribePlanPage.plansAPIRequestFailed")}</li>
                <li>{t("subscribePlanPage.planIDNotFound", { planId })}</li>
                <li>{t("subscribePlanPage.planIDDoesNotMatch")}</li>
              </ul>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => navigate("/plan")}
              >
                {t("common.backToPlans")}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
      </Container>
    );
  }

  const renderOrderDetails = () => (
    <Grid container spacing={2}>
      <Grid item container justifyContent="space-between">
        <Typography fontWeight="bold">
          {t("subscribePlanPage.plan")}
        </Typography>
        <Typography>
          {selectedPlan.title}
        </Typography>
      </Grid>
      
      <Grid item container justifyContent="space-between">
        <Typography fontWeight="bold">
          {t("subscribePlanPage.invoicing")}
        </Typography>
        <Typography>
          {selectedPlan.monthly
            ? t("subscribePlanPage.monthly")
            : t("subscribePlanPage.yearly")}
        </Typography>
      </Grid>
      
      <Grid item container justifyContent="space-between">
        <Typography fontWeight="bold">
          {t("subscribePlanPage.price")}
        </Typography>
        <Typography>
          {formatMoney("it", selectedPlan.currency, selectedPlan.price)}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            header={
              <Typography component="h1">
                {t("subscribePlanPage.billingDetails")}
              </Typography>
            }
            body={
              <AccountForm user={user} onSubmit={onSubmit} />
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            header={
              <Typography component="h1">
                {t("subscribePlanPage.yourOrder")}
              </Typography>
            }
            body={renderOrderDetails()}
          />
        </Grid>

        {invoicingUpdated && (
          <Grid item xs={12}>
            {ENABLE_CUSTOMER_PORTAL ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={redirectToCustomerCheckoutSession}
              >
                {t("subscribePlanPage.subscribe")}
              </Button>
            ) : (
              <Box
                header={
                  <Typography component="h1">
                    {t("subscribePlanPage.creditCard")}
                  </Typography>
                }
                body={
                  stripePromise ? (
                    <Elements stripe={stripePromise} options={options}>
                      <StripeForm
                        planId={planId}
                        selectedPlan={selectedPlan}
                        user={user}
                      />
                    </Elements>
                  ) : (
                    <Loader />
                  )
                }
              />
            )}
          </Grid>
        )}
      </Grid>
      <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
    </Container>
  );
};

export default SubscribePlanPage;