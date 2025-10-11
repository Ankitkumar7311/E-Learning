import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../pages/NavBar";
import AdminNavBar from "../modules/admin/AdminNavBar";
import TeacherNavBar from "../modules/faculty/TeacherNavBar";
import StudentNavBar from "../modules/student/StudentNavBar";

import AdminDashboard from "../layouts/AdminDashboard";
import HomePage from "../pages/HomePage";
import Courses from "../pages/Courses";
import CentralLibrary from "../pages/CentralLibrary";
import Facilities from "../pages/Facilities";
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

// import Documents from "../modules/student/Documents";
import StudentSection from "../layouts/studentdashboard/StudentSection";
import UpdateStudent from "../modules/admin/UpdateStudent";
// import AcadamicCalender from "../modules/student/AcadamicCalender";
// import Encapsulation from "../modules/student/Encapsulation";
import FindPYQ from "../modules/student/find/FindPYQ";
import FindNotes from "../modules/student/find/FindNotes";
import FindQB from "../modules/student/find/FindQB";

import RegulationAddedpopup from "../modules/admin/popups/RegulationAddedpopup";
import RequestPopup from "../modules/student/find/RequestPopup";

import EditMaterialPage from "../modules/faculty/upload/EditMaterialPage";
import HelpAndSupportForm from "../pages/HelpAndSupportForm";

// ---------------------- Layouts ----------------------
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

// ---------------------- Custom Router Components ----------------------

/**
 * ProtectedRoute: Checks authentication and role before rendering children.
 */
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  console.log('🔒 ProtectedRoute check:', { isAuthenticated, role, userRole: user?.role, loading });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Normalize role for comparison (handle both "teacher" and "faculty")
  const userRole = user?.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();
  
  if (requiredRole && userRole !== requiredRole) {
    // Special case: "faculty" and "teacher" are the same
    if (!((userRole === 'faculty' || userRole === 'teacher') && 
          (requiredRole === 'faculty' || requiredRole === 'teacher'))) {
      console.log('❌ Access denied. Required:', requiredRole, 'Got:', userRole);
      return <h1>Access Denied: Required role is {role}</h1>;
    }
  }

  console.log('✅ Access granted');
  return children;
};

/**
 * AuthRedirect: Redirects authenticated users away from login pages.
 * CRITICAL: This must re-evaluate when auth state changes!
 */
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  console.log('🔄 AuthRedirect evaluating:', { isAuthenticated, userRole: user?.role, loading });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated && user) {
    const role = user.role?.toLowerCase();
    
    console.log('✅ User authenticated, redirecting to dashboard. Role:', role);
    
    switch (role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'faculty':
      case 'teacher':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      default:
        console.log('⚠️ Unknown role, redirecting to home');
        return <Navigate to="/" replace />;
    }
  }

  console.log('🔓 Not authenticated, showing login page');
  return children;
};

// ---------------------- Router Definition ----------------------
const routes = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <Courses /> },
      { path: "library", element: <CentralLibrary/> },
      { path: "facilities", element: <Facilities /> },
      { path: "news", element: <News /> },
      { path: "about", element: <About /> },       
      // Wrap login components with AuthRedirect
      { path: "login", element: <AuthRedirect><Login /></AuthRedirect> },
      { path: "student-login", element: <AuthRedirect><StudentLogin /></AuthRedirect> },
      { path: "teacher-login", element: <AuthRedirect><TeacherLogin /></AuthRedirect> },
      { path: "signup", element: <Signup /> },
    ],
  },

  // ---------------------- Admin Routes ----------------------
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
          { path: "regulationpop", element: <RegulationAddedpopup /> }
        ],
      },
    ],
  },

  // ---------------------- Teacher Routes ----------------------
  {
    path: "/teacher",
    element: (
      <ProtectedRoute role="teacher">
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Profile /> },
      { path: "request-report", element: <RequestReport /> },
      { path: "edit-material", element: <EditMaterial /> },
      { path: "edit-material/:materialId", element: <EditMaterialPage /> },
      { path: "update-profile", element: <UpdateTeach /> },
      { path: "upload-pdf", element: <UploadPdf /> },
    ],
  },

  // ---------------------- Student Routes ----------------------
  {
    path: "/student",
    element: (
      <ProtectedRoute role="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <StudentSection />,
        children:[
          { path:"find-pyq", element:<FindPYQ/>},
          { path:"find-notes", element:<FindNotes/>},
          { path:"find-qb", element:<FindQB/>},
        ]
       }, 
      { path: "profile", element: <StudentProfile /> }, 
      // { path: "documents", element: <Documents /> },
      // { path: "academic-calendar", element: <AcadamicCalender /> },
      // { path: "subjects/encapsulation", element: <Encapsulation /> },
      // { path: "RequestPopup", element: <RequestPopup /> },
    ],
  },

  // ---------------------- Standalone Routes ----------------------
  { path: "update-profile-student", element: <UpdateStudent /> },
  { path: "/profile", element: <Profile /> },
  { path: "/update-teach", element: <UpdateTeach /> },
  { path: "/edit-material", element: <EditMaterial /> },
  {path:"help-support",element: <HelpAndSupportForm/>}, 

  // ---------------------- 404 Route ----------------------
  { path: "*", element: <h1>Page Not Found</h1> },
]);

export default routes;