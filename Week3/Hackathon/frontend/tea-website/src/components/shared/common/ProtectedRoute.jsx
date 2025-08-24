import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser, getToken } from "../../../redux/slices/auth/authSlice";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const user = useSelector(getUser);
    const token = useSelector(getToken);

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if allowedRoles provided
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // redirect unauthorized users
    }

    return children;
};

export default ProtectedRoute;