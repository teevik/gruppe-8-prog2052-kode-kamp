import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";

import TermsOfService from "./pages/terms/TermsOfService";
// Import the Nav component, will see what is best here, import it here or import it in the pages...
import Nav from "./components/Nav";
import LoginPage from "./pages/userLogin/LoginPage";
import RegisterPage from "./pages/userRegister/RegisterPage";

const App: React.FC = () => {
  return (
    <>
      <Router>
        {/* Nav component will be present on all routes */}
        <Nav />
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
