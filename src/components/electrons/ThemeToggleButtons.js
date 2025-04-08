// components/electrons/ThemeToggleButtons.jsx
import React from 'react';
import { IconButton } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

const ThemeToggleButtons = ({
  toggleThemeMode,
  useTheme,
  togglePanelMode,
  usePanel,
  fontSize = '3rem'
}) => {
  return (
    <>
      {/* Rocket Launch button for theme toggle */}
      <IconButton
        onClick={toggleThemeMode}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          color: useTheme ? '#61dafb' : 'inherit',
          zIndex: 1501,
        }}
      >
        <RocketLaunchIcon sx={{ fontSize }} />
      </IconButton>

      {/* Panel toggle button - only shown when useTheme is true */}
      {useTheme && (
        <IconButton
          onClick={togglePanelMode}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 85,
            color: usePanel ? '#61dafb' : 'inherit',
            zIndex: 1501,
          }}
        >
          {usePanel ? (
            <OfflineBoltIcon sx={{ fontSize }} />
          ) : (
            <PanoramaFishEyeIcon sx={{ fontSize }} />
          )}
        </IconButton>
      )}
    </>
  );
};

export default ThemeToggleButtons;

