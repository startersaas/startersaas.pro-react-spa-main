// pages/SubscriberPage.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import CustomerSubscriptionDisplay from 'components/ui/CustomerSubscriptionDisplay';
import { Container, Typography, Paper, Box } from '@mui/material';

/**
 * SubscriberPage Component
 * 
 * Page component that handles authentication checking and renders
 * the CustomerSubscriptionDisplay component for admin users.
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
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Records Subscription
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome, {user.displayName || user.email}. Access your customer subscription below.
        </Typography>
        
        <Box mt={4}>
          <CustomerSubscriptionDisplay 
            subscriberIdentifier={user.email}
            neededRecords={100}
            dbHost="localhost"
            dbName="dbName"
            dbTable="dbTable"
            dbUsername="dbUsername"
            dbPassword="dbPassword"
            showLogViewer={true}
            md5Length={16}
          />
        </Box>
      </Paper>
    </Container>
  );
}

export default SubscriberPage;