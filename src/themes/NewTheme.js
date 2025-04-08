// themes/NewTheme.js
import { createTheme, alpha } from '@mui/material';

const getNewTheme = (darkMode, isXs = false) => {
  // Cyberpunk color palette
  const glowBlue = 'rgba(97, 218, 251, 0.8)';
  const darkBlue = '#061620';
  const accentBlue = '#25c5dc';
  const neonGreen = '#39ff14';
  const warning = '#ff7b00';
  
  // Common component styling patterns
  const commonStyle = {
    borderRadius: '4px',
    boxShadow: `0 0 15px ${alpha(glowBlue, 0.2)}, inset 0 0 5px ${alpha(glowBlue, 0.2)}`,
    backdropFilter: 'blur(30px)',
    transition: 'all 0.3s ease',
    border: `1px solid ${alpha(glowBlue, 0.15)}`,
  };
  
  const elevatedStyle = {
    boxShadow: `0 0 20px ${alpha(glowBlue, 0.4)}, inset 0 0 8px ${alpha(glowBlue, 0.3)}`,
  };
  
  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: accentBlue,
      },
      secondary: {
        main: warning,
      },
      success: {
        main: neonGreen,
      },
      background: {
        default: '#0B1015',
        paper: '#121920',
      },
      text: {
        primary: '#e1eeff',
        secondary: '#a1b6cc',
      },
    },
    typography: {
      fontFamily: '"Roboto Mono", monospace',
      allVariants: {
        letterSpacing: '0.03em',
        textShadow: `0 0 4px ${alpha(glowBlue, 0.6)}`,
      },
      h1: {
        fontFamily: '"Orbitron", sans-serif',
      },
      h2: {
        fontFamily: '"Orbitron", sans-serif',
      },
      h3: {
        fontFamily: '"Orbitron", sans-serif',
      },
      button: {
        fontWeight: 500,
        letterSpacing: '0.05em',
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      // Form Components
      MuiButton: {
        styleOverrides: {
          root: {
            ...commonStyle,
            padding: '8px 16px',
            backgroundColor: alpha(darkBlue, 0.7),
            backgroundImage: `linear-gradient(135deg, ${alpha(darkBlue, 0.8)}, ${alpha('#071a2e', 0.7)})`,
            '&:hover': {
              ...elevatedStyle,
              backgroundColor: alpha(darkBlue, 0.85),
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${alpha(glowBlue, 0.2)}, transparent)`,
            },
          },
          containedPrimary: {
            color: '#ffffff',
            borderColor: alpha(accentBlue, 0.5),
            '&:hover': {
              borderColor: alpha(accentBlue, 0.8),
            },
          },
        },
      },
      
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              ...commonStyle,
              background: alpha(darkBlue, 0.4),
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: accentBlue,
                  borderWidth: 1,
                  boxShadow: `0 0 10px ${alpha(accentBlue, 0.5)}`,
                },
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(accentBlue, 0.7),
              },
            },
          },
        },
      },
      
      MuiSelect: {
        styleOverrides: {
          root: {
            ...commonStyle,
            background: alpha(darkBlue, 0.4),
          },
        },
      },
      
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: alpha(accentBlue, 0.15),
              '&:hover': {
                backgroundColor: alpha(accentBlue, 0.2),
              },
            },
            '&:hover': {
              backgroundColor: alpha(accentBlue, 0.1),
            },
          },
        },
      },
      
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: alpha('#a1b6cc', 0.8),
            '&.Mui-focused': {
              color: accentBlue,
            },
          },
        },
      },
      
      MuiIconButton: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(darkBlue, 0.7),
            backdropFilter: 'blur(15px)',
            border: `1px solid ${alpha(accentBlue, 0.2)}`,
            '&:hover': {
              backgroundColor: alpha(darkBlue, 0.9),
              boxShadow: `0 0 15px ${alpha(accentBlue, 0.3)}`,
            },
            '& .MuiSvgIcon-root': {
              color: accentBlue,
              filter: `drop-shadow(0 0 3px ${alpha(accentBlue, 0.5)})`,
            },
          },
        },
      },
      
      // Table Components
      MuiTable: {
        styleOverrides: {
          root: {
            background: alpha(darkBlue, 0.3),
            backdropFilter: 'blur(10px)',
          },
        },
      },
      
      MuiTableContainer: {
        styleOverrides: {
          root: {
            ...commonStyle,
            background: 'transparent',
          },
        },
      },
      
      MuiTableHead: {
        styleOverrides: {
          root: {
            background: alpha(darkBlue, 0.6),
          },
        },
      },
      
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${alpha(accentBlue, 0.1)}`,
            '&:hover': {
              backgroundColor: alpha(accentBlue, 0.05),
            },
          },
        },
      },
      
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${alpha(accentBlue, 0.1)}`,
          },
          head: {
            color: accentBlue,
            textShadow: `0 0 5px ${alpha(accentBlue, 0.5)}`,
            letterSpacing: '0.05em',
            fontWeight: 500,
          },
        },
      },
      
      // Layout Components
      MuiPaper: {
        styleOverrides: {
          root: {
            ...commonStyle,
            backgroundColor: alpha(darkBlue, 0.4),
            backgroundImage: `linear-gradient(180deg, ${alpha(darkBlue, 0.7)}, ${alpha('#071a2e', 0.5)})`,
          },
        },
      },
      
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(darkBlue, 0.8),
            borderBottom: `1px solid ${alpha(accentBlue, 0.2)}`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 2px 15px ${alpha(darkBlue, 0.8)}`,
          },
        },
      },
      
      MuiToolbar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(90deg, ${alpha(darkBlue, 0.9)}, ${alpha('#071a2e', 0.8)})`,
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '5%',
              right: '5%',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${alpha(accentBlue, 0.3)}, transparent)`,
            },
          },
        },
      },
      
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: `linear-gradient(135deg, ${alpha('#050a10', 0.9)}, ${alpha('#071a2e', 0.8)})`,
            backdropFilter: 'blur(30px)',
            borderRight: `1px solid ${alpha(accentBlue, 0.15)}`,
            boxShadow: `inset -5px 0 15px ${alpha(darkBlue, 0.5)}`,
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '1px',
              background: `linear-gradient(180deg, transparent, ${alpha(accentBlue, 0.3)}, transparent)`,
            },
          },
        },
      },
      
      MuiChip: {
        styleOverrides: {
          root: {
            ...commonStyle,
            backgroundColor: alpha(darkBlue, 0.6),
            '&:hover': {
              backgroundColor: alpha(darkBlue, 0.8),
            },
          },
          colorPrimary: {
            color: '#ffffff',
            borderColor: alpha(accentBlue, 0.3),
            backgroundColor: alpha(accentBlue, 0.2),
          },
        },
      },
    },
  });
};

export default getNewTheme;