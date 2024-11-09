import { Link } from "react-router-dom";
import { FC } from "react";

// Functional component for the navigation bar
const Nav: FC = () => {
  return (
    <nav className="header">
      {/* Link to the home page */}
      <Link to="/" className="link">
        <h1>Kode Kamp</h1>
      </Link>
      <div>
        {/* Link to the login page with a login icon */}
        <Link to="/LoginPage" className="link">
          <button>Sign in</button>
        </Link>

        {/* Link to the register page with a register icon */}
        <Link to="/RegisterPage" className="link">
          <button>Register</button>
        </Link>

        <Link to="/GamePage" className="link">
          <button>Play</button>
        </Link>

      </div>
    </nav>
  );
};

export default Nav;
