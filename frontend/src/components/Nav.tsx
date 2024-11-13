import "./Nav.css";

import { LinkButton } from "./LinkButton.tsx";

import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../const";
import type { User } from "../../../shared/types";

interface NavProps {
  user: User | undefined;
}
// Functional component for the navigation bar
export function Nav({ user }: NavProps) {
  return (
    <nav className="header">
      {/* Link to the home page */}
      <h1>
        <Link to="/" className="link">
          Kode Kamp
        </Link>
      </h1>
      <div className="buttonArray">
        {!user && (
          <>
            <LinkButton to={LOGIN_ROUTE}>Sign in</LinkButton>
            <LinkButton to={REGISTER_ROUTE}>Register</LinkButton>
          </>
        )}
        {user && (
          <p>
            {user.username} {user.email}
          </p>
        )}
        <LinkButton to="/GamePage">Play</LinkButton>
      </div>
    </nav>
  );
}
