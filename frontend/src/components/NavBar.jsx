import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">Search Books</NavLink>
      <NavLink to="/have-read">Books I Have Read</NavLink>
      <NavLink to="/want-to-read">Books I Want To Read</NavLink>
    </nav>
  );
}

export default NavBar;