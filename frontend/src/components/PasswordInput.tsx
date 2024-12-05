/**
 * Properties for the PasswordInput component.
 */
interface PasswordInputProps {
  password: string;
  setPassword: (pwd: string) => void;
  viewPassword: boolean;
  setViewPassword: (state: boolean) => void;
  passwordError: string;
  labelText: string;
}

/**
 * A React component that renders an input field for a password.
 * The component displays a label, an input field for the password, and a button to toggle the visibility of the password.
 * The component also displays an error message if the password is invalid.
 */
export function PasswordInput({
  password,
  setPassword,
  viewPassword,
  setViewPassword,
  passwordError,
  labelText,
}: PasswordInputProps) {
  return (
    <div className="userBox">
      <label htmlFor="password">{labelText}</label>
      <div className="row">
        <input
          type={viewPassword ? "text" : "password"}
          value={password}
          placeholder="Enter password here"
          onChange={(e) => setPassword(e.target.value)}
          className="userBox"
          required
          name="password"
        />
        <button
          className="icon-button secondary"
          onClick={(e) => {
            e.preventDefault();
            setViewPassword(!viewPassword);
          }}
        >
          <img
            src={viewPassword ? "/unsee_password.svg" : "see_password.svg"}
            alt={viewPassword ? "Hide password" : "View password"}
          ></img>
        </button>
      </div>
      <label className="errorLabel">{passwordError}</label>
    </div>
  );
}

