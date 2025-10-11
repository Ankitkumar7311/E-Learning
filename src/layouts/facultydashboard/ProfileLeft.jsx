import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit, FaRegIdCard, FaRegEnvelope, FaPhoneAlt } from "react-icons/fa";
import teacher from "../../assets/teacher.jpg"; // Fallback image

// --- START: SVG Icon Components for a Cleaner UI ---
// These are the new icons from React Icons for a more attractive look.
const IconIdCard = ({ className = "w-5 h-5" }) => <FaRegIdCard className={className} />;
const IconEmail = ({ className = "w-5 h-5" }) => <FaRegEnvelope className={className} />;
const IconPhone = ({ className = "w-5 h-5" }) => <FaPhoneAlt className={className} />;
// --- END: SVG Icon Components ---

// This reusable component is what displays the icon, label, and value together.
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-indigo-500 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-800 break-words">{value || "N/A"}</p>
    </div>
  </div>
);

const ProfileLeft = ({ email, onNameFetched }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (profile && profile.name && onNameFetched) {
      onNameFetched(profile.name);
    }
  }, [profile, onNameFetched]);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    let active = true;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const res = await fetch(
          "http://localhost:8080/VidyaSarthi/faculty/getFacultyDetail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
          }
        );
        if (!res.ok) throw new Error("Failed to fetch profile details");
        const data = await res.json();
        if (active && data) {
          setProfile(data);
          if (data.imageData) {
            if (typeof data.imageData === 'string') {
              setImageSrc(data.imageData.startsWith("data:") ? data.imageData : `data:image/jpeg;base64,${data.imageData}`);
            } else if (Array.isArray(data.imageData)) {
              const reader = new FileReader();
              reader.onload = () => { if (active) setImageSrc(reader.result) };
              reader.readAsDataURL(new Blob([new Uint8Array(data.imageData)]));
            }
          }
        } else if (active) {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProfile();
    return () => { active = false; };
  }, [email]);

  const handleUpdate = () => {
    if (!profile) return;
    navigate("/teacher/update-profile", {
      state: { facultyId: profile.facultyId },
    });
  };

  const CardShell = ({ children }) => (
    <div className="w-full max-w-sm p-2">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <CardShell>
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Profile...</p>
        </div>
      </CardShell>
    );
  }

  if (!profile) {
    return (
      <CardShell>
        <div className="text-center py-10">
          <p className="text-gray-500">No profile data found.</p>
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell>
      {/* --- Header Section --- */}
      <div className="flex flex-col items-center text-center max-w-full">
        <img
          src={imageSrc || teacher}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-md mb-4"
          onError={(e) => { e.currentTarget.src = teacher; }}
        />
        <h2 className="text-2xl font-bold text-gray-900 break-words">{profile.name}</h2>
        <p className="text-sm font-medium text-indigo-500">{profile.designation || "Faculty"}</p>
      </div>

      {/* --- Details Section --- */}
      <div className="border-t border-gray-200 my-6 pt-6">
        <div className="space-y-4">
          {/* This is where the new icons are added to your layout */}
          <InfoRow icon={<IconIdCard />} label="Faculty ID" value={profile.facultyId} />
          <InfoRow icon={<IconEmail />} label="Email Address" value={profile.email} />
          <InfoRow icon={<IconPhone />} label="Phone Number" value={profile.phone} />

          {/* Subjects List */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Subjects</p>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {profile.subjects && profile.subjects.length > 0 ? (
                profile.subjects.map((subject) => <li key={subject.id}>{subject.name}</li>)
              ) : (
                <li>No subjects assigned.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* --- Footer Button --- */}
      <div className="mt-8">
        <button
          onClick={handleUpdate}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:-translate-y-1"
        >
          <FaRegEdit /> Update Profile
        </button>
      </div>
    </CardShell>
  );
};

export default ProfileLeft;