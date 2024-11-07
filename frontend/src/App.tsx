import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { trpc } from "./trpc";
import LandingPage from "./pages/landing/LandingPage";
import TermsOfService from "./pages/terms/TermsOfService";
import { MockModeExplanation } from "./pages/modeExplanation/ModeExplanation";
import ComponentView from "./pages/ComponentView/ComponentView";

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
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/mode-explanation" element={<MockModeExplanation />} />
          <Route path="/component-view" element={<ComponentView />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
