import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  Spinner,
  Field,
  Fieldset,
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
  const [errors, setErrors] = useState<FormErrors>({});
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      await login(name.trim(), email.trim());
      setIsLoggedIn(true);
      navigate("/search");
    } catch (err) {
      setErrors({ general: "Login failed. Please check your credentials." });
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
        <VStack align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            🐶 Dog Matcher
          </Heading>

          <Box as="form" onSubmit={handleLogin}>
            <Fieldset.Root size="lg" required>
              <Fieldset.Content>
                <Field.Root id="name" required>
                  <Field.Label>
                    Name
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Field.Root>
                <Field.Root id="email" required>
                  <Field.Label>
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Field.Root>
              </Fieldset.Content>
              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                mt="4"
                loading={loading}
                loadingText="Logging in..."
              >
                Login
              </Button>
              <Fieldset.ErrorText></Fieldset.ErrorText>
            </Fieldset.Root>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
