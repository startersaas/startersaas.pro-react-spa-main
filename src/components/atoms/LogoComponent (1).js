import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledTypography = styled(Typography)(({ darkMode, isHomePage, fontSize }) => ({
  flex: '0 0 auto',
  fontWeight: 700,
  fontSize, // Dynamic font size passed as prop
  fontFamily: 'Roboto Condensed', // Updated font family
  position: 'relative',
  display: 'inline-block',
  letterSpacing: '-1px',
  px: '10px',
  textShadow: darkMode ? '0 0 10px rgba(97, 218, 251, 0.6), 0 0 15px rgba(97, 218, 251, 0.4)' : 'none',
  minHeight: 0,
  height: 'auto',
  lineHeight: 1,
  borderRadius: 20,
  border: 'none',
  textTransform: 'none',
  color: darkMode ? 'white' : 'black',

  '& > span': {
    position: 'relative',
    zIndex: 2,
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(
      45deg, 
      rgba(97, 218, 251, 0.3) 0%, 
      rgba(97, 218, 251, 0.6) 25%, 
      rgba(97, 218, 251, 0.1) 50%, 
      rgba(97, 218, 251, 0.6) 75%, 
      rgba(97, 218, 251, 0.3) 100%
      )`,
    opacity: 0.6,
    filter: 'blur(50px)',
    zIndex: 1,
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      0deg,
      rgba(97, 218, 251, 0.1) 0px, 
      rgba(97, 218, 251, 0.1) 1px, 
      transparent 1px, 
      transparent 2px
    )`,
    opacity: 0.4,
    animation: 'scanLines 3s linear infinite',
    zIndex: 2,
  },

  '&:hover': {
    transform: 'scale(1.03)',
    textShadow: '0 0 15px rgba(97, 218, 251, 0.8)',
  },
}));

const LogoComponent = ({ 
  darkMode, 
  isHomePage, 
  navigateOpen, 
  logoText = "startersaas.pro", // Updated domain name
  linkTo = "/",
  showPlayIcon = true
}) => {
  // Define breakpoints according to your specifications
  const isXs = useMediaQuery('(max-width: 599px)');
  const isSm = useMediaQuery('(min-width: 600px) and (max-width: 959px)');
  const isMd = useMediaQuery('(min-width: 960px) and (max-width: 1279px)');
  const isLg = useMediaQuery('(min-width: 1280px) and (max-width: 1919px)');
  const isXl = useMediaQuery('(min-width: 1920px)');
  
  // Determine font size based on viewport
  const getFontSize = () => {
    if (isXs) return 'calc(2vh + 0.5vw)';       // Much smaller for mobile
    if (isSm) return 'calc(4.5vh + 0.5vw)';     // 600px breakpoint
    if (isMd) return 'calc(5vh + 0.5vw)';       // 960px breakpoint
    if (isLg) return 'calc(5.5vh + 0.5vw)';     // 1280px breakpoint
    if (isXl) return 'calc(6vh + 0.5vw)';       // 1920px breakpoint
    return '3rem'; // Fallback
  };
  
  // Get the responsive icon size based on the logo font size
  const getIconSize = () => {
    if (isXs) return '1.8rem';                  // Smaller icon for mobile
    if (isSm) return '2.7rem';                  // 600px breakpoint
    if (isMd) return '3rem';                    // 960px breakpoint
    if (isLg) return '3.2rem';                  // 1280px breakpoint
    if (isXl) return '3.5rem';                  // 1920px breakpoint
    return '3rem'; // Fallback
  };

  const fontSize = getFontSize();
  const iconSize = getIconSize();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          darkMode={darkMode} 
          isHomePage={isHomePage}
          fontSize={fontSize}
        >
          <span>{logoText}</span>
        </StyledTypography>
      </Link>
      {showPlayIcon && (
        <IconButton
          color="primary"
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
          }}
        >
          <PlayCircleFilledIcon 
            sx={{ 
              fontSize: iconSize, 
              color: darkMode ? 'white' : 'black',
            }} 
          />
        </IconButton>
      )}
    </Box>
  );
};

export default LogoComponent;