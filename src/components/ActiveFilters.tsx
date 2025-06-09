import { HStack, Tag, TagLabel, TagCloseButton, Box } from "@chakra-ui/react";
import { US_STATES } from "../constants/usStates";

/**
 * Props for the ActiveFilters component.
 * Displays currently active filters and allows users to remove them.
 */
interface ActiveFiltersProps {
  selectedBreeds: string[];
  setSelectedBreeds: (b: string[] | ((prev: string[]) => string[])) => void;
  ageRange: [number, number];
  setAgeRange: (r: [number, number]) => void;
  minAge: number;
  maxAge: number;
  selectedStates: string[];
  setSelectedStates: (s: string[] | ((prev: string[]) => string[])) => void;
  setStateZips: (z: string[]) => void;
  userZip: string;
  setUserZip: (z: string) => void;
  radiusMeters: number;
  setRadiusMeters: (n: number) => void;
  setZipCodesInRadius: (z: string[]) => void;
  setFrom: (n: number) => void;
}

/**
 * Renders tags for each active filter (breed, age, state, zip/radius).
 * Each tag can be removed individually to update the filter state.
 */
const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedBreeds,
  setSelectedBreeds,
  ageRange,
  setAgeRange,
  minAge,
  maxAge,
  selectedStates,
  setSelectedStates,
  setStateZips,
  userZip,
  setUserZip,
  radiusMeters,
  setRadiusMeters,
  setZipCodesInRadius,
  setFrom,
}) => (
  <Box>
    <HStack spacing="2" flexWrap="wrap">
      {/* Render a tag for each selected breed */}
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
              setSelectedBreeds((prev: string[]) =>
                prev.filter((b: string) => b !== breed)
              );
              setFrom(0);
            }}
          />
        </Tag>
      ))}
      {/* Render a tag for the selected age range if it differs from the default */}
      {!(ageRange[0] === minAge && ageRange[1] === maxAge) && (
        <Tag size="md" borderRadius="full" variant="solid" colorScheme="brand">
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
      {/* Render a tag for each selected state */}
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
                setSelectedStates((prev: string[]) =>
                  prev.filter((s: string) => s !== abbr)
                );
                setStateZips([]);
                setFrom(0);
              }}
            />
          </Tag>
        );
      })}
      {/* Render a tag for the zip code and radius filter */}
      {userZip && (
        <Tag size="md" borderRadius="full" variant="solid" colorScheme="brand">
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
);

export default ActiveFilters;
