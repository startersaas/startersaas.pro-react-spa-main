// pages/SubscriberPage.js
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import CustomerSubscriptionDisplay from 'components/ui/CustomerSubscriptionDisplay';
import { Container, Typography, Paper, Box, Chip } from '@mui/material';
import { isAccountActive } from 'libs/utils';

/**
 * SubscriberPage Component
 * 
 * Page component that handles authentication checking and renders
 * the CustomerSubscriptionDisplay component for admin users.
 * The number of records is determined by the user's subscription plan type.
 */
function SubscriberPage() {
  // Get user from auth context with empty object fallback for safety
  const { user = {} } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  
  // If user is not logged in, return early
  if (!user) {
    return null;
  }
  
  if (!isAdmin) {
    return <Navigate to="/auth/no-login" replace />;
  }

  // Determine number of records based on plan type
  const getRecordLimit = () => {
    // First check if account is active
    if (!isAccountActive(user.account)) {
      return 0; // No records if account isn't active
    }
    
    // Determine record limit based on plan type
    switch (user.account.planType) {
      case 'pro':
        return 100;
      case 'premium':
        return 50;
      case 'basic':
        return 10;
      default:
        return 5; // Fallback/default value
    }
  };
  
  // Get the record limit based on subscription
  const recordLimit = getRecordLimit();
  
  // Get status indicators
  const isActive = isAccountActive(user.account);
  const planType = user.account?.planType || 'none';
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Records Subscription
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome, {user.displayName || user.email}. Access your customer subscription below.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip 
            label={`Plan: ${planType.toUpperCase()}`} 
            color={planType === 'pro' ? 'success' : planType === 'premium' ? 'primary' : 'default'}
          />
          <Chip 
            label={`Status: ${isActive ? 'Active' : 'Inactive'}`}
            color={isActive ? 'success' : 'error'}
          />
          <Chip 
            label={`Records: ${recordLimit}`}
            color="info"
          />
        </Box>
        
        {isActive ? (
          <Box mt={4}>
            <CustomerSubscriptionDisplay 
              subscriberIdentifier={user.email}
              neededRecords={recordLimit}
              dbHost="localhost"
              dbName="dbName"
              dbTable="dbTable"
              dbUsername="dbUsername"
              dbPassword="dbPassword"
              showLogViewer={true}
              md5Length={16}
            />
          </Box>
        ) : (
          <Box mt={4} p={3} bgcolor="error.lighter" borderRadius={1}>
            <Typography variant="body1" color="error.main">
              Your subscription is inactive. Please update your subscription to access customer records.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default SubscriberPage;