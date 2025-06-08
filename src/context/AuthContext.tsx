import { useToast } from "@chakra-ui/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

interface AuthContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  setIsLoggedIn: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

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

export const useAuth = () => useContext(AuthContext);
