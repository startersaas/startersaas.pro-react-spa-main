// routes/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoles } from 'contexts/RolesContext';
import { usePlanType } from 'contexts/PlanTypeContext';
import { useAuth } from 'contexts/AuthContext';

// Add a loading component or use an existing one from your project
const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Loading...</div>
  </div>
);

export const PrivateRoute = ({ element: Component, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  const allowedRoles = useRoles();
  const planType = usePlanType();

  // Wait for authentication status to be determined
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  let allowed = isAuthenticated && user && allowedRoles.includes(user.role);

  if (planType && planType.length > 0) {
    allowed = allowed && planType.includes(user.account.planType);
  }

  if (!allowed) {
    return (
      <Navigate
        to="/dashboard"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Component {...rest} />;
};