import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Icon,
  Image,
} from "@chakra-ui/react";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";
import { FaPaw } from "react-icons/fa";
import loginPageImage from "../assets/side-view-dog-woman-hand-shaking-park.jpg";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(name.trim(), email.trim());
      setIsLoggedIn(true);
      navigate("/search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" overflow="hidden">
      <Flex flex={{base:"1", md: "0.5"}} align="center" justify="center">
        <Box maxW={{ base: "90vw", md: "30vw"}} minW={{ base: "100%", md: "400px" }} w="100%" p="8">
          <VStack spacing="6" align="stretch">
            <Heading
              as="h2"
              size="2xl"
              textAlign="center"
              color="accent.500"
              mb="8"
            >
              <Icon as={FaPaw as React.ElementType} mr="3" />
              PawFetch
            </Heading>

            <Box as="form" onSubmit={handleLogin}>
              <VStack spacing="4" align="stretch">
                <FormControl id="name" isRequired>
                  <FormLabel color="darkBrand.500">Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    _focus={{ borderColor: "accent.500" }}
                  />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel color="darkBrand.500">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    _focus={{ borderColor: "accent.500" }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  bg="accent.500"
                  color="darkBrand.500"
                  width="full"
                  mt="4"
                  isLoading={loading}
                  loadingText="Logging in..."
                  _hover={{ bg: "accent.600" }}
                >
                  Login
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Flex>

      <Box flex={{base:"0", md:"1"}} display={{ base: "none", md: "block" }}>
        <Image
          src = {loginPageImage}
          alt="Dog Background"
          objectFit="cover"
          w="100%"
          h="100%"
          objectPosition="60% center"
        />
      </Box>
    </Flex>
  );
};

export default Login;