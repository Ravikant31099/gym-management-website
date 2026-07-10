import { Navigate } from 'react-router-dom';
import { isAuthenticated } from "../../util/AuthUtils";
import { hasAnyRole } from "../../util/RoleUtils";

export default function ProtectedRoute({children, allowedRoles = []}) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        return <Navigate to="/admin" replace />;
    }
    return children;
}