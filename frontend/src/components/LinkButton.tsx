/**
 * The LinkButton component renders a button with a link to a given route.
 *
 * This component is a wrapper around the react-router-dom Link component.
 * It adds a class to the Link component based on the variant property.
 * The variant property can be one of the following: primary, secondary, tertiary.
 *
 * @param {LinkButtonProps} props - The properties for the component.
 * @param {ReactNode} props.children - The content of the button.
 * @param {string} props.to - The route to link to.
 * @param {string} [props.variant=primary] - The variant of the button.
 * @returns {JSX.Element} The LinkButton component.
 */
import { Link } from "react-router-dom";
import "./Button.css";

import { ReactNode } from "react";

interface LinkButtonProps {
  children: ReactNode;
  to: string;
  variant?: "primary" | "secondary" | "tertiary";
}

export function LinkButton(props: LinkButtonProps) {
  const { variant = "primary", children, to } = props;

  return (
    <Link className={`button ${variant}`} to={to}>
      {children}
    </Link>
  );
}


