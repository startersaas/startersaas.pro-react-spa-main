// components/organisms/MobileDrawer.js
import React from 'react';
import { Drawer as MUIDrawer, Box, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDarkMode } from 'contexts/DarkMode';
import { Person as UserIcon } from '@mui/icons-material';
import { Group as UsersIcon } from '@mui/icons-material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';
import { Home as HomeIcon } from '@mui/icons-material';

const MobileDrawer = ({ open, toggleDrawer, isAdmin = false, isAuthPath = false }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const theme = useTheme();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigateOpen = (path) => {
    if (path === 'toggleDashboardDrawer') {
      toggleDrawer();
    } else {
      navigate(path);
      toggleDrawer();
    }
  };

  return (
    <MUIDrawer
      anchor="left"
      open={open}
      onClose={() => toggleDrawer(false)}
      PaperProps={{
        sx: {
          zIndex: 2000,
          height: '100vh',
          borderRadius: 0,
          background: theme.palette.background.default,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'initial',
          transition: 'transform 1s ease',
        }}
      >
        <Box sx={{ height: "100%", p: 3 }}>
          {!isAuthPath ? (
            <List>
              <ListItem
                onClick={() => navigateOpen('/home-page')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="HOME" />
              </ListItem>
              
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
                  <ListItemText primary="USERS" />
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
                  <ListItemText primary="PLAN" />
                </ListItem>
              </List>
            )
          )}
        </Box>
      </Box>
    </MUIDrawer>
  );
};

export default MobileDrawer;