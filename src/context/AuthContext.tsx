import { useToast } from "@chakra-ui/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../api";

/**
 * AuthContextType defines the authentication state and updater.
 */
interface AuthContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
}

/**
 * AuthContext provides authentication state throughout the app.
 */
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  setIsLoggedIn: () => {},
});

/**
 * AuthProvider wraps the app and manages authentication state.
 * It checks login status on mount and intercepts fetch requests to handle 401 errors.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Check login status on mount
  useEffect(() => {
    const verify = async () => {
      const loggedIn = await checkLogin();
      if (loggedIn) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    verify();
  }, []);

  // Intercept fetch to handle 401 Unauthorized globally
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (res.status === 401) {
        toast({
          title: "Session expired",
          description: "Your session has expired. You will be logged out.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
      }
      return res;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context.
 */
export const useAuth = () => useContext(AuthContext);
