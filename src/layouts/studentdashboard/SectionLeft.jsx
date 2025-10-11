// // src/modules/student/SectionLeft.jsx
// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { FaRegEdit } from "react-icons/fa";
// import teacher from "../../assets/teacher.jpg";

// const API_BASE = "http://localhost:8080/VidyaSarthi";

// // helper to read studentId/token from localStorage (supports different shapes)
// const getAuthFromLocalStorage = () => {
//   try {
//     const token = localStorage.getItem("token") || null;
//     const userRaw = localStorage.getItem("user");
//     if (userRaw) {
//       try {
//         const u = JSON.parse(userRaw);
//         return { studentId: u?.studentId || u?.userId || null, token };
//       } catch {
//         // ignore parse error
//       }
//     }
//     const vsRaw = localStorage.getItem("vidyaSarthiAuth");
//     if (vsRaw) {
//       try {
//         const p = JSON.parse(vsRaw || "{}");
//         return { studentId: p?.studentId || null, token: p?.token || token };
//       } catch {
//         //
//       }
//     }
//     return { studentId: null, token };
//   } catch (err) {
//     console.error("Auth read error", err);
//     return { studentId: null, token: null };
//   }
// };

// const SectionLeft = () => {
//   const navigate = useNavigate();
//   const { studentId: storedStudentId, token } = getAuthFromLocalStorage();

//   const [loading, setLoading] = useState(true);
//   const [student, setStudent] = useState(null);
//   const [imageSrc, setImageSrc] = useState(null); // data URL or object URL
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let active = true;
//     let objectUrl = null;

//     const cleanup = () => {
//       if (objectUrl) {
//         try {
//           URL.revokeObjectURL(objectUrl);
//         } catch (e) {}
//         objectUrl = null;
//       }
//     };

