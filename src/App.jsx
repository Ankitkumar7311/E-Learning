import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/admin_profile/NavBar';
import AdminNavBar from './components/admin_profile/AdminNavBar';
import AdminDashboard from './components/admin_profile/AdminDashboard';
import HomePage from './components/admin_profile/HomePage';
import Courses from './components/admin_profile/Courses';
import Universities from './components/admin_profile/Universities';
import Community from './components/admin_profile/Community';
import News from './components/admin_profile/News';
import About from './components/admin_profile/About';
import Login from './components/admin_profile/Login';
import StudentLogin from './components/admin_profile/StudentLogin';
import TeacherLogin from './components/admin_profile/TeacherLogIn';
import Profile from './components/admin_profile/Profile';
import Teacherprofile from './components/admin_profile/Teacherprofile';
import StudentProfile from './components/admin_profile/StudentProfile';
import AddRemoveFaculty from './components/admin_profile/AddRemoveFaculty';
import Add from './components/admin_profile/Add';
import RegulationForm from './components/admin_profile/Regulation';
import SearchFaculty from './components/admin_profile/SearchFaculty';
import Documents from './components/students_profile/Documents';
import Signup from './components/students_profile/Signup';
import EditMaterial from './components/admin_profile/EditMaterial';
import UploadPdf from './components/admin_profile/UploadPdf';
import UpdateTeach from './components/admin_profile/UpdateTeach';

import RequestReport from './components/admin_profile/RequestReport';
import AcadamicCalender from './components/students_profile/AcadamicCalender';

const PublicLayout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
        <Route path="/universities" element={<PublicLayout><Universities /></PublicLayout>} />
        <Route path="/community" element={<PublicLayout><Community /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/student-login" element={<PublicLayout><StudentLogin /></PublicLayout>} />
        <Route path="/teacher-login" element={<PublicLayout><TeacherLogin /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />

        {/* Profile Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/teacher-profile" element={<Teacherprofile />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/documents" element={<Documents />} />

        {/* Admin Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<><AdminNavBar /><AdminDashboard /></>}>
          <Route path="add-remove-faculty" element={<AddRemoveFaculty />} />
          <Route path="add-remove-student" element={<Add />} />
          <Route path="view-faculty-student" element={<SearchFaculty />} />
          <Route path="regulation" element={<RegulationForm />} />
        </Route>

        {/* Extra Features */}
        <Route path="/update-teach" element={<UpdateTeach />} />
        <Route path="/edit-material" element={<EditMaterial />} />
        <Route path="/upload-pdf" element={<UploadPdf />} />

        {/* 404 */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path='/request-report' element={<RequestReport/>} />
        
      </Routes>
     <AcadamicCalender/>
    </Router>
  );
};

export default App;
