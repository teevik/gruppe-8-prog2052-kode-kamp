import { Link } from "react-router-dom";
import { Layout } from "./Layout";

export function NotFound() {
  return (
    <Layout className="not-found" showNav showFooter>
      <h1>404 Page Not Found</h1>

      <Link to="/" className="button primary">
        Home to Kodekamp
      </Link>
    </Layout>
  );
}
