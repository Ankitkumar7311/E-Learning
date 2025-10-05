import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, redirecting to login');
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Show loading while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const email = user.email;

  console.log('📧 Teacher Profile - User email:', email);

  return (
    <section className="flex flex-col md:flex-row bg-white min-h-screen px-4 md:px-10 py-6 gap-6 items-center justify-center">
      {/* Left side (Profile card) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <ProfileLeft email={email} />
      </div>

      {/* Right side (Details card) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <ProfileRight />
      </div>
    </section>
  );
};

export default Profile;