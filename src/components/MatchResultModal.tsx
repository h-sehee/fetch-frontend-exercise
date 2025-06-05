import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
  VStack,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { Dog } from "../api";
import { match } from "assert";
import { CloseIcon } from "@chakra-ui/icons";

interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchDog: Dog | null;
}

const MatchResultModal: React.FC<MatchResultModalProps> = ({
  isOpen,
  onClose,
  matchDog,
}) => {
  if (!matchDog) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">🎉 Your Matched Dog! 🎉</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Image
              src={matchDog.img}
              alt={matchDog.name}
              borderRadius="md"
              boxSize="200px"
              objectFit="cover"
            />
            <Box textAlign="left">
              <Text>
                <strong>Name:</strong> {matchDog.name}
              </Text>
              <Text>
                <strong>Breed:</strong> {matchDog.breed}
              </Text>
              <Text>
                <strong>Age:</strong> {matchDog.age} year
                {matchDog.age > 1 && "s"}
              </Text>
              <Text>
                <strong>Zip Code:</strong> {matchDog.zip_code}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchResultModal;
