/**
 * A functional component that renders a "404 Page Not Found" message.
 *
 * The component renders a "Layout" component with the "not-found" class and
 * shows the navigation bar and footer. It also renders a heading with the
 * message "404 Page Not Found" and a link to the home page.
 */
import { Link } from "react-router-dom";
import { Layout } from "./Layout";
import "./NotFound.css";

/**
 * The NotFound component.
 *
 * @returns {JSX.Element} The NotFound component.
 */
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

