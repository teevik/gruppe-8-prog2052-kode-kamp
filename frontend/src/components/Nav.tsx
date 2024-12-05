/**
 * The Nav component renders a navigation bar at the top of the page.
 * The component shows different buttons based on the user's authentication status.
 * If the user is not logged in, the component shows "Sign in" and "Register" buttons.
 * If the user is logged in, the component shows a button for logging out, as well as
 * a link to the user's profile page.
 * If the user is not verified, the component shows a message with a link to the
 * verification page.
 */
import { Link } from "react-router-dom";
import { VERIFY_ROUTE } from "../../../shared/const.ts";
import { useAuth } from "../auth";
import { LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from "../const";
import { Button } from "./Button.tsx";
import { LinkButton } from "./LinkButton.tsx";
import "./Nav.css";

export default function Nav() {
  const { user, logOut, isVerified } = useAuth();

  return (
    <nav className="header">
      <div className="container">
        {/* Link to the home page */}
        <h1>
          <Link to="/" className="link">
            KodeKamp
          </Link>
        </h1>
        <div className="buttonArray">
          {/* If the user is not logged in, show "Sign in" and "Register" buttons */}
          {!user && (
            <>
              <LinkButton to={LOGIN_ROUTE}>Sign in</LinkButton>
              <LinkButton to={REGISTER_ROUTE}>Register</LinkButton>
            </>
          )}
          {/* If the user is logged in, show a button for logging out and a link to the user's profile page */}
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

              <Link className="profileInfo" to={PROFILE_ROUTE}>
                <img
                  src="/profile.svg"
                  className="profileIcon"
                  alt="Profile icon"
                ></img>
                {user.username}
              </Link>
            </>
          )}

          {/* If the user is logged in, show a button for logging out */}
          {user && <Button onClick={logOut}>Log out</Button>}
        </div>
      </div>
    </nav>
  );
}

