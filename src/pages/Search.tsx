import React, { useEffect, useState, useCallback } from "react";
import {
  fetchBreeds,
  searchDogs,
  fetchDogsByIds,
  generateMatch,
  Dog,
} from "../api/dog";
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
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const PAGE_SIZE = 10;
const Search = () => {
  const toast = useToast();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [from, setFrom] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [dogResults, setDogResults] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [matchDog, setMatchDog] = useState<Dog | null>(null);
useEffect(() => {
    (async () => {
      try {
        const data = await fetchBreeds();
        setBreeds(data.sort());
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load breeds",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    })();
  }, [toast]);

  const doSearch = useCallback(async () => {
    setLoading(true);
    try {
      const sortParam = `breed:${sortDir}`;
      const breedArr = selectedBreed ? [selectedBreed] : [];
      const res = await searchDogs(breedArr, PAGE_SIZE, from, sortParam);
      setTotal(res.total);

      if (res.resultIds.length > 0) {
        const dogList = await fetchDogsByIds(res.resultIds);
        setDogResults(dogList);
      } else {
        setDogResults([]);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to search dogs",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedBreed, sortDir, from, toast]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

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

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
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

  return (
    <Box p="4">
      <VStack align="stretch">
        <Flex wrap="wrap" align="center" justify="space-between" mb="4">
          {/* Breed Filter */}
          <Box>
            <Text fontWeight="semibold" mb="1">
              Filter by Breed:
            </Text>
            <Select
              placeholder="All Breeds"
              value={selectedBreed}
              onChange={(e) => {
                setSelectedBreed(e.target.value);
                setFrom(0);
              }}
            >
              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
              Sort by Breed:
            </Text>
            <Button
              size="sm"
              onClick={() =>
                setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortDir === "asc" ? "Ascending ↑" : "Descending ↓"}
            </Button>
          </Box>

          <Box>
            <Button colorScheme="purple" onClick={handleGenerateMatch}>
              Generate Match
            </Button>
          </Box>
        </Flex>

        {matchDog && (
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
            mb="4"
          >
            <Text fontSize="lg" fontWeight="bold" mb="2">
              🎉 Your Matched Dog! 🎉
            </Text>
            <Flex align="center">
              <Image
                src={matchDog.img}
                alt={matchDog.name}
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
                mr="4"
              />
              <VStack align="start" spacing="1">
                <Text>
                  <strong>Name:</strong> {matchDog.name}
                </Text>
                <Text>
                  <strong>Breed:</strong> {matchDog.breed}
                </Text>
                <Text>
                  <strong>Age:</strong> {matchDog.age} year
                  {matchDog.age > 1 ? "s" : ""}
                </Text>
                <Text>
                  <strong>Zip Code:</strong> {matchDog.zip_code}
                </Text>
              </VStack>
            </Flex>
          </Box>
        )}

        {loading ? (
          <Center py="20">
            <Spinner size="lg" />
          </Center>
        ) : (
          <>
            <Text mb="2">
              {`Total results: ${total}. Showing ${dogResults.length} item${
                dogResults.length !== 1 ? "s" : ""
              }.`}
            </Text>

            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="6">
              {dogResults.map((dog) => (
                <GridItem
                  key={dog.id}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
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
                    icon={<StarIcon />}
                    colorScheme={favorites.has(dog.id) ? "yellow" : "gray"}
                    position="absolute"
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
                colorScheme="teal"
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
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </VStack>
    </Box>
  );

};

export default Search;
