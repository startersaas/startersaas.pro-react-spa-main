// /components/organisms/DashboardDrawer.js
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person as UserIcon } from '@mui/icons-material';
import { Group as UsersIcon } from '@mui/icons-material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Assuming you're using i18next for translations
import { useAuth } from "contexts/AuthContext";

const DashboardDrawer = ({ open, toggleDashboardDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth() || {}; // Add fallback empty object if useAuth() returns null/undefined
  
  // Check if the current path starts with '/auth'
  const isAuthPath = location.pathname.startsWith('/auth');
  
  // eslint-disable-next-line
  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigateOpen = (path) => {
    if (path === 'toggleDashboardDrawer') {
      toggleDashboardDrawer();
    } else {
      navigate(path);
      toggleDashboardDrawer();
    }
  };
  
  // Check if user exists and has role property, and if that role is "admin"
  const isAdmin = user && user.role === "admin";
  
  // Keeping the exact same Drawer component and props, with content inline
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => toggleDashboardDrawer(false)}
      PaperProps={{
        sx: {
          zIndex: 2000,
          height: '100vh',
          borderRadius: 0,
        },
      }}
    >
      <Box sx={{ height: "100%", p: 3 }}>
        {isAuthPath ? (
          <List>
            <ListItem
              onClick={() => navigateOpen('/auth/login')}
              sx={{
                cursor: 'pointer',
                textDecoration: "none",
                display: "flex",
                width: "100%",
                alignItems: "center",
              }}
            >
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              <ListItemText primary="LOGIN" />
            </ListItem>

            <ListItem
              onClick={() => navigateOpen('/auth/register')}
              sx={{
                cursor: 'pointer',
                textDecoration: "none",
                display: "flex",
                width: "100%",
                alignItems: "center",
              }}
            >
              <ListItemIcon>
                <UsersIcon />
              </ListItemIcon>
              <ListItemText primary="SIGNUP" />
            </ListItem>

          </List>
        ) : (
          isAdmin && (
            <List>
              <ListItem
                onClick={() => navigateOpen('/users')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText primary={t("privateLayout.users")} />
              </ListItem>

              <ListItem
                onClick={() => navigateOpen('/teams')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ListItemIcon>
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText primary="TEAMS" />
              </ListItem>

              <ListItem
                onClick={() => navigateOpen('/plan')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ListItemIcon>
                  <MoneyIcon />
                </ListItemIcon>
                <ListItemText primary={t("dashboardPage.plan").toUpperCase()} />
              </ListItem>
            </List>
          )
        )}
      </Box>
    </Drawer>
  );
};

export default DashboardDrawer;

