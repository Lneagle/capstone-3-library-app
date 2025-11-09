import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
	const { token } = useContext(AuthContext);

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;