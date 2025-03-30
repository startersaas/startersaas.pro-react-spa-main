// pages/Public/IndexPage
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawer } from 'contexts/DrawerContext';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Typography } from '@mui/material';

const IndexPage = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useDrawer(); // Added toggleDrawer from context

  // eslint-disable-next-line
  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigateOpen = (path) => {
    if (path === 'toggleDrawer') {
      toggleDrawer(); // Now it correctly calls toggleDrawer when needed
    } else {
      navigate(path);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      textAlign="center"
    >
      <HomeIcon 
        sx={{ fontSize: 60, mb: 2, cursor: 'pointer' }} 
        onClick={() => navigateOpen('/home-page')} 
      />
      <Typography variant="h5" fontWeight="bold">
        Your flat fee MLS buyer/seller listing data source
      </Typography>
    </Box>
  );
};

export default IndexPage;