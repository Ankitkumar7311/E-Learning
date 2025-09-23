import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import teacher from "../../assets/teacher.jpg";

const ProfileLeft = ({ email }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/VidyaSarthi/faculty/getFacultyEmail",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setProfile(data); // backend se aaya real data
        } else {
          setProfile(null); // agar backend empty object
        }
      } catch (err) {
        setProfile(null); // backend fail hua
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  const handleUpdate = () => {
    if (!profile) return;
    navigate("/teacher/update-profile", {
      state: { facultyId: profile.facultyId },
    });
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  if (!profile)
    return (
      <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
        <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-6">
          <p className="text-center text-gray-500">No profile data found.</p>
        </div>
      </div>
    );

  return (
    <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
      <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src={teacher}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover shadow"
          />
          <h4 className="text-lg font-semibold text-gray-800">
            {profile.name}
          </h4>
        </div>

        <hr className="border-gray-300 my-4" />

        <div className="text-sm leading-6 space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Subject:</span> {profile.subject}
            <br />
            <span className="font-semibold">Faculty ID:</span>{" "}
            {profile.facultyId}
          </p>

          <hr className="border-gray-200" />

          <p>
            <span className="font-semibold">Phone:</span> {profile.phone}
            <br />
            <span className="font-semibold">Email:</span> {profile.email}
          </p>

          <hr className="border-gray-200" />

          <p>
            <span className="font-semibold">Designation:</span>{" "}
            {profile.designation}
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
          >
            <FaRegEdit size={18} /> Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeft;
