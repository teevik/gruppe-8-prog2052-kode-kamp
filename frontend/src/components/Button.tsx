/**
 * The Button component renders a button with a custom style based on the variant property.
 * The variant property can be one of the following: primary, secondary, tertiary, danger.
 * The component also accepts a children property which is the content of the button.
 * The onClick property is a function that will be called when the button is clicked.
 *
 * The component uses the Button.css file for styling.
 */
import "./Button.css";
import { ReactNode } from "react";

/**
 * Properties for the Button component.
 */
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  disabled?: boolean;
}

/**
 * The Button component.
 * @param props The properties for the component.
 * @returns The Button component.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", onClick, children, disabled } = props;

  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

