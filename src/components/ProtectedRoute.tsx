import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";
import { Flex, Spinner } from "@chakra-ui/react";

/**
 * ProtectedRoute component restricts access to authenticated users only.
 * If not logged in, redirects to the login page.
 * Shows a loading indicator while authentication status is being determined.
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    // Show spinner while checking authentication
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="accent.500" />
      </Flex>
    );
  }

  if (!isLoggedIn) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" replace />;
  }

  // Render protected content for authenticated users
  return children;
};

export default ProtectedRoute;
