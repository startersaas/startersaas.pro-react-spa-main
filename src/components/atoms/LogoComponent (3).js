import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { styled, keyframes } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Animation keyframes
// Subtle pulse animation for text
const electricPulse = keyframes`
  0% { opacity: 1; }
  10% { opacity: 0.98; }
  15% { opacity: 0.9; }
  20% { opacity: 1; }
  22% { opacity: 0.9; }
  23% { opacity: 1; }
  80% { opacity: 1; }
  90% { opacity: 0.96; }
  92% { opacity: 1; }
  100% { opacity: 1; }
`;

// Enhanced dramatic pulse animation for IconButton - no scaling, more random
const enhancedPulse = keyframes`
  0% { opacity: 1; }
  7% { opacity: 0.75; }
  12% { opacity: 0.91; }
  19% { opacity: 0.84; }
  26% { opacity: 1; }
  37% { opacity: 0.88; }
  44% { opacity: 0.96; }
  51% { opacity: 0.82; }
  63% { opacity: 0.93; }
  72% { opacity: 0.79; }
  84% { opacity: 0.95; }
  91% { opacity: 0.86; }
  100% { opacity: 1; }
`;

// Enhanced styled Typography with more professional styling
const StyledTypography = styled(Typography)(({ fontSize, darkMode }) => ({
  flex: '0 0 auto',
  fontWeight: 900, // Maximum font weight as requested
  fontSize, // Dynamic font size passed as prop
  fontFamily: 'Roboto Condensed, sans-serif', // Ensuring fallback fonts
  position: 'relative',
  display: 'inline-block',
  letterSpacing: '-0.5px', // Adjusted for better readability
  padding: 0, // No padding as requested
  margin: 0, // No margin as requested
  height: 'auto',
  lineHeight: 1.1, // Slightly improved line height
  borderRadius: 20,
  border: 'none',
  textTransform: 'none',
  color: darkMode ? 'white' : 'black',
  // Sharp text shadow to enhance boldness without blur
  textShadow: '0.5px 0.5px 0px rgba(0, 0, 0, 0.2), -0.2px -0.2px 0px rgba(0, 0, 0, 0.1)',
  // Gradient background with very subtle transparency
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
  // Static electricity effect using CSS variables for primary.main
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(var(--primary-main-rgb), 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 2,
    opacity: 0.5,
    filter: 'blur(4px)',
    transition: 'opacity 0.2s',
  },
  // Electric pulse effect - keep subtle for text
  animation: `${electricPulse} 4s infinite`,
  // Maintaining primary color with refinements
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
}));

// Wrapper for the entire logo component with simplified styling
const LogoWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0px',
  transition: 'all 0.3s ease',
  background: 'transparent',
});

const LogoComponent = ({ 
  darkMode, 
  isHomePage, 
  navigateOpen, 
  logoText = "startersaas.pro", // Maintained as requested
  linkTo = "/",
  showPlayIcon = true
}) => {
  // CSS variable calculation for primary color
  const calculatePrimaryRgb = (primaryMainColor) => {
    // Handle hex colors (e.g. #1976d2)
    if (primaryMainColor.startsWith('#')) {
      const r = parseInt(primaryMainColor.slice(1, 3), 16);
      const g = parseInt(primaryMainColor.slice(3, 5), 16);
      const b = parseInt(primaryMainColor.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }
    // Default fallback for MUI primary blue
    return '25, 118, 210';
  };
  
  // Define breakpoints according to your specifications
  const isXs = useMediaQuery('(max-width: 599px)');
  const isSm = useMediaQuery('(min-width: 600px) and (max-width: 959px)');
  const isMd = useMediaQuery('(min-width: 960px) and (max-width: 1279px)');
  const isLg = useMediaQuery('(min-width: 1280px) and (max-width: 1919px)');
  const isXl = useMediaQuery('(min-width: 1920px)');
  
  // Determine font size based on viewport - increased for all sizes
  const getFontSize = () => {
    if (isXs) return 'calc(3vh + 1vw)';       // Increased for mobile
    if (isSm) return 'calc(5vh + 1vw)';       // 600px breakpoint
    if (isMd) return 'calc(5.5vh + 1vw)';     // 960px breakpoint
    if (isLg) return 'calc(6vh + 1vw)';       // 1280px breakpoint
    if (isXl) return 'calc(6.5vh + 1vw)';     // 1920px breakpoint
    return '4rem'; // Increased fallback
  };
  
  // Get the responsive icon size based on the logo font size
  const getIconSize = () => {
    if (isXs) return '2rem';             // Slightly larger for mobile
    if (isSm) return '2.7rem';           // 600px breakpoint
    if (isMd) return '3rem';             // 960px breakpoint
    if (isLg) return '3.2rem';           // 1280px breakpoint
    if (isXl) return '3.5rem';           // 1920px breakpoint
    return '3rem'; // Fallback
  };

  const fontSize = getFontSize();
  const iconSize = getIconSize();
  
  // Style variant based on dark mode prop
  const wrapperSx = {
    ...(darkMode ? {
      background: 'linear-gradient(90deg, rgba(30, 30, 30, 0.4) 0%, rgba(30, 30, 30, 0.1) 100%)',
    } : {})
  };
  
  // Attach the CSS variable to the root element
  React.useEffect(() => {
    document.documentElement.style.setProperty('--primary-main-rgb', calculatePrimaryRgb('#1976d2'));
    
    // Random movement for the electricity effect
    const interval = setInterval(() => {
      document.documentElement.style.setProperty('--x', `${Math.random() * 100}%`);
      document.documentElement.style.setProperty('--y', `${Math.random() * 100}%`);
    }, 150);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <LogoWrapper className="logo-component" sx={wrapperSx}>
      <Link 
        to={linkTo} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none', 
          cursor: 'pointer' 
        }}
      >
        <StyledTypography 
          fontSize={fontSize}
          darkMode={darkMode}
        >
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
            ml: '-5px', // Restored to original 5px
            // Dramatically enhanced pulse effect for icon
            animation: `${enhancedPulse} 1.5s infinite`,
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          <HomeIcon 
            sx={{ 
              fontSize: iconSize, 
              color: darkMode ? 'white' : 'primary.main',
              // Electric effect with primary color
              filter: 'drop-shadow(0 0 3px rgba(var(--primary-main-rgb), 0.5))',
            }} 
          />
        </IconButton>
      )}
    </LogoWrapper>
  );
};

export default LogoComponent;