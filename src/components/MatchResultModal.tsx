import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Image,
  Text,
  VStack,
  Box,
  Flex,
  Heading,
  StackDivider,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Dog } from "../api";
import { MdLocationOn, MdCake, MdPets } from "react-icons/md";
import { useDogLocation } from "../hooks/useDogLocation";

/**
 * Props for the MatchResultModal component.
 * Displays the matched dog's details in a modal dialog.
 */
interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchDog: Dog | null;
}

/**
 * Modal component that shows the result of a dog match.
 * Displays dog image, name, breed, age, and location details.
 */
const MatchResultModal: React.FC<MatchResultModalProps> = ({
  isOpen,
  onClose,
  matchDog,
}) => {
  // Responsive modal size based on viewport
  const modalSize = useBreakpointValue({ base: "sm", md: "2xl", xl: "6xl" });

  // Get zip code from matched dog
  const zip = matchDog?.zip_code ? matchDog.zip_code : "";

  // Fetch location details for the matched dog
  const { location: dogLocation, loading } = useDogLocation(zip);

  // If no dog is matched, do not render the modal
  if (!matchDog) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize}>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <ModalContent
        borderRadius="2xl"
        overflow="hidden"
        position="relative"
        maxW={{ base: "90vw", md: "2xl", xl: "6xl" }}
      >
        <ModalCloseButton size="lg" top={4} right={4} color="gray.500" />
        <Flex direction={{ base: "column", md: "row" }} height="100%">
          {/* Dog image section */}
          <Box flex="1" height={{ base: "200px", md: "auto" }}>
            <Image
              src={matchDog.img}
              alt={matchDog.name}
              objectFit="cover"
              width="100%"
              height="100%"
              maxH={{ base: "40vh", md: "90vh" }}
            />
          </Box>

          {/* Dog details section */}
          <Flex direction="column" justify="center" p={{ base: 6, md: 10 }}>
            <Heading
              as="h2"
              mb={4}
              color="accent.500"
              fontSize={{ base: "2xl", md: "3xl" }}
              bgGradient="linear(to-r, purple.500, pink.300)"
              bgClip="text"
              letterSpacing="wide"
              textAlign="center"
            >
              🎉 {matchDog.name} 🎉
            </Heading>

            <VStack
              spacing={4}
              align="stretch"
              divider={<StackDivider borderColor="gray.200" />}
              mt={6}
            >
              {/* Breed info */}
              <Flex align="center">
                <Icon
                  as={MdPets as React.ElementType}
                  boxSize={6}
                  color="brand.400"
                  mr={3}
                />
                <Box>
                  <Text
                    fontSize="xs"
                    color="accent.500"
                    textTransform="uppercase"
                  >
                    Breed
                  </Text>
                  <Text fontSize="sm">{matchDog.breed}</Text>
                </Box>
              </Flex>
              {/* Age info */}
              <Flex align="center">
                <Icon
                  as={MdCake as React.ElementType}
                  boxSize={6}
                  color="brand.400"
                  mr={3}
                />
                <Box>
                  <Text
                    fontSize="xs"
                    color="accent.500"
                    textTransform="uppercase"
                  >
                    Age
                  </Text>
                  <Text fontSize="sm">
                    {matchDog.age} year{matchDog.age > 1 && "s"}
                  </Text>
                </Box>
              </Flex>
              {/* Location info */}
              <Flex align="center">
                <Icon
                  as={MdLocationOn as React.ElementType}
                  boxSize={6}
                  color="brand.400"
                  mr={3}
                />
                <Box>
                  <Text
                    fontSize="xs"
                    color="accent.500"
                    textTransform="uppercase"
                  >
                    Location
                  </Text>
                  {loading ? (
                    <Text fontSize="sm">Loading address…</Text>
                  ) : (
                    <Text fontSize="sm">
                      {dogLocation
                        ? `${dogLocation.city}, ${dogLocation.county}, ${dogLocation.state} ${dogLocation.zip_code}`
                        : matchDog.zip_code}
                    </Text>
                  )}
                </Box>
              </Flex>
            </VStack>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default MatchResultModal;
