import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import GamePage from "./pages/game/GamePage";
// Import the Nav component, will see what is best here, import it here or import it in the pages...
// import Nav from "./components/Nav"; 

const App: React.FC = () => {
  return (
    <Router>
      {/* Nav component will be present on all routes */}
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/GamePage" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
