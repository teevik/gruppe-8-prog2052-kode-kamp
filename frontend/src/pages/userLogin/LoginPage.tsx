import { FC } from "react";
import Login from "../../components/Login"; // Adjust the path if your Login component is in a different folder
import "./LoginPage.css";
import Nav from "../../components/Nav";

const LoginPage: FC = () => {
    return (
        <div className="loginPage">
            
            <Nav />
            {/* Render the Login component */}
            <Login />
        </div>
    );
};

export default LoginPage;
