import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api";
import { Box, Button, Flex } from "@chakra-ui/react";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate("/");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px="6"
      py="4"
      bg="white"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Box>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#333",
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          🐶 Dog Matcher
        </Link>
      </Box>
      {isLoggedIn && location.pathname !== "/" && (
        <Button size="sm" colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </Flex>
  );
};

export default Header;
