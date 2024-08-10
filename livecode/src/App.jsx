import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import HomePage from './pages/HomePage';
import './App.css';
import Navbar from './Components/Navbar';


function App() {
  return (
    <>
    <Navbar></Navbar>
    <Router>
      
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/session/:id" element={<EditorPage />} />
    </Routes>
  </Router>
    </>
);
}

export default App;
