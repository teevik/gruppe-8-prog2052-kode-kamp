import { FC } from "react";
import "./TermsOfService.css"; // Ensure this path is correct
import Footer from "../../components/Footer"; // Adjust this import based on your file structure

const TermsOfService: FC = () => {
  return (
    <div className="termsOfServicePage">
      <header>
        <h1>Terms of Service</h1>
      </header>
      <main>
        <p>
          By using this application, you acknowledge that the code you write
          here is available for everyone to see and use. The code you write
          is not considered "yours" and may be accessed by other users of the
          platform.
        </p>
        <p>
          Please ensure that you do not include any private or sensitive
          information in your code.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
