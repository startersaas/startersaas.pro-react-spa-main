import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Enhanced styled Typography with professional styling and a subtle hover scale effect
const StyledTypography = styled(Typography)(({ fontSize, darkMode }) => ({
  flex: '0 0 auto',
  fontWeight: 900,
  fontSize,
  fontFamily: 'Roboto Condensed, sans-serif',
  position: 'relative',
  display: 'inline-block',
  letterSpacing: '-0.5px',
  padding: 0,
  margin: 0,
  height: 'auto',
  lineHeight: 1.1,
  borderRadius: 20,
  border: 'none',
  textTransform: 'none',
  color: darkMode ? 'white' : 'black',
  textShadow:
    '0.5px 0.5px 0px rgba(0, 0, 0, 0.2), -0.2px -0.2px 0px rgba(0, 0, 0, 0.1)',
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background:
      'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(var(--primary-main-rgb), 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 2,
    opacity: 0.5,
    filter: 'blur(4px)',
    transition: 'opacity 0.2s',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: '10%',
    width: '80%',
    height: 2,
    backgroundColor: 'primary.main',
    opacity: 0.7,
    borderRadius: 4,
  },
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

// Divider styled as a thick horizontal bar that spans the width
const DividerBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 4,
  backgroundColor: theme.palette.primary.main,
  margin: '8px 0',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scaleX(1.02)',
  },
}));

// Wrapper for the entire logo component with a hover effect on the whole container
const LogoWrapper = styled(Box)(({ darkMode }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0px',
  transition: 'all 0.3s ease',
  background: 'transparent',
  '&:hover': {
    filter: 'brightness(1.02)',
  },
}));

const LogoComponent = ({
  darkMode,
  isHomePage,
  navigateOpen,
  logoText = 'startersaas.pro',
  linkTo = '/',
  showPlayIcon = true,
}) => {
  // Calculate primary color's RGB value
  const calculatePrimaryRgb = (primaryMainColor) => {
    if (primaryMainColor.startsWith('#')) {
      const r = parseInt(primaryMainColor.slice(1, 3), 16);
      const g = parseInt(primaryMainColor.slice(3, 5), 16);
      const b = parseInt(primaryMainColor.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }
    return '25, 118, 210';
  };

  // Breakpoints
  const isXs = useMediaQuery('(max-width: 599px)');
  const isSm = useMediaQuery('(min-width: 600px) and (max-width: 959px)');
  const isMd = useMediaQuery('(min-width: 960px) and (max-width: 1279px)');
  const isLg = useMediaQuery('(min-width: 1280px) and (max-width: 1919px)');
  const isXl = useMediaQuery('(min-width: 1920px)');

  // Responsive font size determination
  const getFontSize = () => {
    if (isXs) return 'calc(3vh + 1vw)';
    if (isSm) return 'calc(5vh + 1vw)';
    if (isMd) return 'calc(5.5vh + 1vw)';
    if (isLg) return 'calc(6vh + 1vw)';
    if (isXl) return 'calc(6.5vh + 1vw)';
    return '4rem';
  };

  // Responsive icon size determination
  const getIconSize = () => {
    if (isXs) return '2rem';
    if (isSm) return '2.7rem';
    if (isMd) return '3rem';
    if (isLg) return '3.2rem';
    if (isXl) return '3.5rem';
    return '3rem';
  };

  const fontSize = getFontSize();
  const iconSize = getIconSize();

  // Wrapper style variant for dark mode
  const wrapperSx = {
    ...(darkMode && {
      background:
        'linear-gradient(90deg, rgba(30, 30, 30, 0.4) 0%, rgba(30, 30, 30, 0.1) 100%)',
    }),
  };

  // Set CSS variable for primary color and update electric effect variables
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--primary-main-rgb',
      calculatePrimaryRgb('#1976d2')
    );

    const interval = setInterval(() => {
      document.documentElement.style.setProperty(
        '--x',
        `${Math.random() * 100}%`
      );
      document.documentElement.style.setProperty(
        '--y',
        `${Math.random() * 100}%`
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <DividerBar />
      <LogoWrapper className="logo-component" sx={wrapperSx} darkMode={darkMode}>
        <Link
          to={linkTo}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <StyledTypography fontSize={fontSize} darkMode={darkMode}>
            {logoText}
          </StyledTypography>
        </Link>
        {showPlayIcon && (
          <IconButton
            aria-label="dashboard"
            onClick={navigateOpen}
            size="large"
            sx={{
              fontSize: iconSize,
              width: iconSize,
              height: iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: '-5px',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              },
              '&:active': {
                transform: 'scale(0.97)',
              },
            }}
          >
            <HomeIcon
              sx={{
                fontSize: iconSize,
                color: darkMode ? 'white' : 'primary.main',
                filter: 'drop-shadow(0 0 3px rgba(var(--primary-main-rgb), 0.5))',
              }}
            />
          </IconButton>
        )}
      </LogoWrapper>
      <DividerBar />
    </Box>
  );
};

export default LogoComponent;