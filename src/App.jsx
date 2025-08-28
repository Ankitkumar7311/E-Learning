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
import AdminNavBar from './components/AdminNavBar';
import AdminDashboard from './components/AdminDashboard';
import SearchFaculty from './components/SearchFaculty';
import TeacherTable from './components/TeacherTable';
import Profile from './components/teacherprofile/Profile';


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
      
      <AdminNavBar/>
      <AdminDashboard/>
      <SearchFaculty/>
      <TeacherTable/>
      <Profile/>
    </Router>
    
  );
};

export default App;
