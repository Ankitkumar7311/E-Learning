import { createBrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbars/NavBar";
import AdminNavBar from "../components/navbars/AdminNavBar";
import AdminDashboard from "../components/admin_profile/AdminDashboard";
import HomePage from "../components/admin_profile/HomePage";
import Courses from "../components/admin_profile/Courses";
import Universities from "../components/admin_profile/Universities";
import Community from "../components/admin_profile/Community";
import News from "../components/admin_profile/News";
import About from "../components/admin_profile/About";
import Login from "../components/admin_profile/Login";
import StudentLogin from "../components/admin_profile/StudentLogin";
import TeacherLogin from "../components/admin_profile/TeacherLogIn";
import Signup from "../components/students_profile/Signup";
import Profile from "../components/admin_profile/Profile";
import Teacherprofile from "../components/admin_profile/Teacherprofile";
import StudentProfile from "../components/admin_profile/StudentProfile";
import Documents from "../components/students_profile/Documents";
import AddRemoveFaculty from "../components/admin_profile/AddRemoveFaculty";
import Add from "../components/admin_profile/Add";
import RegulationForm from "../components/admin_profile/Regulation";
import SearchFaculty from "../components/admin_profile/SearchFaculty";
import EditMaterial from "../components/admin_profile/EditMaterial";
import UploadPdf from "../components/admin_profile/UploadPdf";
import UpdateTeach from "../components/admin_profile/UpdateTeach";
import RequestReport from "../components/admin_profile/RequestReport";
import TeacherNavBar from "../components/navbars/TeacherNavbar";
import StudentNavBar from "../components/navbars/StudentNavBar";

// Public layout with Outlet
const PublicLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

// Admin layout with Outlet
const AdminLayout = () => (
  <>
    <AdminNavBar />
    <Outlet />
  </>
);
const TeacherLayout = () => {
  <>
    <TeacherNavBar />
    <Outlet />
  </>;
};

const StudentLayout = () => {
  <>
    <StudentNavBar />
    <Outlet />
  </>;
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

  // Profile routes (not inside NavBar)
  { path: "/profile", element: <Profile /> },
  { path: "/teacher-profile", element: <Teacherprofile /> },
  { path: "/student-profile", element: <StudentProfile /> },
  { path: "/documents", element: <Documents /> },

  // Admin Dashboard with nested routes
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "add-remove-faculty", element: <AddRemoveFaculty /> },
      { path: "add-remove-student", element: <Add /> },
      { path: "view-faculty-student", element: <SearchFaculty /> },
      { path: "regulation", element: <RegulationForm /> },
    ],
  },

  // Extra features
  { path: "/update-teach", element: <UpdateTeach /> },
  { path: "/edit-material", element: <EditMaterial /> },
  { path: "/upload-pdf", element: <UploadPdf /> },
  { path: "/request-report", element: <RequestReport /> },

  // 404
  { path: "*", element: <h1>Page Not Found</h1> },
]);

export default routes;
