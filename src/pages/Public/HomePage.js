import React from 'react';
import { Box } from '@mui/material';
import { useDarkMode } from 'contexts/DarkMode';
import AdaptiveLayout from 'components/elements/AdaptiveLayout';
import ReferralActionButtons from 'components/ecosystems/ReferralActionButtons';
import SliderInfo from 'components/electrons/SliderInfo';

const HomePage = () => {
  const { darkMode } = useDarkMode();
  
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
      }}
    >
      <AdaptiveLayout
        backgroundColor={null}
        marginY={0}
        paddingY={0}
        paddingX={0}
        centered={true}
        fullWidth={true}
        useInnerWrapper={false}
      >
        <ReferralActionButtons 
          referralLink="premierproperties4you.com"
          showLeaderTextAlways={true}
          fontSize="1.1rem"
          buttonSize="1rem"
          color="primary.main"
        />
      </AdaptiveLayout>
      
      <AdaptiveLayout
        backgroundColor={null}
        marginY={0}
        paddingY={0}
        paddingX={0}
        centered={true}
        fullWidth={true}
        useInnerWrapper={true}
      >
        <SliderInfo 
          darkMode={darkMode}
          sliderWidth={120}
        />
      </AdaptiveLayout>
    </Box>
  );
};

export default HomePage;