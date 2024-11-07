import { FC } from "react";
import Login from "../../components/Login"; // Adjust the path if your Login component is in a different folder
import "./LoginPage.css";

const LoginPage: FC = () => {
    return (
        <div className="loginPage">

            {/* Render the Login component */}
            <Login />
        </div>
    );
};

export default LoginPage;
