import React from "react";
import { Flex, Text, Button, HStack, Box, Icon } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { logout } from "../api";
import { FaPaw } from "react-icons/fa";

const NavBar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { favorites, openFavorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

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
      <Flex align="flex-start" flexDirection="row" alignItems="center">
        <Icon as={FaPaw as React.ElementType} mr="3" color="accent.500" />
        <Text fontWeight="bold" fontSize="lg">
          PawFetch
        </Text>
      </Flex>

      <HStack spacing="4">
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
          Favorites
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
