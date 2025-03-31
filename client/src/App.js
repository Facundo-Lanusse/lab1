import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Admin from "./Admin";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
  );
}

export default App;
