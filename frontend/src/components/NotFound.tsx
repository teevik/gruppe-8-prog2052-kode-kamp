import { Link, useNavigate } from "react-router-dom";

export function NotFound() {
  const navigator = useNavigate();
  return (
    <div className="not-found">
      <h1>404 Page Not Found</h1>
      <Link to="/" className="button primary">
        Home to Kodekamp
      </Link>
    </div>
  );
}
