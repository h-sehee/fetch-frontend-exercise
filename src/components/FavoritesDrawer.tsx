import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Box,
} from "@chakra-ui/react";
import { useFavorites } from "../context/FavoritesContext";

const FavoritesDrawer: React.FC = () => {
  const {
    favoriteDogsDetails,
    isFavOpen,
    closeFavorites,
    toggleFavorite,
  } = useFavorites();

  return (
    <Drawer placement="right" onClose={closeFavorites} isOpen={isFavOpen} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">My Favorites</DrawerHeader>
        <DrawerBody>
          {favoriteDogsDetails.length === 0 ? (
            <Box textAlign="center" py="10">
              <Text color="gray.500">No favorites yet.</Text>
            </Box>
          ) : (
            <VStack spacing="4" align="stretch">
              {favoriteDogsDetails.map((dog) => (
                <HStack key={dog.id} spacing="4">
                  <Image
                    src={dog.img}
                    alt={dog.name}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Box flex="1">
                    <Text fontWeight="bold">{dog.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {dog.breed}, {dog.age} year{dog.age > 1 && "s"}
                    </Text>
                  </Box>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => toggleFavorite(dog.id)}
                  >
                    Remove
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FavoritesDrawer;