import React, { useEffect, useRef } from 'react';
import { Box, Slider, Typography } from '@mui/material';

/**
 * SliderInfo Component - An animated slider panel with information text
 * 
 * @param {Object} props Component props
 * @param {boolean} props.darkMode - Dark mode toggle
 * @param {number} props.sliderWidth - Width of sliders in pixels (default: 100)
 * @param {number} props.titleFontSize - Font size for titles in rem (default: 0.625)
 * @param {number} props.detailFontSize - Font size for details in rem (default: 0.55)
 * @param {Array} props.infoData - Array of information objects [{title, detail}]
 * @param {boolean} props.showSliders - Whether to show the sliders (default: false)
 * @returns {JSX.Element} SliderInfo component
 */
const SliderInfo = ({ 
  darkMode = false, 
  sliderWidth = 100, 
  titleFontSize = 0.625, 
  detailFontSize = 0.55,
  showSliders = false,
  infoData = [
    {
      title: "Free Maximum Value Home Audit",
      detail: "Be sure you're getting the top market value for your home."
    },
    {
      title: "FSBO Flat Fee MLS Listings!",
      detail: "Owe no listing broker commission. Get the Multi List price!"
    },
    {
      title: "Full Service Brokerage",
      detail: "Check out what it offers."
    },
    {
      title: "FREE FORMS",
      detail: "You don't have to be a REALTOR to have access to legal forms."
    },
    {
      title: "Your clients can offer 1-3%",
      detail: "commissions to buyers agents"
    }
  ]
}) => {
  // Refs for slider values
  const sliderValues = useRef([50, 50, 50, 50, 50]);
  const sliderDirections = useRef([1, 1, 1, 1, 1]); // 1 = increasing, -1 = decreasing
  const animationRef = useRef(null);
  
  // Calculate primary color's RGB value for use in filters
  const calculatePrimaryRgb = (primaryMainColor) => {
    if (primaryMainColor.startsWith('#')) {
      const r = parseInt(primaryMainColor.slice(1, 3), 16);
      const g = parseInt(primaryMainColor.slice(3, 5), 16);
      const b = parseInt(primaryMainColor.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }
    return '25, 118, 210';
  };

  // Set CSS variable for primary color
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--primary-main-rgb',
      calculatePrimaryRgb('#1976d2')
    );
  }, []);
  
  // Animate the sliders
  useEffect(() => {
    const animateSliders = () => {
      // Update each slider with its own speed
      const newValues = [...sliderValues.current];
      const speeds = [0.5, 0.7, 0.3, 0.6, 0.4]; // Different speeds for each slider
      
      for (let i = 0; i < newValues.length; i++) {
        // Calculate new value
        const newValue = newValues[i] + (sliderDirections.current[i] * speeds[i]);
        
        // Reverse direction if hitting bounds
        if (newValue >= 100 || newValue <= 0) {
          sliderDirections.current[i] *= -1;
        }
        
        // Ensure value stays within bounds
        newValues[i] = Math.max(0, Math.min(100, newValue));
      }
      
      // Update ref value
      sliderValues.current = newValues;
      
      // Force component update
      setSliderDisplayValues([...newValues]);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animateSliders);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateSliders);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // State to force re-renders for animation
  const [sliderDisplayValues, setSliderDisplayValues] = React.useState([50, 50, 50, 50, 50]);

  // Make sure we have 5 items (or fewer)
  const displayData = infoData.slice(0, 5);
  
  // If fewer than 5 items provided, fill with empty items
  while (displayData.length < 5) {
    displayData.push({ title: "", detail: "" });
  }

  return (
    <Box sx={{ 
      display: 'flex',
      mt: 1,
      mb: 0,
      height: 'auto',
    }}>
      {/* Sliders container */}
      {showSliders && (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          width: `${sliderWidth}px`, 
          paddingBottom: '30px',
        }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <Slider
              key={index}
              size="medium"
              value={sliderDisplayValues[index]}
              disableSwap
              sx={{
                color: darkMode ? 'white' : 'primary.main',
                padding: 0,
                margin: 0,
                height: 12,
                marginTop: index === 0 ? 0 : '-26px',
                zIndex: 5 - index,
                position: 'relative',
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  transition: 'none',
                },
                '& .MuiSlider-thumb': {
                  transition: 'none',
                  boxShadow: 'none',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: 'none',
                  },
                  '&::before': {
                    boxShadow: 'none',
                  }
                },
              }}
            />
          ))}
        </Box>
      )}
      
      {/* Small text list to the right - adjusted margin if sliders are hidden */}
      <Box sx={{ 
        ml: showSliders ? 1.5 : 0, 
        mt: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100px',
      }}>
        {displayData.map((item, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              fontSize: `${titleFontSize}rem`,
              lineHeight: 1.2,
              color: darkMode ? 'white' : 'text.secondary',
              whiteSpace: 'nowrap',
              mt: index === 0 ? 0 : -2.5,
            }}
          >
            {item.title}
          </Typography>
        ))}
      </Box>
      
      {/* Additional details list (smaller, secondary text) */}
      <Box sx={{ 
        ml: 0.5, 
        mt: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100px',
      }}>
        {displayData.map((item, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              fontSize: `${detailFontSize}rem`,
              lineHeight: 1.1,
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              fontStyle: 'italic',
              mt: index === 0 ? 0 : -2.5,
            }}
          >
            {item.detail}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default SliderInfo;