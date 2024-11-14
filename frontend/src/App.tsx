import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ComponentView from "./pages/component-view/ComponentView";
import GamePage, { GameProps } from "./pages/game/GamePage";
import LandingPage from "./pages/landing/LandingPage";
import { MockModeExplanation } from "./pages/mode-explanation/ModeExplanation";
import TermsOfService from "./pages/terms/TermsOfService";

// Import the Nav component, will see what is best here, import it here or import it in the pages...
import type { User } from "../../shared/types";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "./const";
import ResultsPage, { ResultPageProps } from "./pages/results/ResultsPage";
import LoginPage from "./pages/userLogin/LoginPage";
import RegisterPage from "./pages/userRegister/RegisterPage";
import { isUserLoggedIn } from "./user";

const ResultMockProps: ResultPageProps = {
  scoreboard: [
    {
      socket: {
        userName: "Primeagen",
        emoji: "🐱",
        userID: "1",
        complete: true,
      },
      stats: {
        usedTime: 1000,
        executionTime: 2000,
      },
      solution: "console.log('Hello World');",
    },
    {
      socket: {
        userName: "Jon Gjengset",
        emoji: "😀",
        userID: "2",
        complete: false,
      },
      stats: {
        usedTime: 234560,
        executionTime: 5000,
      },
      solution: "console.log('Goodbye World');",
    },
  ],
  gameMode: "Test Gamemode",
  initialTimer: 60,
  gameIsOver: true,
  player: {
    userName: "MEGGG",
    emoji: "😡",
    userID: "3",
    complete: true,
  },
};

const GamePageMockProps: GameProps = {
  challenge: {
    title: "Challenge 1",
    license: "MIT",
    attribution: [{ name: "Author", url: "https://example.com" }],
    description: "Description",
    input: "input",
    output: "output",
    template: "template",
    sampleTests: [{ input: ["sampleinput"], output: ["sampleoutput"] }],
    tests: [{ input: ["input"], output: ["output"] }],
  },
  gameMode: "First to Finish",
  gameTime: 360,
  player: undefined,
};

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
        <Routes>
          {/* mock routes */}
          <Route path="/component-view" element={<ComponentView />} />
          <Route
            path="/game-page"
            element={<GamePage {...GamePageMockProps} />}
          />
          <Route
            path="/results-page"
            element={<ResultsPage {...ResultMockProps}></ResultsPage>}
          ></Route>
          <Route path="/landing-page" element={<LandingPage user={user} />} />
          <Route path="/mode-explanation" element={<MockModeExplanation />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Define routes */}
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
