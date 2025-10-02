import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// Contexts
import { SearchProvider } from "./contexts/SearchContext";
import { FlightsProvider } from "./contexts/FlightsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchProvider>
        <FlightsProvider>
          <App />
        </FlightsProvider>
      </SearchProvider>
    </ThemeProvider>
  </React.StrictMode>
);
