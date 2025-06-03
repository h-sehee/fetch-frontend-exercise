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
} from "@chakra-ui/react";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
  name?: string;
  email?: string;
  general?: string;
}

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
    <Flex align="center" justify="center" minH="100vh" bg="gray.50" px="4">
      <Box
        bg="white"
        p="8"
        rounded="md"
        shadow="md"
        w={{ base: "100%", sm: "400px" }}
      >
        <VStack spacing="6" align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            🐶 Dog Matcher
          </Heading>

          <Box as="form" onSubmit={handleLogin}>
            <VStack spacing="4" align="stretch">
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                mt="4"
                isLoading={loading}
                loadingText="Logging in..."
              >
                Login
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
