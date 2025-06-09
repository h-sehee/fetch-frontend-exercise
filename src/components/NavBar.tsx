import React from "react";
import { Flex, Text, Button, HStack, Box, Icon } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { logout } from "../api";
import { FaPaw } from "react-icons/fa";

/**
 * Navigation bar component displayed at the top of the app.
 * Shows the app logo, Barkmarks (favorites) button, and logout button.
 */
const NavBar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { favorites, openFavorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles logo click: navigates to the search page and resets filters.
   */
  const handleLogoClick = () => {
    navigate("/search?reset=1", { replace: true });
  };

  /**
   * Handles user logout: calls API, updates auth state, and navigates to login.
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      px="6"
      py="4"
      bg="darkBrand.500"
      color="white"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="10"
    >
      {/* Logo and app name */}
      <Flex
        align="flex-start"
        flexDirection="row"
        alignItems="center"
        cursor="pointer"
        onClick={handleLogoClick}
      >
        <Icon as={FaPaw as React.ElementType} mr="3" color="accent.500" boxSize={5}/>
        <Text fontWeight="bold" fontSize="xl">
          PawFetch
        </Text>
      </Flex>

      {/* Barkmarks and logout buttons */}
      <HStack spacing="4">
        {/* Favorites (Barkmarks) button with badge */}
        <Button
          variant="ghost"
          leftIcon={
            <Icon
              as={FiStar as React.ElementType}
              boxSize={5}
              color="accent.500"
            />
          }
          onClick={openFavorites}
          position="relative"
          color="white"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
        >
          Barkmarks
          {favorites.size > 0 && (
            <Box
              as="span"
              position="absolute"
              top="-1"
              right="-1"
              bg="accent.500"
              color="white"
              borderRadius="full"
              fontSize="xs"
              px="1"
              py="0"
            >
              {favorites.size}
            </Box>
          )}
        </Button>

        {/* Logout button (only when logged in and not on home page) */}
        {isLoggedIn && location.pathname !== "/" && (
          <Button size="sm" colorScheme="brand" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default NavBar;
