// components/molecules/BottomNavigation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from 'contexts/AuthContext';

/**
 * BottomNavigation - A reusable fixed position navigation component that displays
 * a row of buttons at the bottom of the screen.
 * 
 * When a button is clicked, it enlarges and centers on screen. A second click 
 * navigates to the destination, while clicking elsewhere resets the selection.
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
  
  // State for tracking which button is active/selected
  const [activeButton, setActiveButton] = useState(null);
  
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
  
  // Handle the first click on a button
  const handleButtonClick = (button, index) => {
    if (activeButton === index) {
      // Second click - navigate to the destination
      navigateOpen(button.path);
      setActiveButton(null);
    } else {
      // First click - activate and center the button
      setActiveButton(index);
    }
  };
  
  // Handle click outside of active button to reset
  const handleOutsideClick = (e) => {
    // Only reset if we have an active button and didn't click on a button
    if (activeButton !== null && !e.target.closest('.nav-button')) {
      setActiveButton(null);
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
    <>
      {/* Overlay to detect clicks outside of active button */}
      {activeButton !== null && (
        <Box
          onClick={handleOutsideClick}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: zIndex - 1,
          }}
        />
      )}
      
      {/* Active Button in Center (when selected) */}
      <AnimatePresence>
        {activeButton !== null && (
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: zIndex + 1,
              pointerEvents: 'auto',
            }}
          >
            <motion.div
              className="nav-button"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="contained"
                onClick={() => handleButtonClick(filteredButtons[activeButton], activeButton)}
                sx={{
                  backgroundColor,
                  color,
                  borderRadius,
                  fontSize: '1.2rem',  // Larger font for centered button
                  textTransform,
                  padding: '12px 24px',
                  minWidth: '180px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor,
                  },
                }}
              >
                {/* Background flash effect */}
                <motion.div
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#61DAFB', // Light blue flash
                    zIndex: 0,
                  }}
                />
                
                <Box sx={{ zIndex: 1, position: 'relative' }}>
                  {filteredButtons[activeButton].label}
                </Box>
              </Button>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
      
      {/* Bottom Navigation Bar */}
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
            <motion.div
              key={index}
              className="nav-button"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 8px rgba(97, 218, 251, 0.7)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => handleButtonClick(button, index)}
                sx={{
                  margin: spacing / 8, // Convert to MUI spacing units
                  backgroundColor,
                  color,
                  borderRadius,
                  fontSize,
                  textTransform,
                  opacity,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor,
                    opacity: opacity + 0.2 > 1 ? 1 : opacity + 0.2,
                  },
                }}
              >
                {/* Flash effect when active */}
                {activeButton === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity,
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#61DAFB', // Light blue flash
                      zIndex: 0,
                    }}
                  />
                )}
                
                <Box sx={{ zIndex: 1, position: 'relative' }}>
                  {button.label}
                </Box>
              </Button>
            </motion.div>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default BottomNavigation;