import { createTheme, alpha } from '@mui/material';

const getTheme = (darkMode, isXs = false) => {
  // Main colors from ReferralActionButtons
  const primaryColor = '#0fa0af';   // Teal/Blue - primary color for general UI
  const warningColor = '#c4880b';   // Orange/Amber - warnings, attention
  const successColor = '#29b02a';   // Green - success states, confirmations
  
  // Common component styling patterns
  const commonStyle = {
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
  };
  
  const elevatedStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
  };
  
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: warningColor,
      },
      success: {
        main: successColor,
      },
      text: {
        primary: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      allVariants: {
        fontFamily: '"Roboto", sans-serif',
        letterSpacing: '-0.01em',
      },
      button: {
        fontWeight: 'bold',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: (factor) => `${0.8 * factor}rem`,
    components: {
      // == FORM COMPONENTS ==
      
      // Button Component
      MuiButton: {
        styleOverrides: {
          root: {
            ...commonStyle,
            padding: '8px 16px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            '&:hover': elevatedStyle,
          },
          containedPrimary: {
            backgroundColor: primaryColor,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: primaryColor,
            },
          },
          containedSecondary: {
            backgroundColor: warningColor, 
            color: '#ffffff',
            '&:hover': {
              backgroundColor: warningColor,
            },
          },
          containedSuccess: {
            backgroundColor: successColor,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: successColor,
            },
          },
        },
      },
      
      // TextField Component
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              ...commonStyle,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              },
            },
          },
        },
      },
      
      // Select Component
      MuiSelect: {
        styleOverrides: {
          root: {
            ...commonStyle,
            '&.MuiOutlinedInput-root': {
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
              borderWidth: 2,
            },
          },
        },
      },
      
      // MenuItem Component
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: alpha(primaryColor, 0.1),
              '&:hover': {
                backgroundColor: alpha(primaryColor, 0.15),
              },
            },
            '&:hover': {
              backgroundColor: alpha(primaryColor, 0.05),
            },
          },
        },
      },
      
      // FormControl Component
      MuiFormControl: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
          },
        },
      },
      
      // FormLabel Component
      MuiFormLabel: {
        styleOverrides: {
          root: {
            marginBottom: '6px',
            '&.Mui-focused': {
              color: primaryColor,
            },
          },
        },
      },
      
      // FormHelperText Component
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginTop: '4px',
            fontSize: '0.75rem',
          },
          error: {
            color: warningColor,
          },
        },
      },
      
      // InputAdornment Component
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: 'rgba(0, 0, 0, 0.6)',
          },
        },
      },
      
      // IconButton Component
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: '10px',
            '&:hover': {
              backgroundColor: alpha(primaryColor, 0.1),
            },
          },
          colorPrimary: {
            color: primaryColor,
            '&:hover': {
              backgroundColor: alpha(primaryColor, 0.1),
            },
          },
          colorSecondary: {
            color: warningColor,
            '&:hover': {
              backgroundColor: alpha(warningColor, 0.1),
            },
          },
          colorSuccess: {
            color: successColor,
            '&:hover': {
              backgroundColor: alpha(successColor, 0.1),
            },
          },
        },
      },
      
      // Dialog Components
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.5rem',
            borderBottom: `1px solid ${alpha(primaryColor, 0.1)}`,
          },
        },
      },
      
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: '20px',
          },
        },
      },
      
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '12px 20px',
            borderTop: `1px solid ${alpha(primaryColor, 0.1)}`,
          },
        },
      },
      
      // Menu Component
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      
      // Chip Component
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            padding: '0 6px',
            height: '32px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          colorPrimary: {
            backgroundColor: primaryColor,
            color: '#ffffff',
          },
          colorSecondary: {
            backgroundColor: warningColor,
            color: '#ffffff',
          },
          colorSuccess: {
            backgroundColor: successColor,
            color: '#ffffff',
          },
        },
      },
      
      // == TABLE COMPONENTS ==
      
      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: 'separate',
            borderSpacing: '0',
          },
        },
      },
      
      MuiTableContainer: {
        styleOverrides: {
          root: {
            ...commonStyle,
            marginBottom: '20px',
          },
        },
      },
      
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(primaryColor, 0.1),
          },
        },
      },
      
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(primaryColor, 0.05),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(primaryColor, 0.1),
              '&:hover': {
                backgroundColor: alpha(primaryColor, 0.15),
              },
            },
          },
          head: {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
            borderBottom: `1px solid ${alpha(primaryColor, 0.1)}`,
            '&:first-of-type': {
              paddingLeft: '24px',
            },
            '&:last-of-type': {
              paddingRight: '24px',
            },
          },
          head: {
            fontWeight: 700,
            color: primaryColor,
            backgroundColor: alpha(primaryColor, 0.05),
          },
        },
      },
      
      // == LAYOUT COMPONENTS ==
      
      // Paper Component
      MuiPaper: {
        styleOverrides: {
          root: {
            ...commonStyle,
            padding: '20px',
            margin: '8px 0',
          },
        },
      },
      
      // AppBar Component
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: primaryColor,
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          },
          colorDefault: {
            backgroundColor: primaryColor,
            color: '#ffffff',
          },
        },
      },
      
      // Toolbar Component
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '64px',
            padding: '0 24px',
          },
        },
      },
      
      // Drawer Component
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
            borderRight: 'none',
          },
        },
      },
    },
  });
};

export default getTheme;