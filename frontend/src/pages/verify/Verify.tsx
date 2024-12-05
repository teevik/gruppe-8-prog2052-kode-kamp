import { Layout } from "../../components/Layout";
import { LinkButton } from "../../components/LinkButton";
import "./Verify.css";

/**
 * The Verify component renders a page that informs the user that a verification email has been sent.
 * The page also provides a link to return to the homepage.
 */
export default function Verify() {
  return (
    <Layout
      showFooter
      showNav
      /**
       * We add the "verify" class to the layout component in order to
       * style the page differently from the other pages.
       */
      className="verify"
    >
      <h1>Verify your email</h1>
      <p>
        {/* We let the user know that we have sent a verification email and that they should check their spam as well. */}
        We have sent you a verification email, please check your spam as well.
      </p>
      <div className="row">
        <p>Already verified?</p>
        {/* We provide a link to return to the homepage. */}
        <LinkButton to="/">Return to homepage</LinkButton>
      </div>
    </Layout>
  );
}
