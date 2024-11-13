import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { trpc } from "./trpc";
import LandingPage from "./pages/landing/LandingPage";
import TermsOfService from "./pages/terms/TermsOfService";
import { MockModeExplanation } from "./pages/mode-explanation/ModeExplanation";
import ComponentView from "./pages/component-view/ComponentView";
import GamePage from "./pages/game/GamePage";

// Import the Nav component, will see what is best here, import it here or import it in the pages...
// import Nav from "./components/Nav";

const App: React.FC = () => {
  const ping = trpc.ping.useQuery();
  console.log(ping.data);

  return (
    <>
      <Router>
        {/* Nav component will be present on all routes */}
        {/* <Nav /> */}
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<LandingPage />} />

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
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/mode-explanation" element={<MockModeExplanation />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
