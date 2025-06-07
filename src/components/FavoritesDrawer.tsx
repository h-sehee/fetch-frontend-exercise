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
  Tag,
  // useDisclosure,
  // Collapse
} from "@chakra-ui/react";
import { useFavorites } from "../context/FavoritesContext";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
// import { Location, fetchLocationsByZip } from "../api";

const FavoritesDrawer: React.FC = () => {
  const {
    favorites,
    favoriteDogsDetails,
    isFavOpen,
    closeFavorites,
    toggleFavorite,
  } = useFavorites();

  // const { isOpen, onToggle } = useDisclosure();
  // const [dogLocations, setDogLocations] = useState<Record<string, Location>>(
  //   {}
  // );
  // const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     setLoading(true);
  //     const zips = Array.from(
  //       new Set(favoriteDogsDetails.map((d) => d.zip_code))
  //     ).filter(Boolean);
  //     if (zips.length === 0) return;
  //     try {
  //       const locations = await fetchLocationsByZip(zips);
  //       const map: Record<string, Location> = {};
  //       for (const loc of locations) {
  //         if (!loc) continue;
  //         map[loc.zip_code] = loc;
  //       }
  //       setDogLocations(map);
  //     } catch (err) {
  //       console.error("Failed to fetch location data", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchLocations();
  // }, [favoriteDogsDetails]);

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
                  <HStack align="center" spacing="2">
                    <Text fontWeight="bold" fontSize="lg" mr={2}>
                      {dog.name}
                    </Text>

                    <HStack spacing={1} wrap="wrap">
                      <Tag colorScheme="blue" size="sm">
                        {dog.breed}
                      </Tag>
                    </HStack>

                    <HStack spacing={1}>
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
                        {dog.age} yrs
                      </Tag>
                    </HStack>
                  </HStack>

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
                  {/* <Collapse in={isOpen} animateOpacity>
                    <Box p={2} bg="darkBrand.500" color="white">
                      {dogLocations[dog.zip_code]?.city},{" "}
                      {dogLocations[dog.zip_code]?.state}
                    </Box>
                  </Collapse> */}
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
