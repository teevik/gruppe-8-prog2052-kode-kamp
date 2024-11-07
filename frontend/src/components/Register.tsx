import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordcheck, setPasswordcheck] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const onButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent form submission (default behavior)
        setEmailError("");
        setUsernameError("");
        setPasswordError("");
        setPasswordcheck("");

        // Email validation
        if (email === "") {
            setEmailError("Please enter your email");
            return;
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        // Username validation
        if (username === "") {
            setUsernameError("Please enter a username");
            return;
        }

        // Password validation
        if (password === "") {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 8) {
            setPasswordError("Password must be 8 characters or longer");
            return;
        }

        if (password !== passwordcheck) {
            setPasswordError("Passwords do not match");
            return;
        }

        // If all validations pass, proceed
        alert("Form submitted successfully!");
    };

    return (
        <div className="RegisterPageBox">
            <h2>Register</h2>
            <form>
                {/* Email field */}
                <div className="userBox">
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter email address here"
                        onChange={(e) => setEmail(e.target.value)}
                        className="userBox"
                    />
                    <label className="errorLabel">{emailError}</label>
                </div>

                {/* Username field */}
                <div className="userBox">
                    <input
                        type="text"
                        value={username}
                        placeholder="Enter username here"
                        onChange={(e) => setUsername(e.target.value)}
                        className="userBox"
                    />
                    <label className="errorLabel">{usernameError}</label>
                </div>

                {/* Password field */}
                <div className="userBox">
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter password here"
                        onChange={(e) => setPassword(e.target.value)}
                        className="userBox"
                    />
                    <label className="errorLabel">{passwordError}</label>
                </div>

                {/* Confirm password field */}
                <div className="userBox">
                    <input
                        type="password"
                        value={passwordcheck}
                        placeholder="Confirm password here"
                        onChange={(e) => setPasswordcheck(e.target.value)}
                        className="userBox"
                    />
                    <label className="errorLabel">{passwordError}</label>
                </div>

                {/* Submit button */}
                <button onClick={onButtonClick} className="inputButton">
                    Submit
                </button>

                <h2>Already a user?</h2>

                <Link to="/LoginPage">
                    <button>Login</button>
                </Link>

            </form>
        </div>
    );
}

export default Register;