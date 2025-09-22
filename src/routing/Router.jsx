import { createBrowserRouter, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import NavBar from "../pages/NavBar";
import AdminNavBar from "../modules/admin/AdminNavBar";
import TeacherNavBar from "../modules/faculty/TeacherNavBar";
import StudentNavBar from "../modules/student/StudentNavBar";

import AdminDashboard from "../layouts/AdminDashboard";
import HomePage from "../pages/HomePage";
import Courses from "../pages/Courses";
import Universities from "../pages/Universities";
import Community from "../pages/Community";
import News from "../pages/News";
import About from "../pages/About";
import Login from "../auth/Login";
import Teacherprofile from "../modules/admin/Teacherprofile";
import StudentProfile from "../modules/admin/StudentProfile";
import AddRemoveFaculty from "../modules/admin/AddRemoveFaculty";
import Add from "../modules/admin/Add";
import RegulationForm from "../modules/admin/Regulation";
import SearchFaculty from "../modules/admin/SearchFaculty";
import EditMaterial from "../modules/admin/EditMaterial";
import UploadPdf from "../modules/faculty/upload/UploadPdf";
import UpdateTeach from "../modules/admin/UpdateTeach";
import RequestReport from "../modules/admin/RequestReport";

import StudentLogin from "../auth/StudentLogin";
import TeacherLogin from "../auth/TeacherLogIn";
import Signup from "../auth/Signup";

import Profile from "../layouts/facultydashboard/Profile";

import Documents from "../modules/student/Documents";
import StudentSection from "../layouts/studentdashboard/StudentSection";
import UpdateStudent from "../modules/admin/UpdateStudent";
import AcadamicCalender from "../modules/student/AcadamicCalender";
import Encapsulation from "../modules/student/Encapsulation";
import RegulationAddedpopup from "../modules/admin/popups/RegulationAddedpopup";
import RequestPopup from "../modules/student/find/RequestPopup";
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

// Protected route
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <h1>Unauthorized: Please login</h1>;
  if (role && user.role !== role) return <h1>Access Denied</h1>;
  return children;
};

const routes = createBrowserRouter([
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

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
        children: [
          { path: "add-remove-faculty", element: <AddRemoveFaculty /> },
          { path: "add-remove-student", element: <Add /> },
          { path: "view-faculty-student", element: <SearchFaculty /> },
          { path: "regulation", element: <RegulationForm />  },
          { path: "teacher-profile", element: <Teacherprofile /> },
          { path: "student-profile", element: <StudentProfile /> },
          {path: "regulationpop", element: <RegulationAddedpopup />}
        ],
      },
    ],
  },

  {
    path: "/teacher",
    element: (
      <ProtectedRoute role="teacher">
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Profile />, // main teacher dashboard
      },
      {
        path: "update-profile",
        element: <UpdateTeach />,
      },
    ],
  },

  {
    path: "/student",
    element: (
      <ProtectedRoute role="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <StudentSection /> }, // ✅ renamed correctly
      { path: "profile", element: <StudentProfile /> }, // ✅ profile route
      { path: "documents", element: <Documents /> },
      { path: "academic-calendar", element: <AcadamicCalender /> },
      { path: "subjects/encapsulation", element: <Encapsulation /> },
        {path:"RequestPopup", element:<RequestPopup/>},

    ],
  },
  { path: "update-profile-student", element: <UpdateStudent /> },

  { path: "/profile", element: <Profile /> },
  { path: "/update-teach", element: <UpdateTeach /> },
  { path: "/edit-material", element: <EditMaterial /> },
  { path: "/upload-pdf", element: <UploadPdf /> },
  { path: "/request-report", element: <RequestReport /> },

  { path: "*", element: <h1>Page Not Found</h1> },
]);

export default routes;
