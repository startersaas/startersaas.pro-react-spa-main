// components/molecules/BottomNavigation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { useAuth } from 'contexts/AuthContext';

/**
 * BottomNavigation - A reusable fixed position navigation component that displays
 * a row of buttons at the bottom of the screen.
 * 
 * Props:
 * @param {boolean} visible - Whether to display the navigation bar (default: true)
 * @param {string} fontSize - Font size for button text (default: '0.75rem')
 * @param {string} color - Text color for buttons (default: 'white')
 * @param {string} backgroundColor - Background color for buttons (default: 'primary.main')
 * @param {number} opacity - Opacity for button background (default: 0.7)
 * @param {string} borderRadius - Border radius for buttons (default: '50px')
 * @param {string} textTransform - Text transform for button text (default: 'uppercase')
 * @param {number} spacing - Spacing between buttons in pixels (default: 4)
 * @param {number} bottom - Position from bottom in pixels (default: 20)
 * @param {number} zIndex - z-index for the component (default: 1000)
 * @param {number} maxWidth - Maximum width of the component (default: 1200)
 * 
 * Usage Example:
 * 
 * ```jsx
 * <BottomNavigation 
 *   visible={true}
 *   backgroundColor="#2196f3"
 *   opacity={0.85}
 *   fontSize="0.8rem"
 * />
 * ```
 */
const BottomNavigation = ({
  visible = true,
  fontSize = '0.75rem',
  color = 'white',
  backgroundColor = 'primary.main',
  opacity = 0.7,
  borderRadius = '50px',
  textTransform = 'uppercase',
  spacing = 4,
  bottom = 20,
  zIndex = 1000,
  maxWidth = 1200
}) => {
  const navigate = useNavigate();
  const { user } = useAuth() || {}; // Add fallback empty object if useAuth() returns null/undefined
  
  // Check if user exists and has role property with value "admin"
  const isAdmin = user && user.role === "admin";
  
  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigateOpen = (path) => {
    if (path.startsWith('http')) {
      navigatePage(path);
    } else {
      navigate(path);
    }
  };

  // If the visible prop is false, don't render anything
  if (!visible) return null;
  
  // Buttons configuration with adminOnly flags
  const buttons = [
    // Public Pages
    { label: 'Home', path: '/' },
    { label: 'Home Page', path: '/home-page' },
    { label: 'Hello World', path: '/hello-world' },
    
    // Authentication
    { label: 'Login', path: '/auth/login' },
    { label: 'Register', path: '/auth/register' },
    { label: 'Forgot Password', path: '/auth/forgot-password' },
    { label: 'Resend Activation', path: '/auth/resend-activation' },
    
    // User Management
    { label: 'All Users', path: '/users', adminOnly: true },
    { label: 'Create User', path: '/create-user', adminOnly: true },
    { label: 'Edit User', path: '/user/edit', adminOnly: true },
    { label: 'Edit Account', path: '/account/edit', adminOnly: true },
    
    // Team Management
    { label: 'All Teams', path: '/teams', adminOnly: true },
    { label: 'My Teams', path: '/user-teams', adminOnly: true },
    
    // Dashboard
    { label: 'Dashboard', path: '/dashboard', adminOnly: true },
    
    // Billing & Plans
    { label: 'Add Card', path: '/card/add', adminOnly: true },
    { label: 'Select Plan', path: '/plan', adminOnly: true },
    
    // GitHub Links
    { label: 'Go API', path: 'https://github.com/startersaas/startersaas-backend-go-api-main.git' },
    { label: 'Node API', path: 'https://github.com/startersaas/startersaas-backend-node-api-main.git' },
    { label: 'React Frontend', path: 'https://github.com/startersaas/startersaas-frontend-react-spa.git' }
  ];
  
  // Filter buttons by admin access if needed
  const filteredButtons = buttons.filter(button => !button.adminOnly || isAdmin);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth,
          width: '100%',
          px: 2,
        }}
      >
        {filteredButtons.map((button, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => navigateOpen(button.path)}
            sx={{
              margin: spacing / 8, // Convert to MUI spacing units
              backgroundColor,
              color,
              borderRadius,
              fontSize,
              textTransform,
              opacity,
              '&:hover': {
                backgroundColor,
                opacity: opacity + 0.2 > 1 ? 1 : opacity + 0.2,
              },
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default BottomNavigation;