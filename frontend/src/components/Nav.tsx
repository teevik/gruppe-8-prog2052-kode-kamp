import "./Nav.css";

import { LinkButton } from "./LinkButton.tsx";

import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../const";
import { useAuth } from "../user";
import { Button } from "./Button.tsx";
import { VERIFY_ROUTE } from "../../../shared/const.ts";

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
          <div className="column">
            <p>
              {user.username} {user.email}
            </p>
            {!user.verified && (
              <p>
                You are not verified.
                <Link to={VERIFY_ROUTE} className="link">
                  verify
                </Link>
              </p>
            )}
          </div>
        )}

        {user && <Button onClick={logOut}>Log out</Button>}
      </div>
    </nav>
  );
}
