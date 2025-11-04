import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">Search Books</NavLink>
      <NavLink to="/have_read">Books I Have Read</NavLink>
      <NavLink to="/want_to_read">Books I Want To Read</NavLink>
    </nav>
  );
}

export default NavBar;