/**
 * The main application component. This is the entry point for the app.
 * It renders a BrowserRouter component from react-router-dom, which
 * provides client-side routing for the app.
 *
 * The app is divided into routes, which are defined below. The routes
 * are grouped into two categories: "mock routes" and "real routes". The
 * mock routes are only available in development mode (i.e. when
 * `import.meta.env.DEV` is true). They are used to mock out pages that
 * are not yet implemented.
 *
 * The real routes are available in all environments, and define the
 * actual pages that the user can visit.
 *
 * The Nav component is present on all routes, and is used to render
 * the navigation bar.
 */
import React, { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { VERIFY_ROUTE } from "../../shared/const";
import "./App.css";
import { NotFound } from "./components/NotFound";
import { LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from "./const";
import LandingPage from "./pages/landing/LandingPage";
import ProfilePage from "./pages/profile/ProfilePage";
import TermsOfService from "./pages/terms/TermsOfService";
import LoginPage from "./pages/userLogin/LoginPage";
import RegisterPage from "./pages/userRegister/RegisterPage";
import Verify from "./pages/verify/Verify";

/**
 * Mock pages for development (lazy loaded)
 */
const GamePageMock = lazy(() => import("./pages/game/mock/GamePageMock"));
const ComponentView = lazy(
  () => import("./pages/component-view/ComponentView")
);
const ResultsPageMock = lazy(
  () => import("./pages/results/mock/ResultsPageMock")
);
const MockModeExplanation = lazy(
  () => import("./pages/mode-explanation/mock/ModeExplanationMock")
);

/**
 * The main application component
 */
const App: React.FC = () => {
  return (
    <>
      <Router>
        {/* Nav component will be present on all routes */}
        <Routes>
          {/* Mock routes in DEV only */}
          {import.meta.env.DEV && (
            <>
              <Route path="/component-view" element={<ComponentView />} />
              <Route path="/game-page" element={<GamePageMock />} />
              <Route path="/results-page" element={<ResultsPageMock />}></Route>
              <Route path="/landing-page" element={<LandingPage />} />
              <Route
                path="/mode-explanation"
                element={<MockModeExplanation />}
              />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </>
          )}

          {/* Define routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
          <Route path={PROFILE_ROUTE} element={<ProfilePage />} />
          <Route path={VERIFY_ROUTE} element={<Verify />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;


