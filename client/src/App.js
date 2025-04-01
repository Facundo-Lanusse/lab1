import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Login from "./pages/LogIn";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/admin" element={<Admin />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/logIn" element={<Login />} />
            <Route path="/Home" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
