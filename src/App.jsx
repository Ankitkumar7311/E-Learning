import React from 'react';
import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';
import NavBar from './components/admin_profile/NavBar';
import HomePage from './components/admin_profile/HomePage';
import Courses from './components/admin_profile/Courses';
import Universities from './components/admin_profile/Universities';
import Community from './components/admin_profile/Community';
import News from './components/admin_profile/News';
import About from './components/admin_profile/About';
import Login from './components/admin_profile/Login';
import AdminNavBar from './components/admin_profile/AdminNavBar';
import AdminDashboard from './components/admin_profile/AdminDashboard';
import SearchFaculty from './components/admin_profile/SearchFaculty';
import TeacherTable from './components/admin_profile/TeacherTable';
import Profile from './components/admin_profile/Profile';
import Add from './components/admin_profile/Add';
import RegulationForm from './components/admin_profile/Regulation';
import AddRemoveFaculty from './components/admin_profile/AddRemoveFaculty';
import Teacherprofile from './components/admin_profile/Teacherprofile';
import StudentProfile from './components/admin_profile/StudentProfile';


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
      <Add/>
      <AddRemoveFaculty/>
      <RegulationForm/>
      <Teacherprofile/>
      <StudentProfile/>

    </Router>
    
  );
};

export default App;
