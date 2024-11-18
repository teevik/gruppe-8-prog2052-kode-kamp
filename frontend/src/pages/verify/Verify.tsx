import { useNavigate } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Verify your email</h1>
      <p>
        We have sent you a verification email, please check your spam as well.
      </p>
      <p>Verified?</p>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Return to homepage
      </button>
    </>
  );
}
