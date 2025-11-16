import { createTheme, alpha } from '@mui/material/styles';

// Dark Blue Modern Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a5f',      // Deep dark blue for primary elements
      light: '#2c5282',     // Lighter blue for hover states
      dark: '#0f2740',      // Darker blue for emphasis
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b5c7f',      // Medium blue for secondary elements
      light: '#5a7fa3',     // Lighter blue
      dark: '#2d4a66',      // Darker blue
      contrastText: '#ffffff',
    },
    error: {
      main: '#2a4159',      // Dark blue-gray instead of red
      contrastText: '#ffffff',
    },
    warning: {
      main: '#3d5570',      // Medium-dark blue
      contrastText: '#ffffff',
    },
    info: {
      main: '#2b4a6e',      // Medium blue
      contrastText: '#ffffff',
    },
    success: {
      main: '#1a3a52',      // Dark blue for success
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f8fa',   // Very light blue-gray background
      paper: '#ffffff',     // Pure white for cards
    },
    text: {
      primary: '#1e3a5f',   // Dark blue text for high contrast
      secondary: '#4a6b8a', // Medium blue for secondary text
      disabled: '#a1b5c9',  // Light blue for disabled text
    },
    divider: '#d6e3ed',     // Very light blue for dividers
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0em',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 2,  // Minimal rounded corners
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
    '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    '0 3px 6px 0 rgba(0, 0, 0, 0.08)',
    '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
    '0 5px 10px 0 rgba(0, 0, 0, 0.08)',
    '0 6px 12px 0 rgba(0, 0, 0, 0.08)',
    '0 8px 16px 0 rgba(0, 0, 0, 0.08)',
    '0 10px 20px 0 rgba(0, 0, 0, 0.08)',
    '0 12px 24px 0 rgba(0, 0, 0, 0.08)',
    '0 14px 28px 0 rgba(0, 0, 0, 0.08)',
    '0 16px 32px 0 rgba(0, 0, 0, 0.08)',
    '0 18px 36px 0 rgba(0, 0, 0, 0.08)',
    '0 20px 40px 0 rgba(0, 0, 0, 0.08)',
    '0 22px 44px 0 rgba(0, 0, 0, 0.08)',
    '0 24px 48px 0 rgba(0, 0, 0, 0.08)',
    '0 26px 52px 0 rgba(0, 0, 0, 0.08)',
    '0 28px 56px 0 rgba(0, 0, 0, 0.08)',
    '0 30px 60px 0 rgba(0, 0, 0, 0.08)',
    '0 32px 64px 0 rgba(0, 0, 0, 0.08)',
    '0 34px 68px 0 rgba(0, 0, 0, 0.08)',
    '0 36px 72px 0 rgba(0, 0, 0, 0.08)',
    '0 38px 76px 0 rgba(0, 0, 0, 0.08)',
    '0 40px 80px 0 rgba(0, 0, 0, 0.08)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#2c5282',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(30, 58, 95, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d6e3ed',
            },
            '&:hover fieldset': {
              borderColor: '#a1b5c9',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1e3a5f',
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: '#e8f1f8',
          color: '#1e3a5f',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

// Agregar la función alpha al theme para compatibilidad con @mui/x-date-pickers
theme.alpha = alpha;

export default theme;



