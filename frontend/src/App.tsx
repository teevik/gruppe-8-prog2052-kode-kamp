import React, { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { VERIFY_ROUTE } from "../../shared/const";
import "./App.css";
import { LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from "./const";
import ComponentView from "./pages/component-view/ComponentView";
import { GameProps } from "./pages/game/GamePage";
import LandingPage from "./pages/landing/LandingPage";
import { MockModeExplanation } from "./pages/mode-explanation/ModeExplanation";
import ProfilePage from "./pages/profile/ProfilePage";
import ResultsPage, { ResultPageProps } from "./pages/results/ResultsPage";
import TermsOfService from "./pages/terms/TermsOfService";
import LoginPage from "./pages/userLogin/LoginPage";
import RegisterPage from "./pages/userRegister/RegisterPage";
import Verify from "./pages/verify/Verify";

const GamePage = lazy(() => import("./pages/game/GamePage"));

const ResultMockProps: ResultPageProps = {
  scoreboard: [
    {
      socket: {
        points: 10,
        userName: "Primeagen",
        emoji: "🐱",
        userID: "1",
        complete: true,
        registeredUser: false,
      },
      stats: {
        usedTime: 1000,
        executionTime: 2000,
      },
      solution: "console.log('Hello World');",
      results: {
        totalTests: 1,
        passedTests: 1,
        executionTimeUs: 1000,
        results: [
          {
            kind: "Success",
          },
        ],
      },
    },
    {
      stats: {
        usedTime: 234560,
        executionTime: 5000,
      },
      solution: "console.log('Goodbye World');",
      results: {
        totalTests: 1,
        passedTests: 1,
        executionTimeUs: 1000,
        results: [
          {
            kind: "Success",
          },
        ],
      },
      socket: {
        points: 10,
        userName: "Jon Gjengset",
        emoji: "😀",
        userID: "2",
        complete: false,
        registeredUser: false,
      },
    },
  ],
  gameMode: "Test Gamemode",
  initialTimer: 60,
  gameIsOver: true,
  player: {
    points: 10,
    registeredUser: true,
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
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/mode-explanation" element={<MockModeExplanation />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Define routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
          <Route path={PROFILE_ROUTE} element={<ProfilePage />} />
          <Route path={VERIFY_ROUTE} element={<Verify />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
