// components/atoms/PortalDraghandleButton
import React, { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const PortalDraghandleButton = forwardRef(({
  isOpen = false,
  onToggle = () => {},
  id = "draghandle-button",
  className = "",
  portalId = "draghandle-portal",
  zIndex = 100000,
  darkMode = false,
  ...props
}, ref) => {
  const [portalElement, setPortalElement] = useState(null);
  
  // Create portal container on mount
  useEffect(() => {
    let element = document.getElementById(portalId);
    
    if (!element) {
      element = document.createElement('div');
      element.id = portalId;
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.width = '0';
      element.style.height = '0';
      element.style.zIndex = zIndex;
      document.body.appendChild(element);
    }
    
    setPortalElement(element);
    
    return () => {
      if (element && element.parentNode && element.childNodes.length <= 1) {
        document.body.removeChild(element);
      }
    };
  }, [portalId, zIndex]);
  
  const buttonComponent = (
    <IconButton
      ref={ref}
      color="primary"
      aria-label="menu"
      onClick={onToggle}
      id={id}
      className={className}
      sx={{
        backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        ...props.style
      }}
      {...props}
    >
      <DragHandleIcon sx={{
        color: darkMode ? '#fff' : '#333',
        fontSize: '1.5rem'
      }} />
    </IconButton>
  );
  
  if (!portalElement) {
    return null;
  }
  
  return createPortal(buttonComponent, portalElement);
});

PortalDraghandleButton.displayName = 'PortalDraghandleButton';

export default PortalDraghandleButton;

