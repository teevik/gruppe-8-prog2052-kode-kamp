import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

import { MIN_PASSWORD_LENGTH, VERIFY_ROUTE } from "../../../shared/const";
import { useAuth } from "../auth";
import { LOGIN_ROUTE } from "../const";
import { LinkButton } from "./LinkButton";
import { PasswordInput } from "./PasswordInput";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordcheck, setPasswordcheck] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [viewPasswordCheck, setViewPasswordCheck] = useState<boolean>(false);
  const register = trpc.auth.register.useMutation();
  const { user, setToken } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  async function submitRegistration() {
    try {
      const res = await register.mutateAsync({
        username: username,
        password: password,
        email: email,
      });

      setServerErrorMessage("");

      if (res) {
        setToken(res);
        navigate(VERIFY_ROUTE);
      }
    } catch (err: any) {
      if (err.data.httpStatus == 500) {
        setServerErrorMessage("Oops. Something went wrong. Try again later.");
      } else if (err.data.httpStatus == 409) {
        setServerErrorMessage("Username already taken or email already in use");
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
      passwordcheck,
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
          <label htmlFor="username">Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email address here"
            onChange={(e) => setEmail(e.target.value)}
            className="userBox"
            required
            name="email"
          />
          <label className="errorLabel">{emailError}</label>
        </div>

        {/* Username field */}
        <div className="userBox">
          <label htmlFor="username">Create your username:</label>
          <input
            type="text"
            value={username}
            placeholder="Enter username here"
            onChange={(e) => setUsername(e.target.value)}
            className="userBox"
            required
            name="username"
          />
          <label className="errorLabel">{usernameError}</label>
        </div>

        {/* Password field */}
        <PasswordInput
          password={password}
          setPassword={setPassword}
          viewPassword={viewPassword}
          setViewPassword={setViewPassword}
          passwordError={passwordError}
          labelText="Password:"
        />

        {/* Confirm password field */}
        <PasswordInput
          password={passwordcheck}
          setPassword={setPasswordcheck}
          viewPassword={viewPasswordCheck}
          setViewPassword={setViewPasswordCheck}
          passwordError={passwordError}
          labelText="Confirm password:"
        />

        <p className="errorLabel">{serverErrorMessage}</p>
        <button onClick={onButtonClick} className="inputButton">
          Submit
        </button>

        <h2>Already a user?</h2>

        <LinkButton variant="secondary" to={LOGIN_ROUTE}>
          Login
        </LinkButton>
      </form>
    </div>
  );
}
export function registerInputValidation(
  username: string,
  email: string,
  password: string,
  passwordcheck: string,
): [string, string, boolean] {
  // Email validation
  if (email === "") {
    return ["email", "Please enter your email", false];
  }

  // From https://emailregex.com/index.html
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    )
  ) {
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
