import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing/LandingPage";
import TermsOfService from "./pages/terms/TermsOfService";
import { MockModeExplanation } from "./pages/mode-explanation/ModeExplanation";
import ComponentView from "./pages/component-view/ComponentView";
import GamePage from "./pages/game/GamePage";

// Import the Nav component, will see what is best here, import it here or import it in the pages...
import { Nav } from "./components/Nav";
import LoginPage from "./pages/userLogin/LoginPage";
import RegisterPage from "./pages/userRegister/RegisterPage";
import { REGISTER_ROUTE, LOGIN_ROUTE } from "./const";
import type { User } from "../../shared/types";
import { isUserLoggedIn } from "./user";

const App: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const user: User | null = isUserLoggedIn();
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <>
      <Router>
        {/* Nav component will be present on all routes */}
        <Nav user={user} />
        <Routes>
          {/* mock routes */}
          <Route path="/component-view" element={<ComponentView />} />
          <Route
            path="/game-page"
            element={
              <GamePage
                challenge={{
                  title: "Challenge 1",
                  license: "MIT",
                  attribution: [{ name: "Author", url: "https://example.com" }],
                  description: "Description",
                  input: "input",
                  output: "output",
                  template: "template",
                  sampleTests: [
                    { input: ["sampleinput"], output: ["sampleoutput"] },
                  ],
                  tests: [{ input: ["input"], output: ["output"] }],
                }}
                gameMode={"First to Finish"}
                gameTime={360}
                player={undefined}
              />
            }
          />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/mode-explanation" element={<MockModeExplanation />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Define routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
