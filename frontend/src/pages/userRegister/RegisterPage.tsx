import { FC } from "react";
import "./RegisterPage.css";
import Register from "../../components/Register";
import Nav from "../../components/Nav";

const RegisterPage: FC = () => {
  return (
    <div className="RegisterPage">

      <Nav />
      {/* Render the Register component */}
      <Register />
    </div>
  );
};

export default RegisterPage;
