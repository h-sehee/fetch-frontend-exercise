import React, { useEffect, useState } from "react";
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
  Tag,
} from "@chakra-ui/react";
import { useFavorites } from "../context/FavoritesContext";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Location, fetchLocationsByZip } from "../api";

const FavoritesDrawer: React.FC = () => {
  const {
    favorites,
    favoriteDogsDetails,
    isFavOpen,
    closeFavorites,
    toggleFavorite,
  } = useFavorites();

  const [dogLocations, setDogLocations] = useState<Record<string, Location>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      const zips = Array.from(
        new Set(favoriteDogsDetails.map((d) => d.zip_code))
      ).filter(Boolean);
      if (zips.length === 0) return;
      try {
        const locations = await fetchLocationsByZip(zips);
        const map: Record<string, Location> = {};
        for (const loc of locations) {
          if (!loc) continue;
          map[loc.zip_code] = loc;
        }
        setDogLocations(map);
      } catch (err) {
        console.error("Failed to fetch location data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [favoriteDogsDetails]);

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
            <VStack spacing="4" align="stretch" mt={2}>
              {favoriteDogsDetails.map((dog) => (
                <Flex key={dog.id} align="center" gap={4} borderRadius="md">
                  <Image
                    src={dog.img}
                    alt={dog.name}
                    boxSize="60px"
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
