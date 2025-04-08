// contexts/RetroTvMode.jsx
import React, { createContext, useContext, useState } from 'react';

const RetroTvModeContext = createContext();

export const RetroTvMode = ({ children }) => {
  const [tvMode, setTvMode] = useState(true);
  const [useTheme, setUseTheme] = useState(false);
  const [usePanel, setUsePanel] = useState(false);

  return (
    <RetroTvModeContext.Provider value={{ 
      tvMode, 
      setTvMode,
      useTheme,
      setUseTheme,
      usePanel,
      setUsePanel 
    }}>
      {children}
    </RetroTvModeContext.Provider>
  );
};

export const useRetroTvMode = () => {
  const context = useContext(RetroTvModeContext);
  if (context === undefined) {
    throw new Error('useRetroTvMode must be used within a RetroTvMode Provider');
  }
  return context;
};