import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

function NavBar() {
	const context = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		context.logout();
		navigate('/login');
	}
	
	return (
		<nav className="navbar">
			<NavLink to="/">Search Books</NavLink>|
			<NavLink to="/have-read">Books I Have Read</NavLink>|
			<NavLink to="/want-to-read">Books I Want To Read</NavLink>
			<a className="logout" onClick={handleLogout}>Logout</a>
		</nav>
	);
}

export default NavBar;