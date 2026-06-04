import {Navigate} from 'react-router-dom';
import {isAuthenticated} from "../../util/AuthUtils";

export default function ProtectedRoute({children}) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}