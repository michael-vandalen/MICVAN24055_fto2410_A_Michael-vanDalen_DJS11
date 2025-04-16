import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <NavLink to="/about">About</NavLink>
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
