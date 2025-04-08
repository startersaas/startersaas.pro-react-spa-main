// components/organisms/TopIconsPrivate.js
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Button } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PortalDraghandleButton from 'components/atoms/PortalDraghandleButton';
import LogoComponent from 'components/atoms/LogoComponent';
import { useDarkMode } from 'contexts/DarkMode';
import { useDrawer } from 'contexts/DrawerContext';
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Logout, UpdateMe } from "api/mutations";
import { useAuth } from "contexts/AuthContext";

const TopIconsPrivate = ({ isXs, isHomePage, useTheme: propsUseTheme, user }) => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { drawerOpen, toggleDrawer } = useDrawer();
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { refetch } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [showIconButton, setShowIconButton] = useState(true);
  const [buttonCoords, setButtonCoords] = useState({ right: 0 });
  
  // Define available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
    // Add more languages as needed
  ];
  
  // Get current language label
  const getCurrentLanguageLabel = () => {
    const currentLang = user?.language || i18n.language || 'en';
    const langObj = languages.find(lang => lang.code === currentLang);
    return langObj ? langObj.label.substring(0, 2).toUpperCase() : 'EN';
  };
  
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
  
  // Added from TopIconsPrivate - Form handling for language change
  const { handleSubmit } = useForm({
    defaultValues: { language: user?.language },
  });

  const { setValue } = useForm({
    defaultValues: { language: user?.language },
  });

  const mutation = useMutation(UpdateMe, {
    onSuccess: () => queryClient.invalidateQueries(["Me"]),
  });

  // Added from TopIconsPrivate - Logout handler
  const handleLogout = async () => {
    await Logout();
    await refetch();
    navigate("/auth/login");
  };

  // Added from TopIconsPrivate - Language change handler
  const handleLanguageChange = async (languageCode) => {
    if (!languageCode) return;
    
    try {
      await mutation.mutateAsync({ language: languageCode });
      await i18n.changeLanguage(languageCode);
      queryClient.invalidateQueries(["Me"]);
      setLanguageMenuAnchor(null);
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };
  
  return (
    <>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar ref={toolbarRef} sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
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
          
          {/* DragHandle IconButton */}
          {showIconButton && (
            <IconButton 
              ref={dragHandleRef}
              color="primary"
              aria-label="menu"
              onClick={() => toggleDrawer()}
              id="draghandle"
              className="my-custom-class"
              sx={{
                backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
                ml: 1,
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(245, 245, 245, 0.9)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
            >
              <DragHandleIcon sx={{
                color: darkMode ? '#fff' : '#333',
                fontSize: '1.5rem'
              }} />
            </IconButton>
          )}
        </Toolbar>
        
        {/* Second Toolbar for buttons */}
        <Toolbar sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: { xs: '0.5rem 1rem', md: '0.5rem 2rem' },
          minHeight: 'auto',
          width: '100%'
        }}>
          {/* Home Button */}
          <Button
            component={RouterLink}
            to="/dashboard"
            endIcon={<DragIndicatorIcon />}
            size="small"
            color="primary"
            onClick={() => navigateOpen('/dashboard')}
            sx={{
              height: '28px',
              fontSize: '0.7rem',
              borderRadius: '4px',
              mr: 0.5,
              textTransform: 'none',
              backgroundColor: darkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(240, 240, 240, 0.9)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(80, 80, 80, 0.9)' : 'rgba(220, 220, 220, 1)',
              }
            }}
          >
            Home
          </Button>
          
          {/* Language Button */}
          {user && (
            <Button
              endIcon={<DragIndicatorIcon />}
              size="small"
              color="primary"
              onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
              sx={{
                height: '28px',
                borderRadius: '4px',
                mr: 0.5,
                textTransform: 'none',
                backgroundColor: darkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(240, 240, 240, 0.9)',
                padding: '0 12px',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(80, 80, 80, 0.9)' : 'rgba(220, 220, 220, 1)',
                },
                fontSize: '0.7rem',
              }}
            >
              Language
            </Button>
          )}
          
          {/* Account Button */}
          {user && (
            <Button
              endIcon={<DragIndicatorIcon />}
              size="small"
              color="primary"
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              sx={{
                height: '28px',
                fontSize: '0.7rem',
                borderRadius: '4px',
                mr: 0.5,
                textTransform: 'none',
                backgroundColor: darkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(240, 240, 240, 0.9)',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(80, 80, 80, 0.9)' : 'rgba(220, 220, 220, 1)',
                }
              }}
            >
              Account
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Language Menu */}
      {user && (
        <Menu 
          anchorEl={languageMenuAnchor} 
          open={Boolean(languageMenuAnchor)} 
          onClose={() => setLanguageMenuAnchor(null)}
          sx={{ backgroundColor: "initial" }}
        >
          {languages.map((lang) => (
            <MenuItem 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              selected={user?.language === lang.code}
              sx={{ backgroundColor: "initial" }}
            >
              {lang.label}
            </MenuItem>
          ))}
        </Menu>
      )}
      
      {/* User Menu */}
      {user && (
        <Menu 
          anchorEl={userMenuAnchor} 
          open={Boolean(userMenuAnchor)} 
          onClose={() => setUserMenuAnchor(null)}
          sx={{ backgroundColor: "initial" }}
        >
          <MenuItem disabled sx={{ backgroundColor: "initial" }}>
            {user.email}
          </MenuItem>
          <MenuItem 
            component={RouterLink} 
            to="/user/edit" 
            sx={{ backgroundColor: "initial" }}
          >
            {t("privateLayout.manageUser")}
          </MenuItem>
          {(user.role === "admin" || user.role === "superadmin") && (
            <>
              <MenuItem 
                component={RouterLink} 
                to="/account/edit" 
                sx={{ backgroundColor: "initial" }}
              >
                {t("privateLayout.managePayment")}
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/plan" 
                sx={{ backgroundColor: "initial" }}
              >
                {t("privateLayout.managePlan")}
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleLogout} sx={{ backgroundColor: "initial" }}>
            {t("privateLayout.logout")}
          </MenuItem>
        </Menu>
      )}
      
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
    </>
  );
};

export default TopIconsPrivate;