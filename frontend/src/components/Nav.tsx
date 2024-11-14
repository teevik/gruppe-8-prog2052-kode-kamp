import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../const";
import type { User } from "../../../shared/types";

interface NavProps {
  user: User | undefined;
}
// Functional component for the navigation bar
export default function Nav({ user }: NavProps) {
  return (
    <nav className="header">
      {/* Link to the home page */}
      <Link to="/" className="link">
        <h1>Kode Kamp</h1>
      </Link>
      <div>
        {/* Link to the login page with a login icon */}
        {!user && (
          <>
            <Link to={LOGIN_ROUTE} className="link">
              <button>Sign in</button>
            </Link>

            {/* Link to the register page with a register icon */}
            <Link to={REGISTER_ROUTE} className="link">
              <button>Register</button>
            </Link>
          </>
        )}
        {user && (
          <p>
            {user.username} {user.email}
          </p>
        )}

        {/* <Link to="/GamePage" className="link">
          <button>Play</button>
        </Link> */}
      </div>
    </nav>
  );
}
