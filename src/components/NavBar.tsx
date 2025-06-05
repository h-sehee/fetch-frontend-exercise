import React from "react";
import { Flex, Text, Button, HStack, Box, Icon } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { logout } from "../api";

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
      justify="space-between"
      align="center"
      p="4"
      bg="gray.100"
      borderBottomWidth="1px"
    >
      <Text fontWeight="bold" fontSize="lg">
        🐶 Fetch Dog Search
      </Text>

      <HStack spacing="4">
        <Button
          variant="ghost"
          leftIcon={<Icon as={FiStar as React.ElementType} />}
          onClick={openFavorites}
          position="relative"
        >
          Favorites
          {favorites.size > 0 && (
            <Box
              as="span"
              position="absolute"
              top="-1"
              right="-1"
              bg="red.500"
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
          <Button size="sm" colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default NavBar;
