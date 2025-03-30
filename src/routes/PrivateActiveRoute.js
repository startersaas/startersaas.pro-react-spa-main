// routes/PrivateActiveRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoles } from '../contexts/RolesContext';
import { usePlanType } from '../contexts/PlanTypeContext';
import { useAuth } from '../contexts/AuthContext';
import { isAccountActive } from '../libs/utils';

// Add a loading component or use an existing one from your project
const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Loading...</div>
  </div>
);

export const PrivateActiveRoute = ({ element: Component, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  const allowedRoles = useRoles();
  const planType = usePlanType();

  // Wait for authentication status to be determined
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Only check authentication after loading is complete
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  const allowed = isAuthenticated && 
    user && 
    allowedRoles.includes(user.role) && 
    (!planType.length || planType.includes(user.account.planType)) &&
    isAccountActive(user.account);

  if (!allowed) {
    return (
      <Navigate
        to="/plan"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Component {...rest} />;
};