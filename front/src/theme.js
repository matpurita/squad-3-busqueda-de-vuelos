import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#5d19d2ff',
    },
  },
  shape: { borderRadius: 10 },
});

export default theme;



