import { Link } from "react-router-dom";
import "./Nav.css";

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
        <Link to="/Sign-in" className="link">
          <button>Sign in</button>
        </Link>
        <Link to="/GamePage" className="link">
          <button>Play</button>
        </Link>
      </div>
    </nav>
  );
};

