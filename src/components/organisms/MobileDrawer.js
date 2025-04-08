import React, { useState } from 'react';
import { Drawer as MUIDrawer, Box, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDarkMode } from 'contexts/DarkMode';
import { Person as UserIcon } from '@mui/icons-material';
import { Group as UsersIcon } from '@mui/icons-material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';
import { Home as HomeIcon } from '@mui/icons-material';
import { FolderSpecial as WorkspacesIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Create motion-enhanced components
const MotionListItem = motion(ListItem);
const MotionBox = motion(Box);

const MobileDrawer = ({ open, toggleDrawer, isAdmin = false, isAuthPath = false }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);
  const [clickCount, setClickCount] = useState({});

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleItemClick = (path) => {
    // If clicking on a different item than the previously selected one, reset the previous selection
    if (selectedItem && selectedItem !== path) {
      setSelectedItem(null);
      setClickCount({});
    }
    
    // Get current click count for this path
    const currentClickCount = clickCount[path] || 0;
    const newClickCount = currentClickCount + 1;
    
    // First click: Select the item and highlight it
    if (newClickCount === 1) {
      setSelectedItem(path);
      setClickCount({ [path]: newClickCount });
    } 
    // Second click: Navigate
    else if (newClickCount === 2) {
      if (path === 'toggleDashboardDrawer') {
        toggleDrawer();
      } else {
        navigate(path);
        toggleDrawer();
      }
      // Reset after navigation
      setSelectedItem(null);
      setClickCount({});
    } 
    // Any additional clicks: Reset
    else {
      setSelectedItem(null);
      setClickCount({});
    }
  };

  // Animation variants
  const listItemVariants = {
    initial: { 
      backgroundColor: 'transparent',
      scale: 1,
    },
    selected: { 
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(144, 202, 249, 0.16)' 
        : 'rgba(33, 150, 243, 0.08)',
      scale: 1.05,
      transition: {
        backgroundColor: { duration: 0.3 },
        scale: { 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }
      }
    }
  };

  const iconTextVariants = {
    initial: {
      x: 0,
    },
    selected: {
      x: 10,
      transition: {
        type: "spring", 
        stiffness: 500, 
        damping: 15
      }
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
          {!isAdmin ? (
            <List>
              <MotionListItem
                onClick={() => handleItemClick('/home-page')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/home-page' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/home-page' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="HOME" />
                </MotionBox>
              </MotionListItem>
              
              <MotionListItem
                onClick={() => handleItemClick('/auth/login')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/auth/login' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/auth/login' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <UserIcon />
                  </ListItemIcon>
                  <ListItemText primary="LOGIN" />
                </MotionBox>
              </MotionListItem>

              <MotionListItem
                onClick={() => handleItemClick('/auth/register')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/auth/register' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/auth/register' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <UsersIcon />
                  </ListItemIcon>
                  <ListItemText primary="SIGNUP" />
                </MotionBox>
              </MotionListItem>
            </List>
          ) : (
            <List>
              <MotionListItem
                onClick={() => handleItemClick('/users')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/users' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/users' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <UserIcon />
                  </ListItemIcon>
                  <ListItemText primary="USERS" />
                </MotionBox>
              </MotionListItem>

              <MotionListItem
                onClick={() => handleItemClick('/teams')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/teams' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/teams' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <UsersIcon />
                  </ListItemIcon>
                  <ListItemText primary="TEAMS" />
                </MotionBox>
              </MotionListItem>

              <MotionListItem
                onClick={() => handleItemClick('/plan')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/plan' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/plan' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <MoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary="PLAN" />
                </MotionBox>
              </MotionListItem>

              <MotionListItem
                onClick={() => handleItemClick('/workspaces')}
                sx={{
                  cursor: 'pointer',
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 1,
                }}
                variants={listItemVariants}
                initial="initial"
                animate={selectedItem === '/workspaces' ? 'selected' : 'initial'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MotionBox 
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  variants={iconTextVariants}
                  initial="initial"
                  animate={selectedItem === '/workspaces' ? 'selected' : 'initial'}
                >
                  <ListItemIcon>
                    <WorkspacesIcon />
                  </ListItemIcon>
                  <ListItemText primary="WORKSPACES" />
                </MotionBox>
              </MotionListItem>
            </List>
          )}
        </Box>
      </Box>
    </MUIDrawer>
  );
};

export default MobileDrawer;