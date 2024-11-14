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

        <InputField value={value} label="Bingo Bango" onChange={setValue} />

        <Footer />
      </div>
    </>
  );
}