//     const fetchStudent = async () => {
//       setLoading(true);
//       setError("");
//       if (!storedStudentId) {
//         setError("Student ID not found in local storage.");
//         setStudent(null);
//         setImageSrc(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`${API_BASE}/searchByStudentId/${encodeURIComponent(storedStudentId)}`, {
//           method: "GET",
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         if (!res.ok) {
//           const txt = await res.text().catch(() => "");
//           throw new Error(txt || `Failed to fetch (${res.status})`);
//         }

//         const data = await res.json();

//         if (!active) return;

//         if (!data || Object.keys(data).length === 0) {
//           setStudent(null);
//           setImageSrc(null);
//           setLoading(false);
//           return;
//         }

//         setStudent(data);

//         // Process imageData if present
//         const img = data.imageData;
//         if (!img) {
//           setImageSrc(null);
//         } else if (typeof img === "string") {
//           // assume base64 string (maybe already has data: prefix)
//           if (img.startsWith("data:")) {
//             setImageSrc(img);
//           } else {
//             setImageSrc(`data:image/jpeg;base64,${img}`);
//           }
//         } else if (Array.isArray(img)) {
//           // convert numeric byte array to blob -> dataURL
//           const bytes = new Uint8Array(img);
//           const blob = new Blob([bytes]);
//           // prefer using FileReader to generate dataURL
//           const reader = new FileReader();
//           reader.onload = () => {
//             if (!active) return;
//             setImageSrc(reader.result);
//           };
//           reader.onerror = () => {
//             if (!active) return;
//             setImageSrc(null);
//           };
//           reader.readAsDataURL(blob);
//         } else {
//           // unknown shape
//           setImageSrc(null);
//         }
//       } catch (err) {
//         console.error("Error fetching student:", err);
//         if (active) {
//           setError("Failed to load student details.");
//           setStudent(null);
//           setImageSrc(null);
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     fetchStudent();

//     return () => {
//       active = false;
//       cleanup();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [storedStudentId, token]);

//   const handleEdit = () => {
//     if (!student || !student.studentId) {
//       // fallback navigate without state
//       navigate("/update-profile-student");
//       return;
//     }
//     navigate("/update-profile-student", { state: { studentId: student.studentId } });
//   };

//   // Renderers
//   if (loading) {
//     return (
//       <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
//         <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-6">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!student) {
//     return (
//       <div className="h-full w-full md:w-1/2 flex justify-center py-3 shadow-sm">
//         <div className="flex flex-col rounded-xl bg-white h-auto md:h-[525px] w-[90%] sm:w-72 md:w-60 p-3">
//           <div className="flex flex-col items-center gap-2">
//             <img src={teacher} alt="no img" className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px] rounded-xl" />
//             <h4 className="text-center text-sm sm:text-base md:text-lg">No Student</h4>
//           </div>

//           <hr className="border-[#202020] border-[1.5px] w-full my-2" />

//           <span className="text-[13px] sm:text-[15px]/[20px]">No details available.</span>

//           <hr className="border-[#202020] border-[1.5px] w-full my-2" />

//           <aside className="flex items-center justify-center mt-auto">
//             <button onClick={() => navigate("/update-profile-student")} className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition text-sm sm:text-base">
//               <FaRegEdit size={18} /> Request
//             </button>
//           </aside>
//         </div>
//       </div>
//     );
//   }

//   // student exists
//   const displayName = student.name || student.studentId || "Student";
//   const roll = student.studentId || "N/A";
//   const branch = student.branch || "N/A";
//   const year = student.year || "N/A";
//   const phone = student.phone || "N/A";
//   const email = student.email || "N/A";
//   const address = student.address || "N/A";
//   const semester = student.semester || "N/A";
//   const regulation = student.regulation || "N/A";

//   return (
//     <div className="h-full w-full md:w-1/2 flex justify-center py-3 shadow-sm">
//       <div className="flex flex-col rounded-xl bg-[white] h-auto md:h-[525px] w-[90%] sm:w-72 md:w-60 p-3">
//         <div className="flex flex-col items-center gap-2">
//           <img
//             src={imageSrc || teacher}
//             alt="profile"
//             className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px] rounded-xl object-cover"
//             onError={(e) => {
//               e.currentTarget.src = teacher;
//             }}
//           />
//           <h4 className="text-center text-sm sm:text-base md:text-lg">{displayName}</h4>
//         </div>

//         <hr className="border-[#202020] border-[1.5px] w-full my-2" />

//         <span className="text-[13px] sm:text-[15px]/[20px]">
//           Subject: {branch} <br />
//           Batch: {year} <br />
//           Roll: {roll}
//         </span>

//         <hr className="border-[#202020] border-[1.5px] w-full my-2" />

//         <span className="text-sm sm:text-base">
//           Phone: <br />
//           {phone} <br />
//           Email : <br />
//           {email}
//         </span>

//         <hr className="border-[#202020] border-[1.5px] w-full my-2" />

//         <span className="text-sm sm:text-base">
//           Address: <br />
//           {address} <br />
//           Semester: {semester} <br />
//           Regulation: {regulation}
//         </span>

//         <br />
//         <aside className="flex items-center justify-center mt-auto">
//           <button onClick={handleEdit} className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition text-sm sm:text-base">
//             <FaRegEdit size={18} /> Request
//           </button>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default SectionLeft;
// src/modules/student/SectionLeft.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit, FaUserCircle } from "react-icons/fa"; // add this
// remove the teacher.jpg import if not needed

const API_BASE = "http://localhost:8080/VidyaSarthi";

const getAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token") || null;
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        return { studentId: u?.studentId || u?.userId || null, token };
      } catch {}
    }
    const vsRaw = localStorage.getItem("vidyaSarthiAuth");
    if (vsRaw) {
      try {
        const p = JSON.parse(vsRaw || "{}");
        return { studentId: p?.studentId || null, token: p?.token || token };
      } catch {}
    }
    return { studentId: null, token };
  } catch (err) {
    console.error("Auth read error", err);
    return { studentId: null, token: null };
  }
};

