// // Add this component to routing/Router.jsx
// import { Navigate } from "react-router-dom"; // Already imported
// import { useAuth } from "../auth/AuthContext"; // Already imported

// const AuthRedirect = ({ children }) => {
//   const { isAuthenticated, user } = useAuth();
  
//   if (isAuthenticated && user) {
//     const role = user.role; // Assuming user.role is available after login
    
//     switch (role) {
//       case 'admin':
//         // Navigate to the full admin dashboard path
//         return <Navigate to="/admin/dashboard" replace />;
//       case 'teacher':
//         // Navigate to the full teacher dashboard path
//         return <Navigate to="/teacher/dashboard" replace />;
//       case 'student':
//         // Navigate to the full student dashboard path
//         return <Navigate to="/student/dashboard" replace />;
//       default:
//         // Default authenticated user redirection
//         return <Navigate to="/dashboard" replace />;
//     }
//   }

//   // User is NOT authenticated, so render the wrapped component (the login form)
//   return children;
// };

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthRedirect() {
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 AuthRedirect checking:', { isAuthenticated, role, user });

    if (!isAuthenticated || !role) {
      console.log('❌ Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Role is already normalized to lowercase in AuthContext
    const normalizedRole = role.toLowerCase();
    
    console.log('✅ Authenticated! Role:', normalizedRole);

    // Redirect based on role
    switch (normalizedRole) {
      case 'admin':
        console.log('🔄 Redirecting to admin dashboard');
        navigate('/admin/dashboard', { 
          replace: true,
          state: { 
            adminId: user.adminId || user.userId, 
            email: user.email 
          } 
        });
        break;

      case 'faculty':
      case 'teacher':
        console.log('🔄 Redirecting to teacher dashboard');
        navigate('/teacher/dashboard', { 
          replace: true,
          state: { 
            facultyId: user.facultyId || user.userId, 
            email: user.email 
          } 
        });
        break;

      case 'student':
        console.log('🔄 Redirecting to student dashboard');
        navigate('/student/dashboard', { 
          replace: true,
          state: { 
            studentId: user.studentId || user.userId, 
            email: user.email 
          } 
        });
        break;

      default:
        console.log('❌ Unknown role, redirecting to login');
        navigate('/login', { replace: true });
    }
  }, [isAuthenticated, role, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700">Redirecting...</p>
      </div>
    </div>
  );
}