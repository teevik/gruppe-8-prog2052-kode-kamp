import "./Nav.css";

import { LinkButton } from "./LinkButton.tsx";

import { Link } from "react-router-dom";
import { VERIFY_ROUTE } from "../../../shared/const.ts";
import { useAuth } from "../auth.tsx";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../const";
import { Button } from "./Button.tsx";

// Functional component for the navigation bar
export default function Nav() {
  const { user, logOut, isVerified } = useAuth();

  return (
    <nav className="header">
      <div className="container">
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
            <>
              {!isVerified && (
                <div className="column">
                  <p>
                    You are not verified!{" "}
                    <Link to={VERIFY_ROUTE} className="link">
                      Verify.
                    </Link>
                  </p>
                </div>
              )}

              <div className="column">
                <p>{user.username}</p>
              </div>
            </>
          )}

          {user && <Button onClick={logOut}>Log out</Button>}
        </div>
      </div>
    </nav>
  );
}
