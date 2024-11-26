import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MIN_PASSWORD_LENGTH } from "../../../shared/const";
import { useAuth } from "../auth";
import { REGISTER_ROUTE } from "../const";
import { trpc } from "../trpc";
import { PasswordInput } from "./PasswordInput";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const navigate = useNavigate();
  const login = trpc.auth.login.useMutation();
  const { user, setToken } = useAuth();

  const [viewPassword, setViewPassword] = useState<boolean>(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const onButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission (default behavior)
    setUsernameError("");
    setPasswordError("");

    const validation: LoginValidation = loginInputValidation(
      username,
      password
    );
    if (validation.valid) {
      submitLogin();
    } else {
      if (validation.type == "user") {
        setUsernameError(validation.message);
      } else if (validation.type == "password") {
        setPasswordError(validation.message);
      }
    }
  };

  async function submitLogin() {
    try {
      const res = await login.mutateAsync({
        user: username,
        password: password,
      });

      setServerErrorMessage("");
      if (res) {
        setToken(res);

        navigate("/");
      }
    } catch (err: any) {
      if (err.data.httpStatus == 500) {
        setServerErrorMessage("Oops. Something went wrong. Try again later.");
      } else if (err.data.httpStatus == 401) {
        setServerErrorMessage("Incorrect username/email or password");
      }
    }
  }

  return (
    <div className="loginPageBox">
      <h2>Sign in</h2>
      <form>
        {/* Username field */}
        <div className="userBox">
          <label htmlFor="user">Username or email:</label>
          <input
            name="user"
            type="text"
            value={username}
            placeholder="Username or email"
            onChange={(e) => setUsername(e.target.value)}
            className="userBox"
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

        {/* Submit button */}
        <p className="errorLabel">{serverErrorMessage}</p>
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
      message: "Enter username or email here",
      valid: false,
    };
  }

  // Password validation
  if (password === "") {
    return { type: "password", message: "Enter password here", valid: false };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      type: "password",
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      valid: false,
    };
  }

  return {
    type: "",
    valid: true,
  };
}

export default Login;
