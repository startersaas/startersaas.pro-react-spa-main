// pages/Plan/PlanPage.jsx
import { Customer, CustomerCards, Plans } from "api/queries";
import Box from "components/atoms/Box";
import Loader from "components/atoms/Loader";
import { isAccountActive, isFreeTrial } from "libs/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from 'contexts/AuthContext';
import PlanCard from "./PlanCard";
import QueryDebugLogger from 'components/debugging/QueryDebugLogger';
import {
  Grid,
  Typography,
  Button,
  ButtonGroup,
  Container,
  Alert,
  AlertTitle
} from '@mui/material';

const PlanPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlanRecurring, setSelectedPlanRecurring] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(undefined);
  const [currentSubscription, setCurrentSubscription] = useState();
  const [stripePromise, setStripePromise] = useState(null);

  // Navigate when a plan is selected
  useEffect(() => {
    if (selectedPlan !== undefined) {
      navigate(`/plan/${selectedPlan}/subscribe`);
    }
  }, [selectedPlan, navigate]);

  // Customer query - renamed for consistency
  const customerQuery = useQuery("Customer", Customer, {
    retry: false,
    onSuccess: (data) => {
      if (!isFreeTrial(user.account)) {
        try {
          const cs = data?.data?.subscriptions?.data?.[0];
          if (cs) {
            setCurrentSubscription(cs);
          }
        } catch (e) {
          console.error("Error processing subscription:", e);
        }
      }
    },
  });

  // Plans query
  const plansQuery = useQuery(
    "Plans",
    Plans,
    {
      retry: false,
      onSuccess: (data) => {
        // Initialize Stripe with the public key when plans data is loaded
        if (data?.data?.publicKey) {
          setStripePromise(loadStripe(data.data.publicKey));
        }
      },
    }
  );

  // Cards query
  const cardsQuery = useQuery(
    ["CustomerCards", user.accountId],
    CustomerCards,
    {
      retry: false,
    }
  );

  // Prepare queries for debug logger
  const queriesForDebug = [
    {
      name: "Customer Query",
      isLoading: customerQuery.isLoading,
      isError: customerQuery.isError,
      error: customerQuery.error,
      data: customerQuery.data
    },
    {
      name: "Plans Query",
      isLoading: plansQuery.isLoading,
      isError: plansQuery.isError,
      error: plansQuery.error,
      data: plansQuery.data
    },
    {
      name: "Cards Query",
      isLoading: cardsQuery.isLoading,
      isError: cardsQuery.isError,
      error: cardsQuery.error,
      data: cardsQuery.data
    },
    {
      name: "State Variables",
      isLoading: false,
      isError: false,
      data: {
        selectedPlanRecurring,
        selectedPlan,
        currentSubscription,
        stripePromise: stripePromise ? "Loaded" : "Not Loaded"
      }
    }
  ];

  // Loading state
  if (customerQuery.isLoading || plansQuery.isLoading || cardsQuery.isLoading) {
    return (
      <>
        <Loader />
        <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
      </>
    );
  }

  // Error handling
  if (customerQuery.isError || plansQuery.isError || cardsQuery.isError) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          <AlertTitle>{t("common.error")}</AlertTitle>
          {t("planPage.errorLoadingData")}
        </Alert>
        <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
      </Container>
    );
  }

  // Check if plans data is available
  if (!plansQuery.data?.data?.plans) {
    return (
      <Container maxWidth="md">
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Box p={3} border={1} borderColor="warning.main" borderRadius={1}>
              <Typography variant="h6" color="warning.main">
                {t("planPage.planDataNotAvailable")}
              </Typography>
              <Typography variant="body2" paragraph>
                {t("planPage.planDataCouldNotBeLoaded")}
              </Typography>
              <ul>
                <li>{t("planPage.plansAPIRequestFailed")}</li>
                <li>{t("planPage.noPlansReturned")}</li>
                <li>{t("planPage.planDataStructureChanged")}</li>
              </ul>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                {t("common.refresh")}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
      </Container>
    );
  }

  // Filter plans by billing interval
  const monthlyPlans = plansQuery.data.data.plans.filter(p => p.monthly) || [];
  const yearlyPlans = plansQuery.data.data.plans.filter(p => !p.monthly) || [];
  const showRecurringToggle = monthlyPlans.length > 0 && yearlyPlans.length > 0;

  // If no plans match the selected interval
  const noPlansToShow = 
    (selectedPlanRecurring === 1 && monthlyPlans.length === 0) || 
    (selectedPlanRecurring === 2 && yearlyPlans.length === 0);

  if (noPlansToShow) {
    return (
      <Container maxWidth="md">
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Box p={3} border={1} borderColor="warning.main" borderRadius={1}>
              <Typography variant="h6" color="warning.main">
                {t("planPage.noPlansAvailable")}
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedPlanRecurring === 1 
                  ? t("planPage.noMonthlyPlansAvailable") 
                  : t("planPage.noYearlyPlansAvailable")}
              </Typography>
              {showRecurringToggle && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => setSelectedPlanRecurring(selectedPlanRecurring === 1 ? 2 : 1)}
                >
                  {selectedPlanRecurring === 1 
                    ? t("planPage.switchToYearly") 
                    : t("planPage.switchToMonthly")}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
      </Container>
    );
  }

  // Stripe Elements options
  const options = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
      },
    ],
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box
            header={
              <Container maxWidth="sm">
                <Typography component="h1" align="center">
                  {t("planPage.selectaPlan")}
                </Typography>
                {!isAccountActive(user.account) && (
                  <Typography align="center">
                    {t("planPage.deactivatedAccountNotice")}
                  </Typography>
                )}
              </Container>
            }
            body={
              stripePromise ? (
                <Elements stripe={stripePromise} options={options}>
                  <Grid container direction="column" spacing={3}>
                    {showRecurringToggle && (
                      <Grid item>
                        <ButtonGroup fullWidth>
                          <Button
                            onClick={() => setSelectedPlanRecurring(1)}
                            variant={selectedPlanRecurring === 1 ? "contained" : "outlined"}
                          >
                            {t("planPage.monthly")}
                          </Button>
                          <Button
                            onClick={() => setSelectedPlanRecurring(2)}
                            variant={selectedPlanRecurring === 2 ? "contained" : "outlined"}
                          >
                            {t("planPage.yearly")}
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    )}

                    <Grid item>
                      <Grid container spacing={2}>
                        {selectedPlanRecurring === 1 && monthlyPlans.map((plan, i) => (
                          <Grid item xs={12} md={4} key={`monthly-${i}`}>
                            <PlanCard
                              plan={plan}
                              monthly
                              setSelectedPlan={setSelectedPlan}
                              currentSubscription={currentSubscription}
                              cardsData={cardsQuery.data?.data}
                            />
                          </Grid>
                        ))}

                        {selectedPlanRecurring === 2 && yearlyPlans.map((plan, i) => (
                          <Grid item xs={12} md={4} key={`yearly-${i}`}>
                            <PlanCard
                              plan={plan}
                              monthly={false}
                              setSelectedPlan={setSelectedPlan}
                              currentSubscription={currentSubscription}
                              cardsData={cardsQuery.data?.data}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Elements>
              ) : (
                <Loader />
              )
            }
          />
        </Grid>
      </Grid>
      <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
    </>
  );
};

export default PlanPage;