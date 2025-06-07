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
  Box,
  IconButton,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useFavorites } from "../context/FavoritesContext";
import { CloseIcon } from "@chakra-ui/icons";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const FavoritesDrawer: React.FC = () => {
  const { favorites, favoriteDogsDetails, isFavOpen, closeFavorites, toggleFavorite } =
    useFavorites();

  return (
    <Drawer
      placement="right"
      onClose={closeFavorites}
      isOpen={isFavOpen}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex align="center" justify="space-between">
            <Text fontWeight="bold" fontSize="xl">
              My Barkmarks
            </Text>
            <DrawerCloseButton position="static" />
          </Flex>
        </DrawerHeader>
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
                    <Text fontWeight="semibold">{dog.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {dog.breed}, {dog.age} year{dog.age > 1 && "s"}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label={"Drawer"}
                    icon={
                      favorites.has(dog.id) ? (
                        <Icon as={AiFillStar as React.ElementType} />
                      ) : (
                        <Icon as={AiOutlineStar as React.ElementType} />
                      )
                    }
                    size="lg"
                    variant="ghost"
                    colorScheme="accent"
                    onClick={() => toggleFavorite(dog.id)}
                  ></IconButton>
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
