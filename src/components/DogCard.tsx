import React from "react";
import {
  Avatar,
  GridItem,
  Box,
  VStack,
  Text,
  HStack,
  Tag,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Dog, Location } from "../api";

/**
 * Props for the DogCard component.
 * Displays information about a single dog and allows filtering and favoriting actions.
 */
interface DogCardProps {
  dog: Dog;
  location?: Location;
  isFavorite: boolean;
  onFilterByBreed: (breed: string) => void;
  onFilterByAge: (age: number) => void;
  onFilterByState: (state: string) => void;
  onFavoriteToggle: (id: string) => void;
}

/**
 * Renders a card displaying dog details, location, and interactive filter/favorite buttons.
 */
const DogCard: React.FC<DogCardProps> = ({
  dog,
  location,
  isFavorite,
  onFilterByBreed,
  onFilterByAge,
  onFilterByState,
  onFavoriteToggle,
}) => {
  // Determine tag color based on dog's age
  const ageScheme = dog.age <= 2 ? "green" : dog.age <= 8 ? "yellow" : "red";

  return (
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
      {/* Dog image */}
      <Avatar
        src={dog.img}
        loading="lazy"
        boxSize="200px"
        objectFit="cover"
        w="100%"
        borderRadius="none"
      />
      {/* Dog info */}
      <Box p="4" flex="1">
        <VStack align="start" spacing="2">
          <Text fontWeight="bold" fontSize="lg">
            {dog.name}
          </Text>
          {/* Breed tag with filter action */}
          <HStack spacing={1} wrap="wrap">
            <Tag
              colorScheme="blue"
              size="sm"
              cursor="pointer"
              onClick={() => onFilterByBreed(dog.breed)}
            >
              {dog.breed}
            </Tag>
          </HStack>
          {/* Age tag with filter action */}
          <HStack spacing={1}>
            <Tag
              size="sm"
              colorScheme={ageScheme}
              cursor="pointer"
              onClick={() => onFilterByAge(dog.age)}
            >
              {dog.age} yr{dog.age > 1 ? "s" : ""}
            </Tag>
          </HStack>
        </VStack>
      </Box>
      {/* Location and state filter */}
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
          <Text fontSize="xs" whiteSpace="pre-wrap" fontWeight="bold">
            {location?.city}, {location?.county}
          </Text>
          <Text fontSize="xs">{dog.zip_code}</Text>
        </Box>
        <IconButton
          aria-label="Filter by state"
          icon={<Text fontSize="xs">{location?.state}</Text>}
          size="xs"
          borderRadius="full"
          colorScheme="whiteAlpha"
          onClick={() => location && onFilterByState(location.state)}
          _hover={{ transform: "scale(1.1)" }}
          transition="transform 0.1s"
        />
      </Box>
      {/* Favorite button */}
      <IconButton
        aria-label="Favorite"
        icon={
          isFavorite ? (
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
        onClick={() => onFavoriteToggle(dog.id)}
      />
    </GridItem>
  );
};

export default React.memo(DogCard);
