import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

import { ACCESS_TOKEN } from "../../../shared/const";

import { MIN_PASSWORD_LENGTH } from "../../../shared/const";

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
    // else {
    //   console.log("Not res");
    //   if (register.error?.data?.httpStatus == 409) {
    //     serServerErrorMessage("Username already taken");
    //   } else if (register.error?.data?.httpStatus == 500) {
    //     serServerErrorMessage(
    //       "Oops something went wrong. Please try again later."
    //     );
    //   } else if (register.error?.data?.httpStatus == 400) {
    //     serServerErrorMessage("Bad request. Make sure your input is correct");
    //   }
    // }
  }

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

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Password must be ${MIN_PASSWORD_LENGTH} characters or longer`
      );
      return;
    }

    if (password !== passwordcheck) {
      setPasswordError("Passwords do not match");
      return;
    }

    // If all validations pass, proceed
    submitRegistration();
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

        <p className="errorLabel">{serverErrorMessage}</p>
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
