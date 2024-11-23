import { Layout } from "../../components/Layout";
import { LinkButton } from "../../components/LinkButton";
import "./Verify.css";

export default function Verify() {
  return (
    <Layout showFooter showNav className="verify">
      <h1>Verify your email</h1>
      <p>
        We have sent you a verification email, please check your spam as well.
      </p>

      <div className="row">
        <p>Already verified?</p>
        <LinkButton to="/">Return to homepage</LinkButton>
      </div>
    </Layout>
  );
}
