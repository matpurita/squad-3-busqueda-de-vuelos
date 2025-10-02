import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#507BD8", // Azul corporativo
    },
    text: {
      primary: "#222222", // Textos principales
    },
    background: {
      default: "#f7f9fc",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 700, // Bold
    },
    subtitle1: {
      fontWeight: 500, // Medium
    },
    body1: {
      fontWeight: 400, // Regular
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          "&.Mui-selected": {
            backgroundColor: "#507BD8",
            color: "#fff",
          },
        },
      },
    },
  },
});

export default theme;
