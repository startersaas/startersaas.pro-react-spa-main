import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoles } from 'contexts/RolesContext';
import { usePlanType } from 'contexts/PlanTypeContext';
import { useAuth } from 'contexts/AuthContext';
import { getSuperToken } from 'libs/utils';

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

  const [tokenStatus, setTokenStatus] = useState('checking'); // 'checking', 'valid', 'missing'

  const requiresSuperAdmin = allowedRoles.length === 1 && allowedRoles.includes('superadmin');

  useEffect(() => {
    if (!requiresSuperAdmin) {
      setTokenStatus('valid');
      return;
    }

    const timeout = setTimeout(() => {
      const token = getSuperToken();
      setTokenStatus(token ? 'valid' : 'missing');
    }, 100); // Delay before checking

    return () => clearTimeout(timeout);
  }, [requiresSuperAdmin]);

  if (isLoading || tokenStatus === 'checking') {
    return <LoadingComponent />;
  }

  if (!isAuthenticated || tokenStatus === 'missing') {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  let allowed = isAuthenticated && user && allowedRoles.includes(user.role);

  if (planType?.length > 0) {
    allowed = allowed && planType.includes(user.account.planType);
  }

  if (!allowed) {
    return <Navigate to="/dashboard" state={{ from: location.pathname }} replace />;
  }

  return <Component {...rest} />;
};