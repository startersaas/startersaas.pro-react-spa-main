import React, { useState } from 'react';
import {
  Grid,
  CssBaseline,
  ThemeProvider,
  Box,
  useMediaQuery,
  IconButton,
  GlobalStyles,
} from '@mui/material';
import getTheme from 'themes/Theme';
import MobileDrawer from 'components/organisms/MobileDrawer';
import { SnackBar } from 'components/elements/SnackBar';
import Footer from 'components/organisms/Footer';
import { useDarkMode } from 'contexts/DarkMode';
import { useTvMode } from 'contexts/TvMode';
import { useDrawer } from 'contexts/DrawerContext';
import { useLocation } from 'react-router-dom';
import RocketIcon from '@mui/icons-material/Rocket';
import getNewTheme from 'themes/NewTheme';
import TopIcons from 'components/organisms/TopIcons';
import { AppBarProvider } from 'contexts/AppBarContext';
import BottomNavigation from 'components/ecosystems/BottomNavigation';
import AdaptiveLayout from 'components/elements/AdaptiveLayout';

const AuthLayout = ({ children }) => {
  const { darkMode } = useDarkMode();
  const { tvMode } = useTvMode();
  const { drawerOpen, toggleDrawer } = useDrawer();
  const isXs = useMediaQuery('(max-width:600px)');
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [useTheme, setUseTheme] = useState(false);

  const theme = useTheme
    ? isHomePage
      ? getNewTheme(darkMode)
      : getNewTheme(darkMode, isXs)
    : isHomePage
    ? getTheme(darkMode)
    : getTheme(darkMode, isXs);

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

          <IconButton
            onClick={() => setUseTheme(!useTheme)}
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              color: useTheme ? '#61dafb' : 'inherit',
              zIndex: 1501,
            }}
          >
            <RocketIcon sx={{ fontSize: '3rem' }} />
          </IconButton>

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
                <TopIcons 
                  isXs={isXs} 
                  isHomePage={isHomePage} 
                  useTheme={useTheme} 
                />
              </AdaptiveLayout>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <MobileDrawer anchor="left" open={drawerOpen} toggleDrawer={toggleDrawer} />
              <BottomNavigation visible={useTheme} backgroundColor="#2196f3" opacity={0.85} fontSize="0.8rem" />
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

export default AuthLayout;