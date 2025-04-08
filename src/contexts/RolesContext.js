import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const location = useLocation();
  const [allowedRoles, setAllowedRoles] = useState([]);

  useEffect(() => {
    if (location.pathname === "/DashboardTest") {
      setAllowedRoles(["admin", "user", "superadmin"]);
    } else if (location.pathname === "/teams") {
      setAllowedRoles(["admin", "user", "superadmin"]);
    } else if (location.pathname === "/teams/:teamId") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/user-teams") {
      setAllowedRoles(["user", "superadmin"]);
    } else if (location.pathname === "/card/add") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/plan/:planId/subscribe") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/plan") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/user/edit") {
      setAllowedRoles(["admin", "user", "superadmin"]);
    } else if (location.pathname === "/account/edit") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/users") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/create-user") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/edit-user/:userId") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/user/:userId") {
      setAllowedRoles(["admin", "superadmin"]);
    } else if (location.pathname === "/subscribers") {
      setAllowedRoles(["admin", "superadmin"]);
    } 
    // Workspace routes - only superadmin for now
    else if (location.pathname === "/workspaces") {
      setAllowedRoles(["superadmin"]);
    } else if (location.pathname === "/workspaces/create") {
      setAllowedRoles(["superadmin"]);
    } else if (location.pathname === "/workspaces/edit/:id") {
      setAllowedRoles(["superadmin"]);
    } else if (location.pathname === "/workspaces/view/:id") {
      setAllowedRoles(["superadmin"]);
    }
  }, [location.pathname]);

  return (
    <RolesContext.Provider value={allowedRoles}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  return useContext(RolesContext);
};