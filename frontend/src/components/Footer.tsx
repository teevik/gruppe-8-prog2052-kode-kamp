import TermsOfService from "../pages/terms/TermsOfService";
import "./Footer.css";

/**
 * Footer component that displays the footer section of the page.
 * It includes the copyright information and the Terms of Service component.
 */
export function Footer() {
  return (
    <footer>
      {/* Display copyright information */}
      <p>© 2024 Kodekamp, Inc. All rights reserved.</p>
      {/* Include the Terms of Service component */}
      <TermsOfService />
    </footer>
  );
}

