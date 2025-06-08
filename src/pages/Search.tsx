import React, { useState } from "react";
import { fetchDogsByIds, generateMatch, Dog } from "../api";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Spinner,
  useToast,
  VStack,
  Icon,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaPaw } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import FavoritesDrawer from "../components/FavoritesDrawer";
import MatchResultModal from "../components/MatchResultModal";
import FilterPopover from "../components/FilterPopover";
import DogCard from "../components/DogCard";
import Pagination from "../components/Pagination";
import ActiveFilters from "../components/ActiveFilters";
import SortMenu from "../components/SortMenu";
import { useDogSearch } from "../hooks/useDogSearch";
import { useUrlSync } from "../hooks/useUrlSync";

const Search: React.FC = () => {
  const PAGE_SIZE = useBreakpointValue({ base: 10, md: 20 }) ?? 10;
  
  const toast = useToast();

  const {
    breeds,
    selectedBreeds,
    setSelectedBreeds,
    minAge,
    maxAge,
    ageRange,
    setAgeRange,
    userZip,
    setUserZip,
    radiusMeters,
    setRadiusMeters,
    setZipCodesInRadius,
    selectedStates,
    setSelectedStates,
    setStateZips,
    zipToLocation,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    from,
    setFrom,
    dogResults,
    total,
    loading,
  } = useDogSearch(toast, PAGE_SIZE);

  useUrlSync({
    selectedBreeds,
    setSelectedBreeds,
    ageRange,
    minAge,
    maxAge,
    setAgeRange,
    userZip,
    setUserZip,
    radiusMeters,
    setRadiusMeters,
    selectedStates,
    setSelectedStates,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    from,
    setFrom,
    setStateZips,
    setZipCodesInRadius
  });

  const [matchDog, setMatchDog] = useState<Dog | null>(null);
  const [isMatchOpen, setIsMatchOpen] = useState<boolean>(false);

  const { favorites, toggleFavorite } = useFavorites();

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
    base: { left: "50%", right: "auto" },
    md: { left: "auto", right: "2rem" },
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
              radiusMeters={radiusMeters ?? 0}
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
            <SortMenu
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
            />
          </HStack>
        </Flex>
        <HStack wrap="wrap" spacing="2" mb="2">
          <ActiveFilters
            selectedBreeds={selectedBreeds}
            setSelectedBreeds={setSelectedBreeds}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            minAge={minAge}
            maxAge={maxAge}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            setStateZips={setStateZips}
            userZip={userZip}
            setUserZip={setUserZip}
            radiusMeters={radiusMeters ?? 0}
            setRadiusMeters={setRadiusMeters}
            setZipCodesInRadius={setZipCodesInRadius}
            setFrom={setFrom}
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
              templateColumns={"repeat(auto-fill, minmax(200px, 1fr))"}
              w="100%"
              maxW="2216px"
              mx="auto"
              gap="6"
            >
              {dogResults.map((dog) => (
                <DogCard
                  dog={dog}
                  key={dog.id}
                  location={zipToLocation[dog.zip_code]}
                  isFavorite={favorites.has(dog.id)}
                  onFilterByBreed={() => {
                    setSelectedBreeds([dog.breed]);
                    setFrom(0);
                  }}
                  onFilterByAge={() => {
                    if (dog.age <= 2) setAgeRange([0, 2]);
                    else if (dog.age <= 8) setAgeRange([3, 8]);
                    else setAgeRange([9, maxAge]);
                    setFrom(0);
                  }}
                  onFilterByState={() => {
                    const state = zipToLocation[dog.zip_code]?.state;
                    if (state && !selectedStates.includes(state)) {
                      setSelectedStates((prev) => [...prev, state]);
                      setFrom(0);
                    }
                  }}
                  onFavoriteToggle={() => toggleFavorite(dog.id)}
                />
              ))}
            </Grid>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              getPageNumbers={getPageNumbers}
              onPageChange={(page) => setFrom((page - 1) * PAGE_SIZE)}
              canPrev={from > 0}
              canNext={from + PAGE_SIZE < total}
              onPrev={goPrev}
              onNext={goNext}
              inputPage={inputPage}
              setInputPage={setInputPage}
              pageSize={PAGE_SIZE}
              total={total}
              from={from}
            />
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
        _hover={{ transform: "scale(1.1)" }}
        transition="transform 0.2s"
        onClick={handleGenerateMatch}
      >
        Match
      </Button>
    </Box>
  );
};

export default Search;
