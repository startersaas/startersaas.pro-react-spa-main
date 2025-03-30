import React from 'react';
import { Box } from '@mui/material';

const AdaptiveLayout = (props) => {
  const {
    backgroundColor = null,
    marginY = 0,
    paddingY = 0,
    paddingX = 0,
    centered = true,
    fullWidth = true,
    useInnerWrapper = true,
    children,
    ...otherProps
  } = props;

  // Define the inner wrapper Box as a constant
  const InnerBox = (
    <Box
      sx={{
        width: { 
          xs: "100%", 
          sm: 600, 
          md: 960, 
          lg: 1280, 
          xl: 1920 
        },
        paddingY,
        paddingX,
      }}
    >
      {children}
    </Box>
  );

  return (
    <Box
      sx={{
        marginY,
        display: "flex",
        flexDirection: "column",
        alignItems: centered ? "center" : "flex-start",
        justifyContent: centered ? "center" : "flex-start",
        backgroundColor,
        width: fullWidth ? "100%" : "auto",
        ...(useInnerWrapper ? {} : { paddingY, paddingX }),
      }}
      {...otherProps}
    >
      {useInnerWrapper ? InnerBox : children}
    </Box>
  );
};

export default AdaptiveLayout;