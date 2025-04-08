import {
  CancelSubscription,
  CreateCustomerPortalSession,
  RemoveCreditCard,
  SetDefaultCreditCard,
} from "api/mutations";
import { Customer, CustomerCards, CustomerInvoices, Plans } from "api/queries";
import Loader from "components/atoms/Loader";
import { ENABLE_CUSTOMER_PORTAL } from "config";
import { formatMoney, hasFailedPayment, isFreeTrial } from "libs/utils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from 'contexts/AuthContext';
import TrialComponent from "./TrialComponent";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box
} from '@mui/material';

// Import our reusable components
import UserInfoDesktop from 'components/molecules/UserInfoDesktop';
import SubscriptionInfoDesktop from 'components/molecules/SubscriptionInfoDesktop';
import PaymentMethodsDesktop from 'components/molecules/PaymentMethodsDesktop';
import PaymentHistoryDesktop from 'components/molecules/PaymentHistoryDesktop';
import QueryDebugLogger from 'components/debugging/QueryDebugLogger';

const DashboardPageDesktop = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentSubscription, setCurrentSubscription] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null); // Initialize as null to properly track loading state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, data: null });
  const queryClient = useQueryClient();
  
  // For debugging purposes - add data dependency tracking
  const [debugInfo, setDebugInfo] = useState({
    planSet: false,
    subscriptionSet: false
  });

  // Mutations remain unchanged
  const cancelSubscriptionMutate = useMutation(CancelSubscription, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Customer", user.accountId]);
      queryClient.invalidateQueries(["CustomerInvoices", user.accountId]);
    },
  });

  const removeCardMutate = useMutation(RemoveCreditCard, {
    onSuccess: () => {
      queryClient.invalidateQueries(["CustomerCards", user.accountId]);
    },
  });

  const setDefaultCardMutate = useMutation(SetDefaultCreditCard, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Customer", user.accountId]);
    },
  });

  const customerPortalSessionMutate = useMutation(CreateCustomerPortalSession, {});

  // Queries with explicit variable names for debugging
  const plansQuery = useQuery("Plans", Plans, {
    retry: false,
  });

  const customerQuery = useQuery(["Customer", user.accountId], Customer, {
    retry: false,
    onSuccess: (data) => {
      if (!isFreeTrial(user.account)) {
        const cs = data.data.subscriptions.data[0];
        if (cs) {
          setCurrentSubscription(cs);
          setDebugInfo(prev => ({ ...prev, subscriptionSet: true }));
          
          if (plansQuery.data && plansQuery.data.data && plansQuery.data.data.plans) {
            const sp = plansQuery.data.data.plans.filter((p) => p.id === cs.plan.id)[0];
            setSelectedPlan(sp || null);
            setDebugInfo(prev => ({ ...prev, planSet: sp ? true : false }));
          }
        } else {
          // Don't redirect immediately, let the user view the page
          console.log("No subscription found, would normally redirect to /plan");
        }
      }
    },
  });

  // Effect to detect when plans data is available but wasn't set in customer query
  useEffect(() => {
    if (
      customerQuery.data && 
      !isFreeTrial(user.account) && 
      !selectedPlan && 
      plansQuery.data && 
      plansQuery.data.data && 
      plansQuery.data.data.plans
    ) {
      const cs = customerQuery.data.data.subscriptions.data[0];
      if (cs) {
        const sp = plansQuery.data.data.plans.filter((p) => p.id === cs.plan.id)[0];
        if (sp) {
          setSelectedPlan(sp);
          setDebugInfo(prev => ({ ...prev, planSet: true }));
        }
      }
    }
  }, [plansQuery.data, customerQuery.data, user, selectedPlan]);

  const cardsQuery = useQuery(
    ["CustomerCards", user.accountId],
    CustomerCards,
    { retry: false }
  );

  const invoicesQuery = useQuery(
    ["CustomerInvoices", user.accountId],
    CustomerInvoices,
    { retry: false }
  );

  // Check if we have all the required data
  const isDataLoading = customerQuery.isLoading || plansQuery.isLoading || cardsQuery.isLoading || invoicesQuery.isLoading;
  
  // Check if the selected plan is properly loaded for non-trial users
  const isPlanDataReady = isFreeTrial(user.account) || (selectedPlan !== null);

  // Handlers remain unchanged
  const handleConfirmAction = () => {
    const { type, data } = confirmDialog;
    switch (type) {
      case 'cancelSubscription':
        cancelSubscriptionMutate.mutate({ subscriptionId: data });
        break;
      case 'removeCard':
        removeCardMutate.mutate({ cardId: data });
        break;
      case 'setDefaultCard':
        setDefaultCardMutate.mutate({ cardId: data });
        break;
      default:
        console.log(`Unknown confirmDialog type: ${type}`);
    }
    setConfirmDialog({ open: false, type: null, data: null });
  };

  const redirectToCustomerPortalSession = async () => {
    const response = await customerPortalSessionMutate.mutateAsync();
    window.location.href = response.data.redirect_url;
  };

  const handleCancelSubscription = (subscriptionId) => {
    if (ENABLE_CUSTOMER_PORTAL) {
      return redirectToCustomerPortalSession();
    }
    setConfirmDialog({
      open: true,
      type: 'cancelSubscription',
      data: subscriptionId,
      title: t("dashboardPage.unsubscribe"),
      message: t("dashboardPage.areYouSureToUnsubscribe")
    });
  };

  const removeCard = (cardId) => {
    setConfirmDialog({
      open: true,
      type: 'removeCard',
      data: cardId,
      title: t("dashboardPage.removeCard"),
      message: t("dashboardPage.areYouSureToRemoveCard")
    });
  };

  const setDefaultCard = (cardId) => {
    setConfirmDialog({
      open: true,
      type: 'setDefaultCard',
      data: cardId,
      title: t("dashboardPage.makeDefault"),
      message: t("dashboardPage.areYouSureMakeDefault")
    });
  };

  const renderConfirmDialog = () => (
    <Dialog
      open={confirmDialog.open}
      onClose={() => setConfirmDialog({ open: false, type: null, data: null })}
    >
      <DialogTitle>{confirmDialog.title}</DialogTitle>
      <DialogContent>
        <Typography>{confirmDialog.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialog({ open: false, type: null, data: null })}>
          {t("dashboardPage.no")}
        </Button>
        <Button onClick={handleConfirmAction}>
          {t("dashboardPage.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Handle payment update function for UserInfo component
  const handleUpdatePayment = () => {
    if (ENABLE_CUSTOMER_PORTAL) {
      redirectToCustomerPortalSession();
    } else {
      window.location.href = "/card/add";
    }
  };

  // Prepare queries for the debug logger
  const queriesForDebug = [
    {
      name: "Plans Query",
      isLoading: plansQuery.isLoading,
      isError: plansQuery.isError,
      error: plansQuery.error,
      data: plansQuery.data
    },
    {
      name: "Customer Query",
      isLoading: customerQuery.isLoading,
      isError: customerQuery.isError,
      error: customerQuery.error,
      data: customerQuery.data
    },
    {
      name: "Cards Query",
      isLoading: cardsQuery.isLoading,
      isError: cardsQuery.isError,
      error: cardsQuery.error,
      data: cardsQuery.data
    },
    {
      name: "Invoices Query",
      isLoading: invoicesQuery.isLoading,
      isError: invoicesQuery.isError,
      error: invoicesQuery.error,
      data: invoicesQuery.data
    },
    {
      name: "State Variables",
      isLoading: false,
      isError: false,
      data: {
        selectedPlan,
        currentSubscription,
        debugInfo,
        isFreeTrial: isFreeTrial(user.account),
        user
      }
    }
  ];

  return (
    <>
      {isDataLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Loader />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {isFreeTrial(user.account) ? (
            <TrialComponent user={user} />
          ) : (
            <>
              {/* Using our reusable components */}
              <UserInfoDesktop
                user={user} 
                subscription={currentSubscription}
                hasFailedPayment={hasFailedPayment}
                onUpdatePayment={handleUpdatePayment}
                defaultViewMode="table"
              />
              
              {/* Only render SubscriptionInfoDesktop when selectedPlan is available */}
              {selectedPlan ? (
                <SubscriptionInfoDesktop
                  plan={selectedPlan}
                  subscription={currentSubscription}
                  onCancelSubscription={handleCancelSubscription}
                  formatMoney={formatMoney}
                  defaultViewMode="table"
                />
              ) : (
                <Grid item xs={12} md={6}>
                  <Box p={3} border={1} borderColor="warning.main" borderRadius={1}>
                    <Typography variant="h6" color="warning.main">
                      Plan Data Not Available
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Plan data could not be loaded. This might be due to:
                    </Typography>
                    <ul>
                      <li>Plans API request failed</li>
                      <li>Customer has no active subscription</li>
                      <li>Plan ID in subscription doesn't match available plans</li>
                    </ul>
                  </Box>
                </Grid>
              )}
              
              <PaymentMethodsDesktop
                cardsData={cardsQuery.data?.data || []}
                customerData={customerQuery.data?.data}
                enableCustomerPortal={ENABLE_CUSTOMER_PORTAL}
                onRemoveCard={removeCard}
                onSetDefaultCard={setDefaultCard}
                formatMoney={formatMoney}
                currency={selectedPlan?.currency}
                defaultViewMode="table"
              />
              
              <PaymentHistoryDesktop
                invoicesData={invoicesQuery.data?.data || []}
                currency={selectedPlan?.currency}
                formatMoney={formatMoney}
                defaultViewMode="table"
              />
              
              {renderConfirmDialog()}
            </>
          )}
        </Grid>
      )}
      
      {/* Debug Logger */}
      <QueryDebugLogger queries={queriesForDebug} isVisible={false} />
    </>
  );
};

export default DashboardPageDesktop;