const SectionLeft = () => {
  const navigate = useNavigate();
  const { studentId: storedStudentId, token } = getAuthFromLocalStorage();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imgError, setImgError] = useState(false); // track load failure
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchStudent = async () => {
      setLoading(true);
      setError("");
      setImgError(false); // reset on every fetch
      if (!storedStudentId) {
        setError("Student ID not found in local storage.");
        setStudent(null);
        setImageSrc(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/searchByStudentId/${encodeURIComponent(storedStudentId)}`,
          { method: "GET", headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to fetch (${res.status})`);
        }

        const data = await res.json();
        if (!active) return;
        if (!data || Object.keys(data).length === 0) {
          setStudent(null);
          setImageSrc(null);
          setLoading(false);
          return;
        }

        setStudent(data);

        const img = data.imageData;
        if (!img) {
          setImageSrc(null);
        } else if (typeof img === "string") {
          setImageSrc(img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`);
        } else if (Array.isArray(img)) {
          const bytes = new Uint8Array(img);
          const blob = new Blob([bytes]);
          const reader = new FileReader();
          reader.onload = () => {
            if (active) setImageSrc(reader.result);
          };
          reader.onerror = () => {
            if (active) setImageSrc(null);
          };
          reader.readAsDataURL(blob);
        } else {
          setImageSrc(null);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        if (active) {
          setError("Failed to load student details.");
          setStudent(null);
          setImageSrc(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStudent();
    return () => { active = false; };
  }, [storedStudentId, token]);

  const handleEdit = () => {
    if (!student || !student.studentId) {
      navigate("/update-profile-student");
      return;
    }
    navigate("/update-profile-student", { state: { studentId: student.studentId } });
  };

  if (loading) {
    return (
      <div className="flex justify-center w-full md:w-1/2 px-3 py-5">
        <div className="flex flex-col rounded-2xl bg-white shadow-lg w-full max-w-sm p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="h-full w-full md:w-1/2 flex justify-center py-5 shadow-sm">
        <div className="flex flex-col rounded-xl bg-white h-auto md:h-[525px] w-[90%] sm:w-72 md:w-60 p-4">
          <div className="flex flex-col items-center gap-2">
            {/* Fallback icon when no student */}
            <FaUserCircle className="h-[90px] w-[90px] text-gray-300" aria-hidden="true" />
            <h4 className="text-center text-sm sm:text-base md:text-lg">No Student</h4>
          </div>

          <hr className="border-[#202020] border-[1.5px] w-full my-2" />
          <span className="text-[13px] sm:text-[15px]/[20px]">No details available.</span>
          <hr className="border-[#202020] border-[1.5px] w-full my-2" />

          <aside className="flex items-center justify-center mt-auto">
            <button
              onClick={() => navigate("/update-profile-student")}
              className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition text-sm sm:text-base"
            >
              <FaRegEdit size={18} /> Request
            </button>
          </aside>
        </div>
      </div>
    );
  }

  const { name, studentId, branch, year, phone, email, address, semester, regulation } = student;
  const displayName = name || studentId || "Student";

  return (
    <div className="h-full w-full md:w-1/2 flex justify-center py-5 shadow-sm">
      <div className="flex flex-col rounded-xl bg-[white] h-auto md:h-[525px] w-[90%] sm:w-72 md:w-60 p-4">
        <div className="flex flex-col items-center gap-2">
          {/* Image or fallback icon */}
          {imageSrc && !imgError ? (
            <img
              src={imageSrc}
              alt={`${displayName} profile photo`}
              className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px] rounded-xl object-cover"
              onError={() => setImgError(true)} // switch to fallback on load failure
            />
          ) : (
            <FaUserCircle
              className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px] text-gray-300"
              aria-hidden="true"
            />
          )}
          <h4 className="text-center text-sm sm:text-base md:text-lg break-words">{displayName}</h4>
        </div>

        <hr className="border-[#202020] border-[1.5px] w-full my-2" />

        <span className="text-[13px] sm:text-[15px]/[20px] break-words">
          Subject: {branch || "N/A"} <br />
          Batch: {year || "N/A"} <br />
          Roll: {studentId || "N/A"}
        </span>

        <hr className="border-[#202020] border-[1.5px] w-full my-2" />

        <span className="text-sm sm:text-base break-words">
          Phone: <br />
          {phone || "N/A"} <br />
          Email : <br />
          {email || "N/A"}
        </span>

        <hr className="border-[#202020] border-[1.5px] w-full my-2" />

        <span className="text-sm sm:text-base break-words">
          Address: <br />
          {address || "N/A"} <br />
          Semester: {semester || "N/A"} <br />
          Regulation: {regulation || "N/A"}
        </span>

        <br />
        <aside className="flex items-center justify-center mt-auto">
          <button
            onClick={handleEdit}
            className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition text-sm sm:text-base"
          >
            <FaRegEdit size={18} /> Request
          </button>
        </aside>
      </div>
    </div>
  );
};

export default SectionLeft;
