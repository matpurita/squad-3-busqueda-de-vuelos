import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    ochre: {
      main: '#2e0cf1ff',
      light: '#70afefff',
      dark: '#100f01ff',
      contrastText: '#edf1f8ff',
    },
  },

  shape: { borderRadius: 10 },
});

export default theme;



