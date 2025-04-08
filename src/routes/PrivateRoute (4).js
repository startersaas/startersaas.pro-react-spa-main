// routes/PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoles } from 'contexts/RolesContext';
import { usePlanType } from 'contexts/PlanTypeContext';
import { useAuth } from 'contexts/AuthContext';
import { getSuperToken } from 'libs/utils';

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
  const [tokenCheckComplete, setTokenCheckComplete] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(true);

  // One-time token check on first render
  useEffect(() => {
    const requiresSuperAdmin = allowedRoles.length === 1 && allowedRoles.includes('superadmin');
    
    if (requiresSuperAdmin) {
      // First try synchronously
      const initialToken = getSuperToken();
      if (initialToken) {
        setHasValidToken(true);
        setTokenCheckComplete(true);
      } else {
        // If not available, try with a small delay
        setTimeout(() => {
          const token = getSuperToken();
          setHasValidToken(!!token);
          setTokenCheckComplete(true);
        }, 100);
      }
    } else {
      // Not a superadmin route, no need to check
      setTokenCheckComplete(true);
    }
  }, [allowedRoles]);

  // Show loading while checking token
  if (isLoading || !tokenCheckComplete) {
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

  // Route requires superadmin but no valid token
  const requiresSuperAdmin = allowedRoles.length === 1 && allowedRoles.includes('superadmin');
  if (requiresSuperAdmin && !hasValidToken) {
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