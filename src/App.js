import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import ShowCase from "./components/ShowCase";
import Cuadro from "./components/Cuadro";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Cuadro />} />

          <Route path="/showcase" element={<ShowCase />} />
          <Route path="/cuadro" element={<Cuadro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
