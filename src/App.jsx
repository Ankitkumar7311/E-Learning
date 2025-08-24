import React from 'react';
import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Courses from './components/Courses';
import Universities from './components/Universities';
import Community from './components/Community';
import News from './components/News';
import About from './components/About';
import Login from './components/Login';
import Formss from './components/Form';

const App = () => {
  return (
    <Router>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/community" element={<Community />} />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router>
    
  );
};

export default App;
