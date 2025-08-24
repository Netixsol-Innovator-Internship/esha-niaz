import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { isAuthenticated } from "../../../redux/slices/auth/authSlice"

const PublicRoute = ({ children }) => {
    const authenticated = useSelector(isAuthenticated)

    if (authenticated) {
        return <Navigate to="/" replace />
    }

    return children
}

export default PublicRoute