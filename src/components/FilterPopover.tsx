import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  CheckboxGroup,
  VStack,
  Box,
  Text,
  Divider,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Icon,
  Tag,
  Wrap,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { IoFilter } from "react-icons/io5";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { US_STATES } from "../constants/usStates";

/**
 * Props for the FilterPopover component.
 * Controls all filter options for the dog search (breed, age, location, distance).
 */
interface FilterPopoverProps {
  allBreeds: string[];
  selectedBreeds: string[];
  onChangeBreeds: (breeds: string[]) => void;

  minAge: number;
  maxAge: number;
  ageRange: [number, number];
  onChangeAgeRange: (range: [number, number]) => void;

  userZip: string;
  onChangeUserZip: (zip: string) => void;
  radiusMeters: number;
  onChangeRadius: (meters: number) => void;
  selectedStates: string[];
  onChangeStates: (states: string[]) => void;
}

/**
 * FilterPopover component provides UI for selecting and managing search filters.
 * Includes breed, age, state, zip code, and distance filters.
 */
const FilterPopover: React.FC<FilterPopoverProps> = ({
  allBreeds,
  selectedBreeds,
  onChangeBreeds,
  minAge,
  maxAge,
  ageRange,
  onChangeAgeRange,
  userZip,
  onChangeUserZip,
  radiusMeters,
  onChangeRadius,
  selectedStates,
  onChangeStates,
}) => {
  // Local state for breed search input
  const [breedSearch, setBreedSearch] = useState<string>("");

  // Local state for temporary age range slider
  const [tempAgeRange, setTempAgeRange] = useState<[number, number]>(ageRange);

  // Local state for temporary zip code input
  const [tempZip, setTempZip] = useState<string>(userZip);

  // Local state for state search input
  const [stateSearch, setStateSearch] = useState("");

  // Filter US states based on search input and already selected states
  const filteredStates = useMemo(() => {
    return US_STATES.filter(
      ({ code, name }) =>
        !selectedStates.includes(code) &&
        (code.toLowerCase().includes(stateSearch.toLowerCase()) ||
          name.toLowerCase().includes(stateSearch.toLowerCase()))
    );
  }, [stateSearch, selectedStates]);

  // Sync tempAgeRange with external ageRange prop
  useEffect(() => {
    setTempAgeRange(ageRange);
  }, [ageRange]);

  // Clamp tempAgeRange if min/max age changes
  useEffect(() => {
    setTempAgeRange(([prevMin, prevMax]) => {
      const newMin = prevMin < minAge ? minAge : prevMin;
      const newMax = prevMax > maxAge ? maxAge : prevMax;
      return [newMin, newMax];
    });
  }, [minAge, maxAge]);

  // Sync tempZip with external userZip/radiusMeters
  useEffect(() => {
    setTempZip(userZip);
  }, [userZip, radiusMeters]);

  // Filter breeds based on search input
  const filteredBreeds = useMemo(() => {
    return allBreeds.filter((b) =>
      b.toLowerCase().includes(breedSearch.toLowerCase())
    );
  }, [breedSearch, allBreeds]);

  // Handler for breed selection changes
  const handleBreedsChange = (vals: string[]) => {
    onChangeBreeds(vals);
  };

  // Handler for age range slider change end
  const handleAgeChangeEnd = (valArr: number[]) => {
    const newRange: [number, number] = [valArr[0], valArr[1]];
    onChangeAgeRange(newRange);
  };

  // Handler for zip code input blur
  const handleZipBlur = () => {
    onChangeUserZip(tempZip.trim());
  };

  return (
    <Popover placement="bottom-start" closeOnBlur>
      <PopoverTrigger>
        <Button
          colorScheme="brand"
          leftIcon={
            <Icon
              as={IoFilter as React.ElementType}
              color="white"
              boxSize={5}
            />
          }
          rightIcon={<ChevronDownIcon boxSize={5} />}
        >
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent width="320px">
        <PopoverArrow />

        <PopoverHeader>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontWeight="bold" fontSize="lg">
              Filters
            </Text>
            <PopoverCloseButton position="static" />
          </Box>
        </PopoverHeader>

        <Divider />

        <PopoverBody maxH="480px" overflowY="auto" pb="2">
          <Accordion allowToggle>
            {/* Breed filter section */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    Breeds
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Input
                  placeholder="Search breeds..."
                  size="sm"
                  mb="2"
                  value={breedSearch}
                  onChange={(e) => setBreedSearch(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  mb="2"
                  onClick={() => onChangeBreeds([])}
                >
                  All Breeds
                </Button>

                <CheckboxGroup
                  colorScheme="brand"
                  value={selectedBreeds}
                  onChange={(vals) => handleBreedsChange(vals as string[])}
                >
                  <VStack align="start" spacing="1">
                    {filteredBreeds.length > 0 ? (
                      filteredBreeds.map((breed) => (
                        <Checkbox key={breed} value={breed}>
                          {breed}
                        </Checkbox>
                      ))
                    ) : (
                      <Text color="gray.500" fontSize="sm">
                        No breeds found.
                      </Text>
                    )}
                  </VStack>
                </CheckboxGroup>
              </AccordionPanel>
            </AccordionItem>

            {/* Age filter section */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    Age
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text fontSize="sm" mb="1">
                  {tempAgeRange[0]} – {tempAgeRange[1]} years
                </Text>
                <RangeSlider
                  min={minAge}
                  max={maxAge}
                  step={1}
                  value={tempAgeRange}
                  onChange={(val) => setTempAgeRange([val[0], val[1]])}
                  onChangeEnd={(val) => handleAgeChangeEnd(val)}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack bg="brand.400" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={4} bg="brand.500" />
                  <RangeSliderThumb index={1} boxSize={4} bg="brand.500" />
                </RangeSlider>
              </AccordionPanel>
            </AccordionItem>

            {/* State filter section */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    Location
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Input
                  placeholder="Search state (e.g. CA)"
                  size="sm"
                  mb="2"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                />

                {stateSearch.trim() !== "" && (
                  <Wrap spacing={2} mb={2}>
                    {filteredStates.length > 0 ? (
                      filteredStates.map(({ code, name }) => (
                        <Tag
                          key={code}
                          size="sm"
                          variant="subtle"
                          colorScheme="gray"
                          cursor="pointer"
                          onClick={() => {
                            onChangeStates([...selectedStates, code]);
                            setStateSearch("");
                          }}
                        >
                          {name} ({code})
                        </Tag>
                      ))
                    ) : (
                      <Text fontSize="sm" color="gray.500" px={2}>
                        No matches found
                      </Text>
                    )}
                  </Wrap>
                )}

                <Wrap spacing={2}>
                  {selectedStates.map((abbr) => (
                    <Tag
                      key={abbr}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="brand"
                    >
                      <TagLabel>{abbr}</TagLabel>
                      <TagCloseButton
                        onClick={() => {
                          onChangeStates(
                            selectedStates.filter((s) => s !== abbr)
                          );
                        }}
                      />
                    </Tag>
                  ))}
                </Wrap>
              </AccordionPanel>
            </AccordionItem>
            {/* Distance filter section */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    Distance
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text fontSize="sm" mb="1">
                  Zip Code
                </Text>
                <Input
                  placeholder="e.g. 53703"
                  size="sm"
                  mb="3"
                  value={tempZip}
                  onChange={(e) => setTempZip(e.target.value)}
                  onBlur={handleZipBlur}
                />

                <Text fontSize="sm" mb="2">
                  Radius
                </Text>
                <Wrap spacing={3}>
                  {[5, 50, 100, 500, 1000].map((km) => {
                    const meters = km * 1000;
                    const isActive = radiusMeters === meters;

                    return (
                      <Tag
                        key={km}
                        size="md"
                        variant={isActive ? "solid" : "subtle"}
                        colorScheme={isActive ? "brand" : "gray"}
                        cursor="pointer"
                        onClick={() => {
                          onChangeRadius(meters);
                        }}
                      >
                        {km} km
                      </Tag>
                    );
                  })}
                </Wrap>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
