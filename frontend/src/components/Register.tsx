import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

import { ACCESS_TOKEN } from "../../../shared/const";

import { MIN_PASSWORD_LENGTH } from "../../../shared/const";
import { LOGIN_ROUTE } from "../const";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordcheck, setPasswordcheck] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const register = trpc.auth.register.useMutation();

  const navigate = useNavigate();

  async function submitRegistration() {
    try {
      const res = await register.mutateAsync({
        username: username,
        password: password,
        email: email,
      });

      setServerErrorMessage("");

      if (res) {
        localStorage.setItem(ACCESS_TOKEN, res);
        navigate("/");
      }
    } catch (err: any) {
      if (err.data.httpStatus == 500) {
        setServerErrorMessage("Noe skjedde gærent på tjeneren");
      } else if (err.data.httpStatus == 409) {
        setServerErrorMessage("Brukernavn opptatt");
      }
    }
  }

  const onButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission (default behavior)
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setPasswordcheck("");
    const [errorType, message, valid] = registerInputValidation(
      username,
      email,
      password,
      passwordcheck
    );

    if (valid) {
      submitRegistration();
    } else {
      switch (errorType) {
        case "password":
          setPasswordError(message);
          break;
        case "username":
          setUsernameError(message);
          break;
        case "email":
          setEmailError(message);
          break;
        default:
          break;
      }
    }
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
            required
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
            required
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
            required
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
            required
          />
          <label className="errorLabel">{passwordError}</label>
        </div>

        <p className="errorLabel">{serverErrorMessage}</p>
        <button onClick={onButtonClick} className="inputButton">
          Submit
        </button>

        <h2>Already a user?</h2>

        <Link to={LOGIN_ROUTE}>
          <button>Login</button>
        </Link>
      </form>
    </div>
  );
}
export function registerInputValidation(
  username: string,
  email: string,
  password: string,
  passwordcheck: string
): [string, string, boolean] {
  // Email validation
  if (email === "") {
    return ["email", "Please enter your email", false];
  }

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return ["email", "Please enter a valid email address", false];
  }

  // Username validation
  if (username === "") {
    return ["username", "Please enter a username", false];
  }

  // Password validation
  if (password === "") {
    return ["password", "Please enter a password", false];
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return [
      "password",
      `Password must be ${MIN_PASSWORD_LENGTH} characters or longer`,
      false,
    ];
  }

  if (password !== passwordcheck) {
    return ["password", "Passwords do not match", false];
  }

  // If all validations pass
  return ["success", "", true];
}

export default Register;
