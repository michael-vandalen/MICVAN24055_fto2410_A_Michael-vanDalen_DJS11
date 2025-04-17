import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchBar from "../utils/SearchBar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenuOpen(false); // Close hamburger on navigation
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header--content">
        <Link to="/" className="header--logo">
          #LOOP
        </Link>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <div className="nav--header-left">
            <NavLink to="/podcasts">Podcasts</NavLink>
            <NavLink to="/favourites">Favourites</NavLink>
          </div>
          <div className="nav--header-right">
            <SearchBar />
          </div>
        </nav>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
