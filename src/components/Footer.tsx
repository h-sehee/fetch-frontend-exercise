import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box
          as="footer"
          mt="auto"
          py="4"
          px="8"
          borderTop="1px solid"
          borderColor="gray.200"
          bg="#300d3811"
          textAlign="center"
        >
          <Text fontSize="sm" color="darkBrand.500">
            © 2025 PawFetch. All rights reserved.
          </Text>
        </Box>
  );
};

export default Footer;