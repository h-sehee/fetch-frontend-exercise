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

interface DogCardProps {
  dog: Dog;
  location?: Location;
  isFavorite: boolean;
  onFilterByBreed: (breed: string) => void;
  onFilterByAge: (age: number) => void;
  onFilterByState: (state: string) => void;
  onFavoriteToggle: (id: string) => void;
}

const DogCard: React.FC<DogCardProps> = ({
  dog,
  location,
  isFavorite,
  onFilterByBreed,
  onFilterByAge,
  onFilterByState,
  onFavoriteToggle,
}) => {
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
      <Avatar
        src={dog.img}
        loading="lazy"
        boxSize="200px"
        objectFit="cover"
        w="100%"
        borderRadius="none"
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
              onClick={() => onFilterByBreed(dog.breed)}
            >
              {dog.breed}
            </Tag>
          </HStack>

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
