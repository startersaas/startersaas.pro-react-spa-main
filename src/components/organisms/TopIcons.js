// components/organisms/TopIcons
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PortalDraghandleButton from 'components/atoms/PortalDraghandleButton';
import LogoComponent from 'components/atoms/LogoComponent';
import { useDarkMode } from 'contexts/DarkMode';
import { useDrawer } from 'contexts/DrawerContext';

const TopIcons = ({ isXs, isHomePage, useTheme }) => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { drawerOpen, toggleDrawer } = useDrawer();
  
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [showIconButton, setShowIconButton] = useState(true);
  const [buttonCoords, setButtonCoords] = useState({ right: 0 });
  
  const toolbarRef = useRef(null);
  const dragHandleRef = useRef(null);
  
  const calculatePosition = () => {
    if (dragHandleRef.current) {
      const rect = dragHandleRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const right = viewportWidth - rect.right;
      setButtonCoords({ right });
    }
  };
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const toolbarBottom = toolbarRef.current ? toolbarRef.current.getBoundingClientRect().bottom : 0;
    
    const nowScrolledDown = scrollY > 0 && toolbarBottom <= 0;
    
    if (nowScrolledDown) {
      setShowFixedButton(true);
      setShowIconButton(false);
      calculatePosition();
    } else {
      setShowFixedButton(false);
      setShowIconButton(true);
    }
  };
  
  useEffect(() => {
    calculatePosition();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculatePosition);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculatePosition);
    };
  }, []);
  
  // eslint-disable-next-line
  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigateOpen = (path) => {
    if (path === 'toggleDrawer') {
      toggleDrawer();
    } else {
      navigate(path);
    }
  };
  
  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Toolbar ref={toolbarRef} sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', // Changed from flex-end to space-between for proper alignment
        padding: { xs: '0.5rem 1rem', md: '0.5rem 2rem' },
        width: '100%'
      }}>
        {/* Logo Component on the left */}
        <LogoComponent 
          darkMode={darkMode} 
          isHomePage={isHomePage} 
          navigateOpen={() => navigateOpen('/')}
          logoText='startersaas.pro'
        />
        
        {/* DragHandle IconButton on the right */}
        {showIconButton && (
          <IconButton 
            ref={dragHandleRef}
            color="primary"
            aria-label="menu"
            onClick={() => toggleDrawer()}
            id="draghandle"
            className="my-custom-class"
          >
            <DragHandleIcon />
          </IconButton>
        )}
      </Toolbar>
      
      {/* Portal Button that appears when scrolled down (outside toolbar) */}
      {!showIconButton && showFixedButton && (
        <PortalDraghandleButton 
          isOpen={drawerOpen}
          onToggle={() => toggleDrawer()}
          id="draghandle-fixed" 
          className="my-custom-class"
          darkMode={darkMode}
          style={{
            position: "fixed",
            top: 10,
            right: `${buttonCoords.right}px`,
            transform: "translateZ(0)",
            willChange: "transform",
            zIndex: 1300,
          }}
        />
      )}
    </AppBar>
  );
};

export default TopIcons;