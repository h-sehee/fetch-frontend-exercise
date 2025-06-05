import React, { useEffect, useState } from "react";
import {
  fetchBreeds,
  searchDogs,
  fetchDogsByIds,
  generateMatch,
  Dog,
  fetchLocationsByZip,
  searchLocations,
  Location,
} from "../api";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Select,
  Spinner,
  useToast,
  Text,
  VStack,
  Icon,
  HStack,
  useBreakpointValue,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import {
  FaPaw,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortNumericDown,
  FaSortNumericUp,
} from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import FavoritesDrawer from "../components/FavoritesDrawer";
import MatchResultModal from "../components/MatchResultModal";
import FilterPopover from "../components/FilterPopover";

const PAGE_SIZE = 10;

const Search: React.FC = () => {
  const toast = useToast();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 0]);

  const [userZip, setUserZip] = useState<string>("");
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [zipCodesInRadius, setZipCodesInRadius] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<"breed" | "name" | "age" | "location">(
    "breed"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [from, setFrom] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [dogResults, setDogResults] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [matchDog, setMatchDog] = useState<Dog | null>(null);
  const [isMatchOpen, setIsMatchOpen] = useState<boolean>(false);

  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchAllBreeds = async () => {
      try {
        const data = await fetchBreeds();
        setBreeds(data.sort());
      } catch {
        toast({
          title: "Error",
          description: "Failed to load breeds.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchMinMaxAge = async () => {
      try {
        const resMin = await searchDogs([], 1, 0, "age:asc");
        if (resMin.resultIds.length > 0) {
          const [dogMin] = await fetchDogsByIds(resMin.resultIds);
          setMinAge(dogMin.age);
        } else {
          setMinAge(0);
        }

        const resMax = await searchDogs([], 1, 0, "age:desc");
        if (resMax.resultIds.length > 0) {
          const [dogMax] = await fetchDogsByIds(resMax.resultIds);
          setMaxAge(dogMax.age);
        } else {
          setMaxAge(0);
        }
      } catch {
        setMinAge(0);
        setMaxAge(0);
      }
    };

    fetchAllBreeds();
    fetchMinMaxAge();
  }, [toast]);

  useEffect(() => {
    if (minAge <= maxAge) {
      setAgeRange([minAge, maxAge]);
    }
  }, [minAge, maxAge]);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);

      try {
        const sortParam = `${sortBy}:${sortDir}`;

        const [minFilter, maxFilter] = ageRange;

        const response = await searchDogs(
          selectedBreeds,
          PAGE_SIZE,
          from,
          sortParam,
          minFilter > minAge ? minFilter : undefined,
          maxFilter < maxAge ? maxFilter : undefined,
          zipCodesInRadius
        );

        setTotal(response.total);

        let dogs: Dog[] = [];
        if (response.resultIds.length > 0) {
          dogs = await fetchDogsByIds(response.resultIds);
        }

        setDogResults(dogs);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to search dogs",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setDogResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    if (maxAge > 0) {
      doSearch();
    }
  }, [
    selectedBreeds,
    ageRange,
    zipCodesInRadius,
    sortBy,
    sortDir,
    from,
    minAge,
    maxAge,
    toast,
  ]);

  useEffect(() => {
      const fetchNearbyZips = async () => {
        if (!userZip) {
          setZipCodesInRadius([]);
          return;
        }
        try {
          const locations: Location[] = await fetchLocationsByZip([userZip]);
          if (locations.length === 0) {
            setZipCodesInRadius([]);
            return;
          }
          const { latitude: userLat, longitude: userLon } = locations[0];
  
          const deltaLat = radiusMeters / 111000;
          const deltaLon =
            radiusMeters / (111000 * Math.cos((userLat * Math.PI) / 180));
  
          const { results } = await searchLocations({
            geoBoundingBox: {
              bottom_left: { lat: userLat - deltaLat, lon: userLon - deltaLon },
              top_right: { lat: userLat + deltaLat, lon: userLon + deltaLon },
            },
            size: 10000,
          });
  
          setZipCodesInRadius(results.map((r) => r.zip_code));
        } catch (err) {
          console.error("Error fetching nearby ZIPs:", err);
          setZipCodesInRadius([]);
        }
      };
  
      fetchNearbyZips();
    }, [userZip, radiusMeters]);

  const goNext = () => {
    if (from + PAGE_SIZE < total) {
      setFrom((prev) => prev + PAGE_SIZE);
    }
  };
  const goPrev = () => {
    if (from - PAGE_SIZE >= 0) {
      setFrom((prev) => prev - PAGE_SIZE);
    }
  };

  const handleGenerateMatch = async () => {
    if (favorites.size === 0) {
      toast({
        title: "No Favorites",
        description: "Please add at least one dog to favorites.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const favIds = Array.from(favorites);
      const matchedId = await generateMatch(favIds);
      const matchedDogArr = await fetchDogsByIds([matchedId]);
      setMatchDog(matchedDogArr[0] || null);
      setIsMatchOpen(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate a match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMatchClose = () => {
    setIsMatchOpen(false);
    setMatchDog(null);
  };

  const bottomOffset = useBreakpointValue({ base: "2rem", md: "2rem" });
  const horizontalPos = useBreakpointValue<{ left?: string; right?: string }>({
    base: { left: "50%" },
    md: { right: "2rem" },
  });

  const transformValue = useBreakpointValue({
    base: "translateX(-50%)",
    md: "none",
  });

  return (
    <Box p="4">
      <VStack align="stretch" spacing="6">
        <HStack wrap="wrap" align="flex-end" spacing="8">
          <FilterPopover
            allBreeds={breeds}
            selectedBreeds={selectedBreeds}
            onChangeBreeds={(vals) => {
              setSelectedBreeds(vals);
              setFrom(0);
            }}
            minAge={minAge}
            maxAge={maxAge}
            ageRange={ageRange}
            onChangeAgeRange={(range) => {
              setAgeRange(range);
              setFrom(0);
            }}
            userZip={userZip}
            onChangeUserZip={(zip) => {
              setUserZip(zip);
              setFrom(0);
            }}
            radiusMeters={radiusMeters}
            onChangeRadius={(meters) => {
              setRadiusMeters(meters);
              setFrom(0);
            }}
          />

          <HStack spacing="4" flexShrink={0} whiteSpace={"nowrap"}>
            <Text fontWeight="semibold" mb="1">
              Sort By:
            </Text>
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "breed" | "name" | "age");
                setFrom(0);
              }}
              focusBorderColor="accent.500"
            >
              <option value="breed">Breed</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
            </Select>
            <Button
              size="sm"
              onClick={() =>
                setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              colorScheme="brand"
              variant="solid"
            >
              <Icon
                as={
                  sortBy === "age"
                    ? sortDir === "asc"
                      ? (FaSortNumericDown as React.ElementType)
                      : (FaSortNumericUp as React.ElementType)
                    : sortDir === "asc"
                    ? (FaSortAlphaDown as React.ElementType)
                    : (FaSortAlphaUp as React.ElementType)
                }
                boxSize={5}
              />
            </Button>
          </HStack>

          <Box>
            
          </Box>
        </HStack>
        <HStack wrap="wrap" spacing="2" mb="2">
          <Box>
            <HStack spacing="2" flexWrap="wrap">
              {selectedBreeds.map((breed) => (
                <Tag
                  size="md"
                  key={breed}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                >
                  <TagLabel>{breed}</TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      setSelectedBreeds((prev) =>
                        prev.filter((b) => b !== breed)
                      );
                      setFrom(0);
                    }}
                  />
                </Tag>
              ))}

              {!(ageRange[0] === minAge && ageRange[1] === maxAge) && (
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                >
                  <TagLabel>
                    Age: {ageRange[0]} - {ageRange[1]}
                  </TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      setAgeRange([minAge, maxAge]);
                      setFrom(0);
                    }}
                  />
                </Tag>
              )}

              {userZip && (
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                >
                  <TagLabel>ZIP: {userZip} | ~{radiusMeters} m</TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      setUserZip("");
                      setZipCodesInRadius([]);
                      setFrom(0);
                    }}
                  />
                </Tag>
              )}
            </HStack>
          </Box>s
        </HStack>

        {loading ? (
          <Center py="20">
            <Spinner size="lg" color="accent.500" />
          </Center>
        ) : (
          <>
            <Text mb="2">
              {`Total results: ${total}. Showing ${dogResults.length} item${
                dogResults.length !== 1 ? "s" : ""
              }.`}
            </Text>

            <Grid
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              gap="6"
            >
              {dogResults.map((dog) => (
                <GridItem
                  key={dog.id}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                  _hover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <Image
                    src={dog.img}
                    alt={dog.name}
                    boxSize="150px"
                    objectFit="cover"
                    w="100%"
                  />
                  <Box p="4">
                    <Text fontWeight="semibold" fontSize="lg" noOfLines={1}>
                      {dog.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Breed: {dog.breed}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Age: {dog.age} year{dog.age > 1 ? "s" : ""}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Zip: {dog.zip_code}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Favorite"
                    icon={
                      favorites.has(dog.id) ? (
                        <Icon as={AiFillStar as React.ElementType} />
                      ) : (
                        <Icon as={AiOutlineStar as React.ElementType} />
                      )
                    }
                    color="accent.500"
                    fontSize="20px"
                    fontWeight="bold"
                    position="absolute"
                    borderRadius="full"
                    top="2"
                    right="2"
                    size="sm"
                    onClick={() => toggleFavorite(dog.id)}
                  />
                </GridItem>
              ))}
            </Grid>

            <Flex justify="space-between" align="center" mt="6">
              <Button
                onClick={goPrev}
                disabled={from === 0}
                colorScheme="brand"
                variant="outline"
              >
                Prev
              </Button>
              <Text>
                Page {Math.floor(from / PAGE_SIZE) + 1} of{" "}
                {Math.ceil(total / PAGE_SIZE) || 1}
              </Text>
              <Button
                onClick={goNext}
                disabled={from + PAGE_SIZE >= total}
                colorScheme="brand"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </VStack>
      <FavoritesDrawer />
      <MatchResultModal
        isOpen={isMatchOpen}
        onClose={handleMatchClose}
        matchDog={matchDog}
      />
      <Button
        position="fixed"
        bottom={bottomOffset}
        {...horizontalPos}
        transform={transformValue}
        colorScheme="darkBrand"
        leftIcon={
          <Icon as={FaPaw as React.ElementType} boxSize={5} color="white" />
        }
        boxShadow="lg"
        px="6"
        py="4"
        fontSize="lg"
        borderRadius="full"
        _hover={{ transform: "scale(1.05)" }}
        transition="transform 0.2s"
        onClick={handleGenerateMatch}
      >
        Match
      </Button>
    </Box>
  );
};

export default Search;
