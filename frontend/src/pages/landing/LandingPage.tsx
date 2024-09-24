import React from "react";
import "./LandingPage.css"; // Ensure this path is correct
import Nav from "../../components/Nav";

const LandingPage: React.FC = () => {
  return (
    <div className="landingPage">
        <Nav />
        <div className="centered-content">
          <h2 className="speed-coding-btn">Speed Coding (?)</h2>
          <p>Waiting for more players</p>
          <div className="landingUserLobby">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="landingPlayerSlot">
                <span role="img" aria-label="Player icon">🧑</span>
              </div>
            ))}
          </div>
        </div>
        <footer>
          <div className="landingUserInfo">
              <span role="img" aria-label="Guest icon">🧑</span>
              <p>Guest29032</p>
          </div>
        </footer>
    </div>
  );
};

export default LandingPage;
