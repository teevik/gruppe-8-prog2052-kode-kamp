import React from "react";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="LandingPage">
      <header className="LandingPage-header">
        <div className="logo">Kode Kamp</div>
        <button className="signin-btn">Sign in</button>
      </header>

      <main>
        <div className="centered-content">
          <button className="speed-coding-btn">Speed Coding (?)</button>
          <p>Waiting for more players</p>
          <div className="players-grid">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="player-slot">
                <span role="img" aria-label="Player icon">🧑</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <div className="guest-info">
          <span role="img" aria-label="Guest icon">🧑</span>
          <p>Guest29032</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
