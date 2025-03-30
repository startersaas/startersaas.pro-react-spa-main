// components/organisms/TopIconsPrivate.js
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PortalDraghandleButton from 'components/atoms/PortalDraghandleButton';
import LogoComponent from 'components/atoms/LogoComponent';
import { useDarkMode } from 'contexts/DarkMode';
import { useDrawer } from 'contexts/DrawerContext';
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Logout, UpdateMe } from "api/mutations";
import { useAuth } from "contexts/AuthContext";
import { HomeChip, LanguageChip, AccountChip } from 'components/atoms/NavChips';

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
  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    
    setValue('language', newLanguage);
    
    await mutation.mutateAsync({ language: newLanguage });
    
    await i18n.changeLanguage(newLanguage);
    
    queryClient.invalidateQueries(["Me"]);
  };
  
  // Added from TopIconsPrivate - Render chips function
  const renderChips = () => (
    <>
      <HomeChip darkMode={darkMode} />
      {user && <LanguageChip user={user} handleLanguageChange={handleLanguageChange} darkMode={darkMode} />}
      {user && <AccountChip setUserMenuAnchor={setUserMenuAnchor} darkMode={darkMode} />}
    </>
  );
  
  return (
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
        
        {/* Added Chips and IconButton in a Box container */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isExtraSmall ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                paddingX: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maxWidth: 'calc(100vw - 200px)',
              }}
            >
              {renderChips()}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderChips()}
            </Box>
          )}
          
          {/* DragHandle IconButton */}
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
        </Box>
      </Toolbar>
      
      {/* Added User Menu */}
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
          {user.role === "admin" && (
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
    </AppBar>
  );
};

export default TopIconsPrivate;