import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AddRemoveFaculty from './components/admin_profile/AddRemoveFaculty';
import Add from './components/admin_profile/Add';
import RegulationForm from './components/admin_profile/Regulation';
import SearchFaculty from './components/admin_profile/SearchFaculty';
import SearchStudents from './components/admin_profile/SearchStudents';
import StudentLogin from './components/admin_profile/StudentLogin.jsx';
import TeacherLogin from './components/admin_profile/TeacherLogIn.jsx';
import Teacherprofile from './components/admin_profile/Teacherprofile.jsx';
import StudentProfile from './components/admin_profile/StudentProfile';
import Profile from './components/admin_profile/Profile.jsx';
import EditMaterial from './components/admin_profile/EditMaterial';
import UploadPdf from './components/admin_profile/UploadPdf';
import UpdateTeach from './components/admin_profile/UpdateTeach.jsx';
import Editmaterialedit from './components/admin_profile/Editmaterialedit';
import Documents from './components/admin_profile/students_profile/Documents';
import Signup from './components/admin_profile/students_profile/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><NavBar /><HomePage /></>} />
        <Route path="/universities" element={<><NavBar /><Universities /></>} />
        <Route path="/courses" element={<><NavBar /><Courses /></>} />
        <Route path="/community" element={<><NavBar /><Community /></>} />
        <Route path="/news" element={<><NavBar /><News /></>} />
        <Route path="/about" element={<><NavBar /><About /></>} />
        <Route path="/login" element={<><NavBar /><Login /></>} />

        {/* Login pages */}
        <Route path="/student-login" element={<><NavBar /><StudentLogin /></>} />
        <Route path="/teacher-login" element={<><NavBar /><TeacherLogin /></>} />

        {/* Profiles */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/teacher-profile" element={<Teacherprofile />} />
        <Route path="/student-profile" element={<StudentProfile />} />

        {/* Admin dashboard with nested routes */}
        <Route
          path="/dashboard"
          element={
            <>
              <AdminNavBar />
              <AdminDashboard />
            
            </>
          }
        >
          <Route path="add-remove-faculty" element={<AddRemoveFaculty />} />
          <Route path="add-remove-student" element={<Add />} />
          <Route path="view-faculty-student" element={<SearchFaculty />} />
          <Route path="regulation" element={<RegulationForm />} />
        </Route>

        {/* Extra features */}
        <Route path="/update-teach" element={<UpdateTeach />} />
        <Route path="/edit-material" element={<EditMaterial />} />
        <Route path="/upload-pdf" element={<UploadPdf />} />

        <Route path="/documents" element={<Documents />} />
         <Route path='/signup' element={<Signup/>}/>
         <Route path='/Student-login' element={<StudentLogin/>}/>

      </Routes>
 
    
    </Router>
  );
};

export default App;
