/**
 * The ComponentView component renders a page with
 * examples of the components from the components folder.
 *
 * The page contains a Nav component, a Footer component,
 * a Button component, and an InputField component.
 *
 * The Button component is rendered with variant="primary" and
 * variant="secondary" to show the difference between the two
 * variants.
 *
 * The InputField component is rendered with a label and a value
 * that is updated when the user types something in the input field.
 *
 * @returns {JSX.Element} The ComponentView component.
 */
import { useState } from "react";
import { Button } from "../../components/Button.tsx";
import { Footer } from "../../components/Footer.tsx";
import { InputField } from "../../components/InputField.tsx";
import Nav from "../../components/Nav.tsx";
import "./ComponentView.css";

export default function ComponentView() {
  const [value, setValue] = useState("");

  return (
    <>
      <Nav />
      <div className="componentView">
        <Button onClick={() => {}} children="primary" variant="primary" />
        <Button onClick={() => {}} children="Secondary" variant="secondary" />

        <InputField
          value={value}
          label="Bingo Bango"
          onChange={setValue}
        />

        <Footer />
      </div>
    </>
  );
}

