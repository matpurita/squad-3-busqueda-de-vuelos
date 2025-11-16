import { createTheme, alpha } from '@mui/material/styles';

// Modern Monochromatic Minimalist Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',      // Deep black for primary elements
      light: '#404040',     // Lighter gray for hover states
      dark: '#000000',      // Pure black for emphasis
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#666666',      // Medium gray for secondary elements
      light: '#8c8c8c',     // Lighter gray
      dark: '#404040',      // Darker gray
      contrastText: '#ffffff',
    },
    error: {
      main: '#333333',      // Dark gray instead of red
      contrastText: '#ffffff',
    },
    warning: {
      main: '#595959',      // Medium-dark gray
      contrastText: '#ffffff',
    },
    info: {
      main: '#4d4d4d',      // Medium gray
      contrastText: '#ffffff',
    },
    success: {
      main: '#262626',      // Near-black for success
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',   // Very light gray background
      paper: '#ffffff',     // Pure white for cards
    },
    text: {
      primary: '#1a1a1a',   // Dark text for high contrast
      secondary: '#666666', // Medium gray for secondary text
      disabled: '#b3b3b3',  // Light gray for disabled text
    },
    divider: '#e6e6e6',     // Very light gray for dividers
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
            backgroundColor: '#404040',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(26, 26, 26, 0.04)',
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
              borderColor: '#e6e6e6',
            },
            '&:hover fieldset': {
              borderColor: '#b3b3b3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a1a1a',
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
          backgroundColor: '#f5f5f5',
          color: '#1a1a1a',
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



