import { useEffect, useState } from "react";
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
  Spinner,
  GridItem,
  Grid,
  Image,
  usePrefersReducedMotion,
  chakra
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const prefersReducedMotion = usePrefersReducedMotion();

  // const aurora = keyframes`
  //     0% { background-position: 50% 60%; }
  //     50% { background-position: 50% 40%; }
  //     100% { background-position: 50% 60%; }
  //   `;
  
  //   const flicker = keyframes`
  //     0%, 100% { filter: brightness(1); }
  //     50%      { filter: brightness(1.2); }
  //   `;
  
  //   const animation = prefersReducedMotion
  //     ? undefined
  //     : `${aurora} 20s ease infinite, ${flicker} 5s ease-in-out infinite`;

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
    <chakra.div
          w="100vw"
          h="100vh"
          overflow="hidden"
          bgGradient="linear(to-r, #300d38, #fba919, #300d38)"
          bgSize="200% 200%"
          //animation={animation}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="rgba(255, 255, 255, 0.15)"
            backdropFilter="saturate(180%) blur(10px)"
            border="1px solid rgba(48, 13, 56, 0.4)"
            borderRadius="lg"
            p="8"
            maxW="400px"
            w="90%"
            boxShadow="lg"
          >
            <VStack spacing="6" align="stretch">
              <Heading
                as="h2"
                size="2xl"
                textAlign="center"
                color="#fba919"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.6)"
              >
                🐾 Dog Matcher
              </Heading>
              <Box as="form" onSubmit={handleLogin}>
                <VStack spacing="4" align="stretch">
                  <FormControl id="name" isRequired>
                    <FormLabel color="white" fontSize="sm">
                      Name
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      bg="rgba(255, 255, 255, 0.8)"
                      _focus={{
                        borderColor: "#fba919",
                        boxShadow: "0 0 0 1px #fba919",
                      }}
                    />
                  </FormControl>
                  <FormControl id="email" isRequired>
                    <FormLabel color="white" fontSize="sm">
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="rgba(255, 255, 255, 0.8)"
                      _focus={{
                        borderColor: "#fba919",
                        boxShadow: "0 0 0 1px #fba919",
                      }}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    bg="#fba919"
                    color="#300d38"
                    width="full"
                    mt="4"
                    isLoading={loading}
                    loadingText="Logging in..."
                    _hover={{
                      bg: "#e19916",
                      transform: "scale(1.02)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      bg: "#d48f14",
                      transform: "scale(0.98)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Login
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </chakra.div>
    // <Box position="relative" minH="100vh" minW="100vw" overflow="hidden">
    //   <Grid
    //     position="absolute"
    //     top="0"
    //     left="0"
    //     w="100%"
    //     h="100%"
    //     templateColumns="repeat(10, 1fr)"
    //     templateRows="repeat(3, 1fr)"
    //   >
    //     {bgImages.map((src, idx) => (
    //       <GridItem key={idx} w="100%" h="100%">
    //         <Image
    //           src={src}
    //           alt={`Dog background ${idx}`}
    //           objectFit="cover"
    //           w="100%"
    //           h="100%"
    //           filter="brightness(70%)"
    //         />
    //       </GridItem>
    //     ))}
    //   </Grid>
    //   <Box
    //     position="absolute"
    //     top="0"
    //     left="0"
    //     right="0"
    //     bottom="0"
    //     bg="rgba(0, 0, 0, 0.5)"
    //     zIndex={0}
    //   />
    //   <Flex
    //     align="center"
    //     justify="center"
    //     minH="100vh"
    //     minW="100vW"
    //     position="relative"
    //     zIndex={1}
    //   >
    //     <Box
    //       bg="rgba(0, 0, 0, 0.55)"
    //       p="8"
    //       rounded="md"
    //       shadow="lg"
    //       w={{ base: "90%", sm: "400px" }}
    //     >
    //       <VStack spacing="6" align="stretch">
    //         <Heading as="h2" size="lg" textAlign="center" color="teal.700">
    //           🐶 Dog Matcher
    //         </Heading>

    //         <Box as="form" onSubmit={handleLogin}>
    //           <VStack spacing="4" align="stretch">
    //             <FormControl id="name" isRequired>
    //               <FormLabel color="white">Name</FormLabel>
    //               <Input
    //                 type="text"
    //                 placeholder="Your Name"
    //                 value={name}
    //                 onChange={(e) => setName(e.target.value)}
    //                 _focus={{ borderColor: "teal.300" }}
    //                 color="white"
    //               />
    //             </FormControl>

    //             <FormControl id="email" isRequired>
    //               <FormLabel color="white">Email</FormLabel>
    //               <Input
    //                 type="email"
    //                 placeholder="you@example.com"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 _focus={{ borderColor: "teal.300" }}
    //                 color="white"
    //               />
    //             </FormControl>

    //             <Button
    //               type="submit"
    //               colorScheme="teal"
    //               width="full"
    //               mt="4"
    //               isLoading={loading}
    //               loadingText="Logging in..."
    //             >
    //               Login
    //             </Button>
    //           </VStack>
    //         </Box>
    //       </VStack>
    //     </Box>
    //   </Flex>
    // </Box>
  );
};

export default Login;
