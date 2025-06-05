import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";

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
}

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
}) => {
  const [breedSearch, setBreedSearch] = useState<string>("");

  const [tempAgeRange, setTempAgeRange] = useState<[number, number]>(ageRange);

  const [tempZip, setTempZip] = useState<string>(userZip);
  const [tempRadius, setTempRadius] = useState<number>(radiusMeters);

  useEffect(() => {
    setTempAgeRange(ageRange);
  }, [ageRange]);

  useEffect(() => {
    setTempAgeRange(([prevMin, prevMax]) => {
      const newMin = prevMin < minAge ? minAge : prevMin;
      const newMax = prevMax > maxAge ? maxAge : prevMax;
      return [newMin, newMax];
    });
  }, [minAge, maxAge]);

  useEffect(() => {
    setTempZip(userZip);
    setTempRadius(radiusMeters);
  }, [userZip, radiusMeters]);

  const filteredBreeds = allBreeds.filter((b) =>
    b.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const handleBreedsChange = (vals: string[]) => {
    onChangeBreeds(vals);
  };

  const handleAgeChangeEnd = (valArr: number[]) => {
    const newRange: [number, number] = [valArr[0], valArr[1]];
    onChangeAgeRange(newRange);
  };

  const handleZipBlur = () => {
    onChangeUserZip(tempZip.trim());
  };

  const handleRadiusChangeEnd = (val: number) => {
    onChangeRadius(val);
  };

  return (
    <Popover placement="bottom-start" closeOnBlur>
      <PopoverTrigger>
        <Button colorScheme="brand" leftIcon={<Icon as={FaFilter as React.ElementType} color="white" />} rightIcon={<Box as="span" ml="2">▾</Box>}>
          Filters
          
        </Button>
      </PopoverTrigger>

      <PopoverContent width="320px">
        <PopoverArrow />
        <PopoverCloseButton />

        <PopoverHeader fontWeight="bold" fontSize="lg">
          Filters
        </PopoverHeader>

        <Divider />

        <PopoverBody maxH="480px" overflowY="auto" pb="2">
          <Accordion allowToggle>
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
                  focusBorderColor="accent.500"
                />

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

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    Age (years)
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text fontSize="sm" mb="1">
                  {tempAgeRange[0]} – {tempAgeRange[1]}
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
                    <RangeSliderFilledTrack bg="brand.500" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={4} bg="accent.500" />
                  <RangeSliderThumb index={1} boxSize={4} bg="accent.500" />
                </RangeSlider>
              </AccordionPanel>
            </AccordionItem>

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
                  focusBorderColor="accent.500"
                />

                <Text fontSize="sm" mb="1">
                  Radius (meters)
                </Text>
                <Box mb="1" fontSize="sm">
                  {tempRadius} m
                </Box>
                <RangeSlider
                  min={500}
                  max={50000}
                  step={500}
                  value={[tempRadius]}
                  onChange={(val) => setTempRadius(val[0])}
                  onChangeEnd={(val) => handleRadiusChangeEnd(val[0])}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack bg="brand.500" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={4} bg="accent.500" />
                </RangeSlider>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
