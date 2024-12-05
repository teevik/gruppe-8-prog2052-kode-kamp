import { FC } from "react";
import Login from "../../components/Login"; 
import "./LoginPage.css";
import Nav from "../../components/Nav";

/**
 * The LoginPage component renders a page with a navigation bar and a login form.
 * The login form is rendered using the Login component.
 * The page is used to log in to the application.
 */
const LoginPage: FC = () => {
    return (
        <div className="loginPage">
            
            {/* Render the navigation bar */}
            <Nav />
            {/* Render the login component */}
            <Login />
        </div>
    );
};



export default LoginPage;
