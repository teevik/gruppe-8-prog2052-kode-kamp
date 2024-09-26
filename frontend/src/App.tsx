import React from "react";
import "./App.css";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import GamePage from "./pages/game/GamePage";
import ResultsPage from "./pages/results/ResultsPage";
// Import the Nav component, will see what is best here, import it here or import it in the pages...
// import Nav from "./components/Nav"; 

const App: React.FC = () => {
  return (

    <Router>
      {/* Nav component will be present on all routes */}
      <Nav />
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/GamePage" element={<GamePage />} /> */}
        <Route path="/ResultsPage" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
