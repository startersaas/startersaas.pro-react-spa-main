import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Enhanced styled Typography with Monoton font and increased size
const StyledTypography = styled(Typography)(({ fontSize }) => ({
  flex: '0 0 auto',
  fontWeight: 400, // Monoton works better with normal weight
  fontSize,
  fontFamily: '"Monoton Regular", "Roboto", sans-serif',
  position: 'relative',
  display: 'inline-block',
  letterSpacing: '0.05em',
  padding: 0,
  margin: 0,
  height: 'auto',
  lineHeight: 1.1,
  border: 'none',
  textTransform: 'none',
  color: 'white', // Set to white regardless of dark mode
}));

// Wrapper with simplified styling
const LogoWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0px',
  transition: 'all 0.3s ease',
  background: 'transparent',
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

  // Responsive font size determination with 1.5x sizing
  const getFontSize = () => {
    if (isXs) return 'calc(4.5vh + 1.5vw)';
    if (isSm) return 'calc(7.5vh + 1.5vw)';
    if (isMd) return 'calc(8.25vh + 1.5vw)';
    if (isLg) return 'calc(9vh + 1.5vw)';
    if (isXl) return 'calc(9.75vh + 1.5vw)';
    return '6rem'; // 1.5x the original 4rem
  };

  // Responsive icon size determination with 1.5x sizing
  const getIconSize = () => {
    if (isXs) return '3rem'; // 1.5x the original 2rem
    if (isSm) return '4.05rem'; // 1.5x the original 2.7rem
    if (isMd) return '4.5rem'; // 1.5x the original 3rem
    if (isLg) return '4.8rem'; // 1.5x the original 3.2rem
    if (isXl) return '5.25rem'; // 1.5x the original 3.5rem
    return '4.5rem'; // 1.5x the original 3rem
  };

  const fontSize = getFontSize();
  const iconSize = getIconSize();

  // Set CSS variable for primary color
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--primary-main-rgb',
      calculatePrimaryRgb('#0fa0af') // Updated to use the teal color
    );
    
    // Dynamically load the Monoton font if not already present
    const monotonFont = document.createElement('link');
    monotonFont.rel = 'stylesheet';
    monotonFont.href = 'https://fonts.googleapis.com/css2?family=Monoton:wght@400&display=swap';
    document.head.appendChild(monotonFont);
    
    return () => {
      document.head.removeChild(monotonFont);
    };
  }, []);

  return (
    <LogoWrapper className="logo-component">
      <Link
        to={linkTo}
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <StyledTypography fontSize={fontSize} sx={{ lineHeight: 0.8 }}>
            Starter
          </StyledTypography>
          <StyledTypography fontSize={fontSize} sx={{ lineHeight: 0.8 }}>
            Saas
          </StyledTypography>
          <StyledTypography fontSize={fontSize} sx={{ lineHeight: 0.8 }}>
            .pro
          </StyledTypography>
        </Box>
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
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          <HomeIcon
            sx={{
              fontSize: iconSize,
              color: 'white', // Set to white regardless of dark mode
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))', // Subtle white shadow
            }}
          />
        </IconButton>
      )}
    </LogoWrapper>
  );
};

export default LogoComponent;