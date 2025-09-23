import { useLocation, useNavigate } from "react-router-dom";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email passed from login
  const email = location.state?.email;

  // Redirect to login if email missing
  if (!email) {
    navigate("/teacher-login");
    return null;
  }

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
