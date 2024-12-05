/**
 * The Layout component is a wrapper for the main content of the page.
 * It contains a <Nav> component at the top and a <Footer> component at the bottom.
 * The main content is passed as children to the component.
 *
 * @param {LayoutProps} props
 * @param {boolean} props.showNav - Whether to show the navigation bar.
 * @param {boolean} props.showFooter - Whether to show the footer.
 * @param {React.ReactNode} props.children - The main content of the page.
 * @param {string} [props.className] - Additional CSS classes to add to the main content.
 */
import classNames from "classnames";
import { Footer } from "./Footer";
import "./Layout.css";
import Nav from "./Nav";

interface LayoutProps {
  showNav?: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Layout(props: LayoutProps) {
  return (
    <div className="layout">
      {/* Display the navigation bar if showNav is true. */}
      {props.showNav && <Nav />}

      {/* Add additional CSS classes to the main content if className is provided. */}
      <main className={classNames("main-kodekamp", props.className)}>
        {/* Render the main content. */}
        {props.children}
      </main>

      {/* Display the footer if showFooter is true. */}
      {props.showFooter && <Footer />}
    </div>
  );
}


