import { FC } from "react";
import "./RegisterPage.css";
import Register from "../../components/Register";

const RegisterPage: FC = () => {
  return (
    <div className="RegisterPage">
      {/* Render the Register component */}
      <Register />
    </div>
  );
};

export default RegisterPage;
