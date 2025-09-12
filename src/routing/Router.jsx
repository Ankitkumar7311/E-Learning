import { createBrowserRouter, Outlet } from "react-router-dom";
import NavBar from "../components/navbars/NavBar";
import AdminNavBar from "../components/navbars/AdminNavBar";
import TeacherNavBar from "../components/navbars/TeacherNavbar";
import StudentNavBar from "../components/navbars/StudentNavBar";

// Admin components
import AdminDashboard from "../components/admin_profile/AdminDashboard";
import HomePage from "../components/admin_profile/HomePage";
import Courses from "../components/admin_profile/Courses";
import Universities from "../components/admin_profile/Universities";
import Community from "../components/admin_profile/Community";
import News from "../components/admin_profile/News";
import About from "../components/admin_profile/About";
import Login from "../components/admin_profile/Login";
import Teacherprofile from "../components/admin_profile/Teacherprofile";
import StudentProfile from "../components/admin_profile/StudentProfile";
import AddRemoveFaculty from "../components/admin_profile/AddRemoveFaculty";
import Add from "../components/admin_profile/Add";
import RegulationForm from "../components/admin_profile/Regulation";
import SearchFaculty from "../components/admin_profile/SearchFaculty";
import EditMaterial from "../components/admin_profile/EditMaterial";
import UploadPdf from "../components/upload/UploadPdf";
import UpdateTeach from "../components/admin_profile/UpdateTeach";
import RequestReport from "../components/admin_profile/RequestReport";

// Auth
import StudentLogin from "../components/admin_profile/StudentLogin";
import TeacherLogin from "../components/admin_profile/TeacherLogIn";
import Signup from "../components/students_profile/Signup";

// Teacher components
import Profile from "../components/teacher_profile/Profile";

// Student components
import Documents from "../components/students_profile/Documents";
import StudentSection from "../components/students_profile/StudentSection";
import UpdateStudent from "../components/admin_profile/UpdateStudent";
import AcadamicCalender from "../components/students_profile/AcadamicCalender";
import Encapsulation from "../components/students_profile/Encapsulation";

// Layouts
const PublicLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

const AdminLayout = () => (
  <>
    <AdminNavBar />
    <Outlet />
  </>
);

const TeacherLayout = () => (
  <>
    <TeacherNavBar />
    <Outlet />
  </>
);

const StudentLayout = () => (
  <>
    <StudentNavBar />
    <Outlet />
  </>
);

const routes = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <Courses /> },
      { path: "universities", element: <Universities /> },
      { path: "community", element: <Community /> },
      { path: "news", element: <News /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "student-login", element: <StudentLogin /> },
      { path: "teacher-login", element: <TeacherLogin /> },
      { path: "signup", element: <Signup /> },
    ],
  },

  // Admin Dashboard with nested routes
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />, // main dashboard page
      },
      {
        path: "",
        element: <AdminDashboard />, // wrap Quick Actions + Outlet
        children: [
          { path: "add-remove-faculty", element: <AddRemoveFaculty /> },
          { path: "add-remove-student", element: <Add /> },
          { path: "view-faculty-student", element: <SearchFaculty /> },
          { path: "regulation", element: <RegulationForm /> },
        ],
      },
    ],
  },
  { path: "teacher-profile", element: <Teacherprofile /> },
  { path: "student-profile", element: <StudentProfile /> },

  // Teacher routes (with TeacherNavBar)
  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [{ index: true, element: <Teacherprofile /> }],
  },
  { path: "update-profile-teacher", element: <UpdateTeach /> },

  // Student routes (with StudentNavBar)
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentProfile /> },
      { path: "student-dashboard", element: <StudentSection /> },
      { path: "documents", element: <Documents /> },
      { path: "academic-calendar", element: <AcadamicCalender /> },
      { path: "subjects/encapsulation", element: <Encapsulation /> },
      // { path: "faculty-qb", element: <FacultyQB /> },
      // { path: "request-question", element: <RequestQuestion /> },
      // { path: "announcements", element: <Announcements /> },
    ],
  },
  { path: "update-profile-student", element: <UpdateStudent /> },

  // Standalone profile (outside student/teacher)
  { path: "/profile", element: <Profile /> },

  // Extra features
  { path: "/update-teach", element: <UpdateTeach /> },
  { path: "/edit-material", element: <EditMaterial /> },
  { path: "/upload-pdf", element: <UploadPdf /> },
  { path: "/request-report", element: <RequestReport /> },

  // 404
  { path: "*", element: <h1>Page Not Found</h1> },
]);

export default routes;
