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
  Input,
  PopoverBody,
  PopoverContent,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
} from "@chakra-ui/react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaCaretDown, FaCaretUp, FaPaw } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import FavoritesDrawer from "../components/FavoritesDrawer";
import MatchResultModal from "../components/MatchResultModal";
import FilterPopover from "../components/FilterPopover";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { US_STATES } from "../components/FilterPopover";

const Search: React.FC = () => {
  const PAGE_SIZE = useBreakpointValue({ base: 10, md: 20 }) ?? 10;

  const toast = useToast();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 0]);

  const [userZip, setUserZip] = useState<string>("");
  const [zipToLocation, setZipToLocation] = useState<Record<string, Location>>(
    {}
  );
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [zipCodesInRadius, setZipCodesInRadius] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [stateZips, setStateZips] = useState<string[]>([]);

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

        let zipFilter: string[] | undefined;

        if (zipCodesInRadius.length > 0 && stateZips.length > 0) {
          zipFilter = zipCodesInRadius.filter((z) => stateZips.includes(z));
        } else if (zipCodesInRadius.length > 0) {
          zipFilter = zipCodesInRadius;
        } else if (stateZips.length > 0) {
          zipFilter = stateZips;
        } else {
          zipFilter = [];
        }

        if (zipFilter && zipFilter.length > 1000) {
          zipFilter = zipFilter.slice(0, 1000);
        }

        const response = await searchDogs(
          selectedBreeds,
          PAGE_SIZE,
          from,
          sortParam,
          minFilter > minAge ? minFilter : undefined,
          maxFilter < maxAge ? maxFilter : undefined,
          zipFilter
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
    stateZips,
    sortBy,
    sortDir,
    from,
    minAge,
    maxAge,
    toast,
    PAGE_SIZE,
  ]);

  useEffect(() => {
    const fetchStateZips = async () => {
      if (!selectedStates) {
        setStateZips([]);
        return;
      }
      try {
        const { results } = await searchLocations({
          states: selectedStates,
          size: 10000,
        });
        setStateZips(results.map((r) => r.zip_code));

        setStateZips(results.map((r) => r.zip_code));
      } catch (err) {
        console.error("Error fetching nearby ZIPs:", err);
        setStateZips([]);
      }
    };

    fetchStateZips();
  }, [selectedStates]);

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

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      const zips = Array.from(
        new Set(dogResults.map((d) => d.zip_code))
      ).filter(Boolean);
      if (zips.length === 0) return;
      try {
        const locations = await fetchLocationsByZip(zips);
        const map: Record<string, Location> = {};
        for (const loc of locations) {
          if (!loc) continue;
          map[loc.zip_code] = loc;
        }
        setZipToLocation(map);
      } catch (err) {
        console.error("Failed to fetch location data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [dogResults]);

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

  const currentPage = Math.floor(from / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const [inputPage, setInputPage] = useState(currentPage);

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <Box p="4">
      <VStack align="stretch" spacing="6">
        <Flex justify="space-between" align="center" wrap="wrap" gap={2} mb={3}>
          <HStack spacing="4">
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
              selectedStates={selectedStates}
              onChangeStates={(states) => {
                setSelectedStates(states);
                setFrom(0);
              }}
            />
            {(selectedBreeds.length > 0 ||
              !(ageRange[0] === minAge && ageRange[1] === maxAge) ||
              selectedStates.length > 0 ||
              userZip) && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  setSelectedBreeds([]);
                  setAgeRange([minAge, maxAge]);
                  setUserZip("");
                  setRadiusMeters(0);
                  setZipCodesInRadius([]);
                  setSelectedStates([]);
                  setStateZips([]);
                  setFrom(0);
                }}
                _hover={{ transform: "scale(1.1)", bg: "transparent" }}
                transition="transform 0.1s"
                display={{ base: "none", md: "inline-flex" }}
              >
                Clear All
              </Button>
            )}
          </HStack>

          <HStack spacing="4" flexShrink={0} whiteSpace={"nowrap"}>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme="accent"
                rightIcon={
                  <Icon
                    as={
                      sortDir === "asc"
                        ? (FaCaretUp as React.ElementType)
                        : (FaCaretDown as React.ElementType)
                    }
                    boxSize={5}
                  />
                }
              >
                Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </MenuButton>
              <MenuList bg="white">
                <MenuOptionGroup
                  defaultValue={sortDir}
                  title="Order"
                  type="radio"
                >
                  <MenuItemOption value="asc" onClick={() => setSortDir("asc")}>
                    Ascending
                  </MenuItemOption>
                  <MenuItemOption
                    value="desc"
                    onClick={() => setSortDir("desc")}
                  >
                    Descending
                  </MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup
                  defaultValue={sortBy}
                  title="Sort By"
                  type="radio"
                >
                  <MenuItemOption
                    value="breed"
                    onClick={() => setSortBy("breed")}
                  >
                    Breed
                  </MenuItemOption>
                  <MenuItemOption
                    value="name"
                    onClick={() => setSortBy("name")}
                  >
                    Name
                  </MenuItemOption>
                  <MenuItemOption value="age" onClick={() => setSortBy("age")}>
                    Age
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
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
              {selectedStates.map((abbr) => {
                const stateObj = US_STATES.find((s) => s.code === abbr);
                return (
                  <Tag
                    key={abbr}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="brand"
                  >
                    <TagLabel>{stateObj?.name || abbr}</TagLabel>
                    <TagCloseButton
                      onClick={() => {
                        setSelectedStates((prev) =>
                          prev.filter((s) => s !== abbr)
                        );
                        setStateZips([]);
                        setFrom(0);
                      }}
                    />
                  </Tag>
                );
              })}
              {userZip && (
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                >
                  <TagLabel>
                    ZIP: {userZip} | ~{radiusMeters / 1000} km
                  </TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      setUserZip("");
                      setRadiusMeters(0);
                      setZipCodesInRadius([]);
                      setFrom(0);
                    }}
                  />
                </Tag>
              )}
            </HStack>
          </Box>
          {(selectedBreeds.length > 0 ||
            !(ageRange[0] === minAge && ageRange[1] === maxAge) ||
            selectedStates.length > 0 ||
            userZip) && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => {
                setSelectedBreeds([]);
                setAgeRange([minAge, maxAge]);
                setUserZip("");
                setRadiusMeters(0);
                setZipCodesInRadius([]);
                setSelectedStates([]);
                setStateZips([]);
                setFrom(0);
              }}
              _hover={{ bg: "transparent" }}
              display={{ base: "inline-flex", md: "none" }}
            >
              Clear All
            </Button>
          )}
        </HStack>

        {loading ? (
          <Center py="20">
            <Spinner size="lg" color="accent.500" />
          </Center>
        ) : (
          <>
            <Grid
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              gap="6"
            >
              {dogResults.map((dog) => (
                <GridItem
                  key={dog.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  position="relative"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                  display="flex"
                  flexDirection="column"
                >
                  <Image
                    src={dog.img}
                    alt={dog.name}
                    boxSize="200px"
                    objectFit="cover"
                    w="100%"
                  />
                  <Box p="4" flex="1">
                    <VStack align="start" spacing="2">
                      <Text fontWeight="bold" fontSize="lg">
                        {dog.name}
                      </Text>

                      <HStack spacing={1} wrap="wrap">
                        <Tag
                          colorScheme="blue"
                          size="sm"
                          cursor="pointer"
                          onClick={() => {
                            setSelectedBreeds([dog.breed]);
                            setFrom(0);
                          }}
                        >
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
                          cursor="pointer"
                          onClick={() => {
                            if (dog.age <= 2) setAgeRange([0, 2]);
                            else if (dog.age <= 8) setAgeRange([3, 8]);
                            else setAgeRange([9, maxAge]);
                            setFrom(0);
                          }}
                        >
                          {dog.age} yr{dog.age > 1 ? "s" : ""}
                        </Tag>
                      </HStack>
                    </VStack>
                  </Box>
                  <Box
                    mt="auto"
                    bg="darkBrand.500"
                    color="white"
                    px={3}
                    py={2}
                    borderBottomRadius="md"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    opacity={0.8}
                  >
                    <Box>
                      <Text
                        fontSize="xs"
                        whiteSpace="pre-wrap"
                        fontWeight="bold"
                      >
                        {zipToLocation[dog.zip_code]?.city},{" "}
                        {zipToLocation[dog.zip_code]?.county}
                      </Text>
                      <Text fontSize="xs">{dog.zip_code}</Text>
                    </Box>
                    <IconButton
                      aria-label="Filter by state"
                      icon={
                        <Text fontSize="xs">
                          {zipToLocation[dog.zip_code]?.state}
                        </Text>
                      }
                      size="xs"
                      borderRadius="full"
                      colorScheme="whiteAlpha"
                      onClick={() => {
                        const state = zipToLocation[dog.zip_code]?.state;
                        if (state && !selectedStates.includes(state)) {
                          setSelectedStates((prev) => [...prev, state]);
                          setFrom(0);
                        }
                      }}
                      _hover={{ transform: "scale(1.1)" }}
                      transition="transform 0.1s"
                    />
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

            <Flex
              justify="center"
              align="center"
              mt="6"
              direction="column"
              gap="2"
            >
              <HStack spacing={1}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={goPrev}
                  isDisabled={from === 0}
                  aria-label="Previous"
                />

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <Popover placement="top">
                      <PopoverTrigger>
                        <Button variant="ghost" size="sm">
                          ...
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent w="fit-content">
                        <PopoverArrow />
                        <PopoverBody>
                          <HStack spacing={2}>
                            <Input
                              size="sm"
                              type="number"
                              value={inputPage}
                              min={1}
                              max={totalPages}
                              onChange={(e) =>
                                setInputPage(parseInt(e.target.value))
                              }
                              w="80px"
                            />
                            <Button
                              size="sm"
                              colorScheme="brand"
                              onClick={() => {
                                const page = Math.max(
                                  1,
                                  Math.min(totalPages, inputPage)
                                );
                                setFrom((page - 1) * PAGE_SIZE);
                              }}
                            >
                              Go
                            </Button>
                          </HStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button
                      key={page}
                      colorScheme={page === currentPage ? "brand" : "gray"}
                      variant={page === currentPage ? "solid" : "ghost"}
                      size="sm"
                      onClick={() => setFrom((page - 1) * PAGE_SIZE)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={goNext}
                  isDisabled={from + PAGE_SIZE >= total}
                  aria-label="Next"
                />
              </HStack>

              <Text fontSize="sm" color="gray.600" whiteSpace="nowrap" mt="2">
                Showing{" "}
                <b>
                  {from + 1}–{Math.min(from + PAGE_SIZE, total)}
                </b>{" "}
                of <b>{total}</b> results
              </Text>
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
