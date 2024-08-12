import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.js";
import LandingPage from "./pages/LandingPage.js";
import MealGeneration from "./pages/MealGeneration";
import Profile from "./pages/Profile.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";
import Groceries from "./pages/Groceries.js";

const App = () => {
  // TODO: Secure routes: must be authenticated before moving on else login again
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/generate-meals" element={<MealGeneration />} />
        <Route path="/generate-groceries" element={<Groceries />} />
      </Routes>
    </Router>
  );
};

export default App;
