import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

function NavBar() {
	const context = useContext(AuthContext);

	const handleLogout = () => {
		context.logout();
	}
	
  return (
    <nav className="navbar">
      <NavLink to="/">Search Books</NavLink>
      <NavLink to="/have-read">Books I Have Read</NavLink>
      <NavLink to="/want-to-read">Books I Want To Read</NavLink>
			<button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default NavBar;