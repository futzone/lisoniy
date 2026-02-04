import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
