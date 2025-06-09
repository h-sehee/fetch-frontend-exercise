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
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";
import { FaPaw } from "react-icons/fa";
import loginPageImage from "../assets/side-view-dog-woman-hand-shaking-park.jpg";

/**
 * Login page component.
 * Renders a login form and handles user authentication.
 * On successful login, navigates to the search page.
 */
const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { setIsLoggedIn } = useAuth();

  /**
   * Handles the login form submission.
   * Calls the login API and updates authentication state.
   * Shows error toast if login fails.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Attempt login with trimmed name and email
      await login(name.trim(), email.trim());
      setIsLoggedIn(true);
      // Redirect to search page after successful login
      navigate("/search");
    } catch (err) {
      // Show error message if login fails
      toast({
        title: "Login failed",
        description:
          err instanceof Error ? err.message : "An unknown error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Login form section */}
      <Flex flex={{ base: "1", md: "0.5" }} align="center" justify="center">
        <Box
          maxW={{ base: "90vw", md: "30vw" }}
          minW={{ base: "100%", md: "400px" }}
          w="100%"
          p="8"
        >
          <VStack spacing="6" align="stretch">
            {/* App logo and title */}
            <Heading
              as="h2"
              size="2xl"
              textAlign="center"
              color="brand.500"
              mb="8"
            >
              <Icon
                aria-label="Paw icon"
                as={FaPaw as React.ElementType}
                mr="3"
              />
              PawFetch
            </Heading>

            {/* Login form */}
            <Box as="form" onSubmit={handleLogin}>
              <VStack spacing="4" align="stretch">
                {/* Name input */}
                <FormControl id="name" isRequired>
                  <FormLabel color="darkBrand.500">Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                {/* Email input */}
                <FormControl id="email" isRequired>
                  <FormLabel color="darkBrand.500">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                {/* Submit button */}
                <Button
                  type="submit"
                  isDisabled={!name.trim() || !email.trim()}
                  bg="brand.500"
                  color="darkBrand.500"
                  width="full"
                  mt="4"
                  isLoading={loading}
                  loadingText="Logging in..."
                  _hover={
                    !(!name.trim() || !email.trim())
                      ? { bg: "brand.600" }
                      : { bg: "brand.500" }
                  }
                >
                  Login
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Flex>

      {/* Side image section (hidden on mobile) */}
      <Box
        flex={{ base: "0", md: "1" }}
        display={{ base: "none", md: "block" }}
      >
        <Image
          src={loginPageImage}
          alt="Dog Background"
          objectFit="cover"
          w="100%"
          h="100%"
          objectPosition="60% center"
        />
        {/* Image attribution */}
        <Text
          position="absolute"
          bottom="2"
          right="4"
          fontSize="xs"
          color="gray.400"
          px="2"
          py="1"
        >
          <Link
            href="https://www.freepik.com/free-photo/side-view-dog-woman-hand-shaking-park_3865307.htm#fromView=image_search_similar&page=1&position=4&uuid=a29df7f9-ae24-41d2-a122-c45f6ea4c991&query=dog+shaking+hand+with+woman"
            target="_blank"
            rel="noopener noreferrer"
          >
            Image by freepik
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
