import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing/LandingPage";
import TermsOfService from "./pages/terms/TermsOfService";
// Import the Nav component, will see what is best here, import it here or import it in the pages...
import Nav from "./components/Nav";
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
          {/* Define routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
