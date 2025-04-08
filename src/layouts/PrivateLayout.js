import React, { useState } from 'react';
import {
  Grid,
  CssBaseline,
  ThemeProvider,
  Box,
  useMediaQuery,
  GlobalStyles,
} from '@mui/material';
import getTheme from 'themes/Theme';
import MobileDrawer from 'components/organisms/MobileDrawer';
import { SnackBar } from 'components/elements/SnackBar';
import Footer from 'components/organisms/Footer';
import { useAuth } from 'contexts/AuthContext';
import { useDarkMode } from 'contexts/DarkMode';
import { useRetroTvMode } from 'contexts/RetroTvMode';
import { useDrawer } from 'contexts/DrawerContext';
import { useLocation } from 'react-router-dom';
import getNewTheme from 'themes/NewTheme';
import TopIconsPrivate from 'components/organisms/TopIconsPrivate';
import { AppBarProvider } from 'contexts/AppBarContext';
import BottomNavigation from 'components/ecosystems/BottomNavigation';
import AdaptiveLayout from 'components/elements/AdaptiveLayout';
import ThemeToggleButtons from 'components/electrons/ThemeToggleButtons';

const PrivateLayout = ({ children }) => {
  const { darkMode } = useDarkMode();
  const { useTheme, setUseTheme, usePanel, setUsePanel } = useRetroTvMode();
  const { drawerOpen, toggleDrawer } = useDrawer();
  const isXs = useMediaQuery('(max-width:600px)');
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Get user from auth context with empty object fallback for safety
  const { user = {} } = useAuth();
  
  // Check if user is admin (includes superadmin)
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.isAdmin === true;
  
  // Determine if we're on an auth path
  const isAuthPath = location.pathname.startsWith('/auth');

  const theme = useTheme
    ? isHomePage
      ? getNewTheme(darkMode)
      : getNewTheme(darkMode, isXs)
    : isHomePage
    ? getTheme(darkMode)
    : getTheme(darkMode, isXs);

  // Toggle handlers
  const toggleThemeMode = () => setUseTheme(prev => !prev);
  const togglePanelMode = () => setUsePanel(prev => !prev);

  return (
    <AppBarProvider>
      <ThemeProvider theme={theme}>
        <SnackBar>
          <CssBaseline />
          <GlobalStyles
            styles={{
              'html, body': {
                minHeight: '100vh',
                margin: 0,
                padding: 0,
              },
            }}
          />

          <ThemeToggleButtons
            toggleThemeMode={toggleThemeMode}
            useTheme={useTheme}
            togglePanelMode={togglePanelMode}
            usePanel={usePanel}
            fontSize="3rem"
          />

          <Grid container columns={12} sx={{ width: '100%', margin: 0, padding: 0 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <AdaptiveLayout
                backgroundColor={null}
                marginY={0}
                paddingY={0}
                paddingX={0}
                centered={true}
                fullWidth={true}
                useInnerWrapper={false}
              >
                <TopIconsPrivate 
                  isXs={isXs} 
                  isHomePage={isHomePage} 
                  useTheme={useTheme} 
                  user={user} 
                />
              </AdaptiveLayout>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <MobileDrawer 
                anchor="left" 
                open={drawerOpen} 
                toggleDrawer={toggleDrawer} 
                isAdmin={isAdmin}
                isAuthPath={isAuthPath}
              />
              <BottomNavigation visible={useTheme && usePanel} backgroundColor="#2196f3" opacity={0.85} fontSize="0.8rem" />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ minHeight: { xs: '100vh' }, width: '100%' }}>
                <Box sx={{ height: '100%', width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ width: { xs: '100%' } }}>{children}</Box>
                    <AdaptiveLayout 
                      backgroundColor={null}
                      marginY={0}
                      paddingY={2}
                      paddingX={0}
                      centered={true}
                      fullWidth={true}
                      useInnerWrapper={false}
                    >
                      <Footer 
                        display={false} 
                        paddingX={0} 
                      />
                    </AdaptiveLayout>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </SnackBar>
      </ThemeProvider>
    </AppBarProvider>
  );
};

export default PrivateLayout;