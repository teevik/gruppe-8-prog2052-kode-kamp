import { FC } from "react";
import "./RegisterPage.css";
import Register from "../../components/Register";
import Nav from "../../components/Nav";

/**
 * RegisterPage is a functional component that renders the Register component.
 * It is used on the "Register" page.
 *
 * @returns {JSX.Element} The RegisterPage component.
 */
const RegisterPage: FC = () => {
  return (
    <div className="RegisterPage">
      {/* Render the Nav component */}
      <Nav />
      {/* Render the Register component */}
      <Register />
    </div>
  );
};

export default RegisterPage;
