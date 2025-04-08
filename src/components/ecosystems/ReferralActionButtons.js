import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import BoltIcon from '@mui/icons-material/Bolt';

/**
 * ReferralActionButtons - A reusable component that displays promotional text and action buttons
 * for property referral services. Conditionally renders based on authentication status.
 * 
 * Props:
 * @param {string} referralLink - The referral link URL (default: 'premierproperties4you.com')
 * @param {boolean} showLeaderTextAlways - Whether to always show leader text and registration button (default: false)
 * @param {string} fontSize - Font size for the text content (default: '1rem')
 * @param {string} buttonSize - Font size for button text (default: '0.9rem')
 * @param {string} color - Background color for buttons (default: 'primary.main')
 * @param {string} headingColor - Color for headings (default: 'primary.dark')
 * @param {number} spacing - Spacing between elements (default: 3)
 * 
 * Usage Example:
 * 
 * ```jsx
 * <ReferralActionButtons 
 *   referralLink="premierproperties4you.com"
 *   showLeaderTextAlways={true}
 *   fontSize="1.1rem"
 *   buttonSize="1rem"
 *   color="secondary.main"
 * />
 * ```
 */
const ReferralActionButtons = ({
  referralLink = 'premierproperties4you.com',
  showLeaderTextAlways = false,
  fontSize = '1rem',
  buttonSize = '0.9rem',
  color = 'primary.main',
  headingColor = 'primary.dark',
  spacing = 3
}) => {
  const navigate = useNavigate();
  const { user } = useAuth() || {}; // Add fallback empty object if useAuth() returns null/undefined
  
  // Check if user exists and has role property with value "admin"
  const isAdmin = user && user.role === "admin";
  const isAuthenticated = !!user;
  
  // Determine whether to show leader text and registration button
  const showLeaderText = showLeaderTextAlways || !isAuthenticated;
  
  // eslint-disable-next-line
  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // eslint-disable-next-line
  const navigateOpen = (path) => {
    if (path.startsWith('http')) {
      navigatePage(path);
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ width: '100%', py: spacing, px: { xs: 2, sm: 4, md: 6 } }}>
      {showLeaderText && (
        <Box sx={{ mb: spacing, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: headingColor,
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' } 
            }}
          >
            Launch Your Property Listing Referral Today
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              mb: 3, 
              fontStyle: 'italic',
              fontSize: { xs: '1rem', sm: '1.1rem', md: fontSize } 
            }}
          >
            Discover How Thousands of Homeowners Are Getting Their Properties Noticed by Qualified Buyers' Agents
          </Typography>
        </Box>
      )}
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        justifyContent="center"
        alignItems="center"
        sx={{ mb: spacing }}
      >
        {isAdmin && (
          <Button
            variant="contained"
            size="large"
            startIcon={<EmojiEmotionsIcon />}
            onClick={() => navigateOpen('/subscribers')}
            sx={{
              px: 3,
              py: 1.5,
              backgroundColor: '#0fa0af',
              borderRadius: '12px',
              fontSize: buttonSize,
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#0fa0af',
              },
            }}
          >
            Access Subscriber Content
          </Button>
        )}
        
        {showLeaderText && (
          <Button
            variant="contained"
            size="large"
            startIcon={<BoltIcon />}
            onClick={() => navigateOpen('/auth/register')}
            sx={{
              px: 3,
              py: 1.5,
              backgroundColor: '#c4880b',
              borderRadius: '12px',
              fontSize: buttonSize,
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#c4880b',
              },
            }}
          >
            Register for Premium Access
          </Button>
        )}
        
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigatePage(`https://${referralLink}`)}
          sx={{
            px: 3,
            py: 1.5,
            backgroundColor: '#29b02a',
            borderRadius: '12px',
            fontSize: buttonSize,
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#29b02a',
            },
          }}
        >
          Start Free Property Referral
        </Button>
      </Stack>
      
      {showLeaderText && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'medium', 
              fontSize: fontSize,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Supercharge your property visibility by connecting with our network of qualified buyers' agents. 
            Our free referral service has helped thousands of homeowners get their properties noticed!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReferralActionButtons;