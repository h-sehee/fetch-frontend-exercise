import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRoute;