import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import teacher from "../../assets/teacher.jpg";

const ProfileLeft = ({ email }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // local state for image src (data URL or object URL)
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    let active = true;
    let objectUrlToRevoke = null;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setProfile(null);
          setLoading(false);
          return;
        }

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

        if (!res.ok) {
          throw new Error("Failed to fetch profile details");
        }

        const data = await res.json();

        if (!active) return;

        if (data && Object.keys(data).length > 0) {
          setProfile(data);
          // process imageData if present
          if (data.imageData) {
            // Case 1: backend sent base64 string (Jackson default serializes byte[] to Base64)
            if (typeof data.imageData === "string") {
              // Try to detect image MIME (if backend adds a mimeType field use that instead)
              // We'll assume jpeg/png; if images look wrong, add a mime type in backend (recommended)
              // If the string already contains data URI prefix, use as-is
              if (data.imageData.startsWith("data:")) {
                setImageSrc(data.imageData);
              } else {
                // default to jpeg
                setImageSrc(`data:image/jpeg;base64,${data.imageData}`);
              }
            }
            // Case 2: backend sent numeric array [137,80,78,...]
            else if (Array.isArray(data.imageData)) {
              const byteArray = new Uint8Array(data.imageData);
              const blob = new Blob([byteArray]); // no mime info available
              // Use FileReader to convert to data URL (works in all browsers)
              const reader = new FileReader();
              reader.onload = () => {
                if (!active) return;
                const result = reader.result; // data:*/*;base64,...
                setImageSrc(result);
              };
              reader.onerror = (err) => {
                console.error("Failed to convert image blob to data URL", err);
              };
              reader.readAsDataURL(blob);
            }
            // other shapes: ignore and fallback to default
            else {
              setImageSrc(null);
            }
          } else {
            setImageSrc(null);
          }
        } else {
          setProfile(null);
          setImageSrc(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
        setImageSrc(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [email]);

  const handleUpdate = () => {
    if (!profile) return;
    navigate("/teacher/update-profile", {
      state: { facultyId: profile.facultyId },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
        <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
        <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-6">
          <p className="text-center text-gray-500">No profile data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
      <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-6">
        <div className="flex flex-col items-center gap-3">
          {/* show imageSrc if available else fallback teacher */}
          <img
            src={imageSrc || teacher}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover shadow"
          />
          <h4 className="text-lg font-semibold text-gray-800">{profile.name}</h4>
        </div>

        <hr className="border-gray-300 my-4" />

        <div className="text-sm leading-6 space-y-3 text-gray-700">
          <div>
            <span className="font-semibold">Subjects:</span>
            <ul className="list-disc list-inside mt-1">
              {profile.subjects && profile.subjects.length > 0 ? (
                profile.subjects.map((subject) => <li key={subject.id}>{subject.name}</li>)
              ) : (
                <li>N/A</li>
              )}
            </ul>
            <br />
            <span className="font-semibold">Faculty ID:</span> {profile.facultyId}
          </div>

          <hr className="border-gray-200" />

          <p>
            <span className="font-semibold">Phone:</span> {profile.phone}
            <br />
            <span className="font-semibold">Email:</span> {profile.email}
          </p>

          <hr className="border-gray-200" />

          <p>
            <span className="font-semibold">Designation:</span> {profile.designation}
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
