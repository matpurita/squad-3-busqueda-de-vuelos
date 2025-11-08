import { createTheme, alpha } from '@mui/material/styles';
import { config } from './config';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: config.THEME.PRIMARY_COLOR,
      light: '#64b5f6',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: config.THEME.SECONDARY_COLOR,
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    error: {
      main: config.THEME.ERROR_COLOR,
    },
    warning: {
      main: config.THEME.WARNING_COLOR,
    },
    info: {
      main: config.THEME.INFO_COLOR,
    },
    success: {
      main: config.THEME.SUCCESS_COLOR,
    },
    background: {
      default: config.THEME.BACKGROUND_COLOR,
      paper: config.THEME.SURFACE_COLOR,
    },
  },
});

// Agregar la función alpha al theme para compatibilidad con @mui/x-date-pickers
theme.alpha = alpha;

export default theme;



