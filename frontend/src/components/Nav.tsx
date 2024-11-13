import "./Nav.css";

import { LinkButton } from "./LinkButton.tsx";

import { Link, useNavigate } from "react-router-dom";

// Functional component for the navigation bar
export function Nav() {
  return (
    <nav className="header">
      {/* Link to the home page */}
      <Link to="/" className="link">
        <h1>Kode Kamp</h1>
      </Link>
      <div>
        {/* Link to the login page with a login icon */}
        <LinkButton to="/Sign-in">Sign in</LinkButton>
        <LinkButton to="/GamePage">Play</LinkButton>
      </div>
    </nav>
  );
}
