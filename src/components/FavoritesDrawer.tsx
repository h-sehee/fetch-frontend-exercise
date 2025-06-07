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
  Text,
  Box,
  IconButton,
  Flex,
  Icon,
  Tag,
  Avatar,
} from "@chakra-ui/react";
import { useFavorites } from "../context/FavoritesContext";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDogLocations } from "../hooks/useDogLocation";

const FavoritesDrawer: React.FC = () => {
  const {
    favorites,
    favoriteDogsDetails,
    isFavOpen,
    closeFavorites,
    toggleFavorite,
  } = useFavorites();

  const zips = Array.from(
    new Set(favoriteDogsDetails.map((d) => d.zip_code))
  ).filter(Boolean);
  const { locationsMap: dogLocations, loading } =
    useDogLocations(zips);

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
              <Text color="gray.500">
                Nothing here yet. Find a pup you love!
              </Text>
            </Box>
          ) : (
            <VStack spacing="4" align="stretch" mt={3}>
              {favoriteDogsDetails.map((dog) => (
                <Flex key={dog.id} align="center" gap={4} borderRadius="md">
                  <Avatar
                    src={dog.img}
                    boxSize="70px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      {dog.name}
                    </Text>

                    <HStack spacing={2} wrap="wrap">
                      <Tag colorScheme="blue" size="sm">
                        {dog.breed}
                      </Tag>
                      <Tag
                        size="sm"
                        colorScheme={
                          dog.age <= 2
                            ? "green"
                            : dog.age <= 8
                            ? "yellow"
                            : "red"
                        }
                      >
                        {dog.age} yr{dog.age > 1 ? "s" : ""}
                      </Tag>
                      {loading ? (
                        <></>
                      ) : (
                        <Tag variant="outline" size="sm">
                          {dogLocations[dog.zip_code]?.state}
                        </Tag>
                      )}
                    </HStack>
                  </VStack>

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
                    ml="auto"
                  ></IconButton>
                </Flex>
              ))}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FavoritesDrawer;
