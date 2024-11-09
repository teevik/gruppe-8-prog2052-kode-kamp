import { useState } from "react";
import { Link } from "react-router-dom";
import { REGISTER_ROUTE } from "../const";
import { MIN_PASSWORD_LENGTH } from "../../../shared/const";

function Login() {
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission (default behavior)
    setUsernameError("");
    setPasswordError("");

    const validation: LoginValidation = loginInputValidation(user, password);
    if (validation.valid) {
      alert("Logger inn");
    } else {
      if (validation.type == "user") {
        setUsernameError(validation.message);
      } else if (validation.type == "password") {
        setPasswordError(validation.message);
      }
    }
  };

  return (
    <div className="loginPageBox">
      <h2>Bruker innlogging</h2>
      <form>
        {/* Username field */}
        <div className="userBox">
          <input
            type="text"
            value={user}
            placeholder="Enter user here"
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

        {/* Submit button */}
        <button onClick={onButtonClick} className="inputButton">
          Submit
        </button>

        <h2>New user?</h2>

        <Link to={REGISTER_ROUTE}>
          <button>Register</button>
        </Link>
      </form>
    </div>
  );
}

export type LoginValidation =
  | {
      type: "user";
      message: string;
      valid: boolean;
    }
  | {
      type: "password";
      message: string;
      valid: boolean;
    }
  | { type: ""; valid: boolean };

export function loginInputValidation(
  user: string,
  password: string
): LoginValidation {
  // Username validation
  if (user === "") {
    return {
      type: "user",
      message: "Skriv inn brukerinformasjon",
      valid: false,
    };
  }

  // Password validation
  if (password === "") {
    return { type: "password", message: "Skriv inn passord", valid: false };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      type: "password",
      message: `Passordet må minst være ${MIN_PASSWORD_LENGTH} tegn`,
      valid: false,
    };
  }

  return {
    type: "",
    valid: true,
  };
}

export default Login;
