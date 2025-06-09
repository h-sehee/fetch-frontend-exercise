import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import "./index.css";
import App from "./App";
import theme from "./theme";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";

/**
 * Entry point for the React application.
 * - Wraps the app with ChakraProvider for theming.
 * - Uses HashRouter for client-side routing.
 * - Provides authentication and favorites context to the app.
 */
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Set initial color mode for Chakra UI */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <HashRouter>
        {/* Provide authentication context to the app */}
        <AuthProvider>
          {/* Provide favorites context to the app */}
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </AuthProvider>
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>
);
