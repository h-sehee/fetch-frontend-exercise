import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import "./index.css";
import App from "./App";
import theme from "./theme";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <FavoritesProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </FavoritesProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
