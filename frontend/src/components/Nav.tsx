import "./Nav.css";

import { LinkButton } from "./LinkButton.tsx";

import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE, PROFILE_ROUTE } from "../const";
import { useAuth } from "../user";
import { Button } from "./Button.tsx";

// Functional component for the navigation bar
export default function Nav() {
  const { user, logOut } = useAuth();

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
          <Link className="profileInfo" to={PROFILE_ROUTE}>
            <img
              src="/profile.svg"
              className="profileIcon"
              alt="Profile icon"
            ></img>
            {user.username}
          </Link>
        )}

        {user && <Button onClick={logOut}>Log out</Button>}
      </div>
    </nav>
  );
}
