// themes/Theme.js
import { createTheme } from '@mui/material';

const getTheme = (darkMode, isXs = false) => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      allVariants: {
        fontFamily: 'Roboto',
      },
    },
  });
};

export default getTheme;