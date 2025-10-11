import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const email = user.email;

  const welcomeMessage = facultyName
    ? `Welcome back, ${facultyName}!`
    : "Welcome to your Profile!";

  return (
    // Main container set to full screen height and flex column
    <main className="max-h-screen bg-white flex flex-col">
      {/* Welcome message with padding, will not grow or shrink */}
      <div className="px-4 md:px-10 pt-8 pb-4 flex-shrink-0 bg-yellow-100">
        <h1 className="text-3xl font-bold text-gray-800">
          {welcomeMessage} 👋
        </h1>
        <p className="mt-1 text-gray-600">View and manage your profile details below.</p>
      </div>

      {/* MODIFIED: This container no longer centers the section, allowing it to be full-width */}
      <div className="flex-grow px-4 md:px-10 pb-8 min-h-0">
        {/* MODIFIED: The section is back to h-full to fill its container */}
        <section className="h-full  w-full flex flex-col md:flex-row bg-white  p-6 gap-4 overflow-y-auto">
          {/* MODIFIED: The divs are set back to w-full md:w-1/2 to occupy the full width */}
          <div className="w-full md:w-1/2 flex justify-center">
            <ProfileLeft email={email} onNameFetched={setFacultyName} />
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <ProfileRight />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;