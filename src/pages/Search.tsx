import React, { Suspense, useState } from "react";
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
import DogCard from "../components/DogCard";
import Pagination from "../components/Pagination";
import ActiveFilters from "../components/ActiveFilters";
import SortMenu from "../components/SortMenu";
import { useDogSearch } from "../hooks/useDogSearch";
import { useUrlSync } from "../hooks/useUrlSync";

// Lazy load filter and modal components for performance
const FilterPopover = React.lazy(() => import("../components/FilterPopover"));
const FavoritesDrawer = React.lazy(
  () => import("../components/FavoritesDrawer")
);
const MatchResultModal = React.lazy(
  () => import("../components/MatchResultModal")
);

/**
 * Search page component.
 * Handles the main dog search UI, including filters, sorting, pagination, and match feature.
 */
const Search: React.FC = () => {
  // Responsive page size based on viewport
  const PAGE_SIZE = useBreakpointValue({ base: 10, md: 20 }) ?? 10;

  // Toast for feedback messages
  const toast = useToast();

  // Custom hook for managing all dog search/filter/sort state and logic
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

  // Sync filter/search state with URL query parameters
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
    setZipCodesInRadius,
  });

  // State for match modal (random favorite dog)
  const [matchDog, setMatchDog] = useState<Dog | null>(null);
  const [isMatchOpen, setIsMatchOpen] = useState<boolean>(false);

  // Favorites context for managing favorite dogs
  const { favorites, toggleFavorite } = useFavorites();

  // Pagination navigation handlers
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

  /**
   * Handles the "Match" button click.
   * Picks a random favorite dog and opens the match modal.
   */
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

  // Closes the match modal
  const handleMatchClose = () => {
    setIsMatchOpen(false);
    setMatchDog(null);
  };

  // Responsive positioning for the floating Match button
  const bottomOffset = useBreakpointValue({ base: "2rem", md: "2rem" });
  const horizontalPos = useBreakpointValue<{ left?: string; right?: string }>({
    base: { left: "50%", right: "auto" },
    md: { left: "auto", right: "2rem" },
  });

  const transformValue = useBreakpointValue({
    base: "translateX(-50%)",
    md: "none",
  });

  // Pagination calculations
  const currentPage = Math.floor(from / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const [inputPage, setInputPage] = useState(currentPage);

  /**
   * Generates an array of page numbers and ellipsis for pagination controls.
   */
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
        {/* Top filter and sort controls */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={2} mb={3}>
          <HStack spacing="4">
            {/* Filter popover for breeds, age, location, etc. */}
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
            {/* "Clear All" button for desktop */}
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

          {/* Sort menu */}
          <HStack spacing="4" flexShrink={0} whiteSpace={"nowrap"}>
            <SortMenu
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
            />
          </HStack>
        </Flex>
        {/* Active filters and "Clear All" for mobile */}
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

        {/* Dog results grid or loading spinner */}
        {loading ? (
          <Center py="20">
            <Spinner size="lg" color="brand.500" />
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
              {/* Render each dog card */}
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
            {/* Pagination controls */}
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
      {/* Favorites drawer (barkmarks) */}
      <Suspense fallback={null}>
        <FavoritesDrawer />
      </Suspense>
      {/* Match result modal */}
      <Suspense fallback={null}>
        <MatchResultModal
          isOpen={isMatchOpen}
          onClose={handleMatchClose}
          matchDog={matchDog}
        />
      </Suspense>

      {/* Floating "Match" button */}
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
