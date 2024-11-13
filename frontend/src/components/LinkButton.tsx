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
