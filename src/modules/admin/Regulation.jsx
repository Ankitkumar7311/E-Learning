// // src/components/RegulationForm.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; // adjust path if needed

// const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
//   ? process.env.REACT_APP_API_BASE
//   : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
//     ? import.meta.env.VITE_API_BASE
//     : 'http://localhost:8080/VidyaSarthi';

// const readToken = () => {
//   try {
//     // prefer auth context if you pass it in separately
//     const vs = localStorage.getItem("vidyaSarthiAuth");
//     if (vs) {
//       const parsed = JSON.parse(vs || "{}");
//       if (parsed?.token) return parsed.token;
//     }
//     return localStorage.getItem("token") || null;
//   } catch (e) {
//     console.warn("readToken:", e);
//     return localStorage.getItem("token") || null;
//   }
// };

// const RegulationForm = () => {
//   const navigate = useNavigate();
//   const auth = useAuth?.() || {};
//   const authToken = auth?.token || null;
//   const token = authToken || readToken();

//   // Top-level regulation info + list of semester groups
//   const [regulationName, setRegulationName] = useState("");
//   const [regulationId, setRegulationId] = useState("");
//   const [semesters, setSemesters] = useState([
//     // default one semester block
//     { semester: "", branch: "", subjects: [{ name: "", subjectCode: "" }] },
//   ]);

//   const [submitting, setSubmitting] = useState(false);

//   // Adds a new semester block
//   const addSemester = () => {
//     setSemesters(prev => [
//       ...prev,
//       { semester: "", branch: "", subjects: [{ name: "", subjectCode: "" }] },
//     ]);
//   };

//   const removeSemester = (index) => {
//     setSemesters(prev => prev.filter((_, i) => i !== index));
//   };

//   // Update semester block fields
//   const handleSemesterFieldChange = (index, field, value) => {
//     setSemesters(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
//   };

//   // Subject operations within a semester block
//   const addSubject = (semIndex) => {
//     setSemesters(prev => prev.map((s, i) => i === semIndex ? { ...s, subjects: [...s.subjects, { name: "", subjectCode: "" }] } : s));
//   };

//   const removeSubject = (semIndex, subjIndex) => {
//     setSemesters(prev => prev.map((s, i) => {
//       if (i !== semIndex) return s;
//       const nextSubjects = s.subjects.filter((_, idx) => idx !== subjIndex);
//       return { ...s, subjects: nextSubjects.length ? nextSubjects : [{ name: "", subjectCode: "" }] };
//     }));
//   };

//   const handleSubjectChange = (semIndex, subjIndex, field, value) => {
//     setSemesters(prev => prev.map((s, i) => {
//       if (i !== semIndex) return s;
//       const subjects = s.subjects.map((sub, idx) => idx === subjIndex ? { ...sub, [field]: value } : sub);
//       return { ...s, subjects };
//     }));
//   };

//   const validate = () => {
//     if (!regulationId || !regulationName) {
//       alert("Please provide Regulation ID and Regulation Name.");
//       return false;
//     }
//     // ensure at least one valid subject
//     const flattened = semesters.flatMap(s => s.subjects.map(sub => ({ ...sub, semester: s.semester, branch: s.branch })));
//     const filled = flattened.filter(sub => sub.name?.trim() && sub.subjectCode?.trim());
//     if (filled.length === 0) {
//       alert("Please add at least one subject (with name and subject code).");
//       return false;
//     }
//     // check semester numbers are valid
//     for (const s of semesters) {
//       if (!s.semester || isNaN(Number(s.semester))) {
//         alert("Please enter valid semester number for all semester blocks.");
//         return false;
//       }
//       if (!s.branch || !s.branch.trim()) {
//         alert("Please provide branch for each semester block.");
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // build newSubjects as required by backend
//     const newSubjects = [];
//     for (const s of semesters) {
//       const semesterNumber = Number(s.semester);
//       const branchType = s.branch?.trim();
//       for (const sub of s.subjects) {
//         if (!sub.name?.trim() || !sub.subjectCode?.trim()) continue; // skip empty rows
//         newSubjects.push({
//           subjectCode: sub.subjectCode.trim(),
//           name: sub.name.trim(),
//           semester: semesterNumber,
//           regulationId: regulationId,
//           branchType,
//         });
//       }
//     }

//     if (newSubjects.length === 0) {
//       alert("No valid subjects to submit.");
//       return;
//     }

//     const payload = {
//       name: regulationName,
//       regulationId: regulationId,
//       newSubjects,
//     };

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/addNewRegulation`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       const text = await res.text().catch(() => "");

//       if (res.status === 409) {
//         alert(text || "Duplicate: regulation already exists.");
//       } else if (!res.ok) {
//         console.error("Regulation create failed:", res.status, text);
//         alert(text || `Failed to add regulation (${res.status})`);
//       } else {
//         alert(text || "Regulation added successfully.");
//         // optional: navigate to admin/regulation list or reset form
//         navigate("/admin/dashboard");
//       }
//     } catch (err) {
//       console.error("Error adding regulation:", err);
//       alert("Network/server error. See console for details.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full flex justify-center mt-10 px-4">
//       <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl space-y-6">
//         <h2 className="text-xl font-semibold mb-2">Add Regulation</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Regulation Name</label>
//             <input
//               type="text"
//               value={regulationName}
//               onChange={(e) => setRegulationName(e.target.value)}
//               placeholder="Regulation 2027 (display name)"
//               className="w-full p-2 rounded-md bg-blue-50 border border-blue-200"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Regulation ID</label>
//             <input
//               type="text"
//               value={regulationId}
//               onChange={(e) => setRegulationId(e.target.value)}
//               placeholder="R2027 (exact id to send)"
//               className="w-full p-2 rounded-md bg-blue-50 border border-blue-200"
//               required
//             />
//           </div>
//         </div>

//         {/* Semesters blocks */}
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-medium">Semesters & Subjects</label>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={addSemester}
//                 className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
//               >
//                 + Add Semester
//               </button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {semesters.map((s, si) => (
//               <div key={si} className="border rounded-lg p-4 bg-gray-50">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex gap-3 items-center">
//                     <div>
//                       <label className="block text-xs font-medium">Semester No.</label>
//                       <input
//                         type="number"
//                         value={s.semester}
//                         onChange={(e) => handleSemesterFieldChange(si, "semester", e.target.value)}
//                         className="p-2 w-28 rounded-md bg-white border border-gray-200"
//                         placeholder="1"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium">Branch</label>
//                       <input
//                         type="text"
//                         value={s.branch}
//                         onChange={(e) => handleSemesterFieldChange(si, "branch", e.target.value)}
//                         className="p-2 w-36 rounded-md bg-white border border-gray-200"
//                         placeholder="CIVIL"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium">Regulation ID (auto)</label>
//                       <input
//                         type="text"
//                         value={regulationId}
//                         readOnly
//                         className="p-2 w-40 rounded-md bg-gray-100 border border-gray-200 text-sm"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <button
//                       type="button"
//                       onClick={() => removeSemester(si)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
//                     >
//                       Remove Semester
//                     </button>
//                   </div>
//                 </div>

//                 {/* Subjects for this semester */}
//                 <div className="space-y-2">
//                   {s.subjects.map((sub, subi) => (
//                     <div key={subi} className="flex gap-2 items-center">
//                       <div className="w-8 text-sm text-gray-700">{subi + 1}.</div>
//                       <input
//                         type="text"
//                         value={sub.name}
//                         onChange={(e) => handleSubjectChange(si, subi, "name", e.target.value)}
//                         placeholder="Subject Name"
//                         className="flex-1 p-2 rounded-md bg-white border border-gray-200"
//                       />
//                       <input
//                         type="text"
//                         value={sub.subjectCode}
//                         onChange={(e) => handleSubjectChange(si, subi, "subjectCode", e.target.value)}
//                         placeholder="Subject Code"
//                         className="w-48 p-2 rounded-md bg-white border border-gray-200"
//                       />
//                       <input
//                         type="text"
//                         value={regulationId}
//                         readOnly
//                         className="w-40 p-2 rounded-md bg-gray-100 border border-gray-200 text-sm"
//                         title="This is auto-filled from regulation id"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeSubject(si, subi)}
//                         className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}

//                   <div className="mt-2">
//                     <button
//                       type="button"
//                       onClick={() => addSubject(si)}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
//                     >
//                       + Add Subject to Semester {s.semester || si + 1}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-center">
//           <button
//             type="submit"
//             disabled={submitting}
//             className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
//           >
//             {submitting ? "Submitting..." : "Submit Regulation"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegulationForm;

// src/components/RegulationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

const readToken = () => {
  try {
    // prefer auth context if you pass it in separately
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    console.warn("readToken:", e);
    return localStorage.getItem("token") || null;
  }
};

const RegulationForm = () => {
  const navigate = useNavigate();
  const auth = useAuth?.() || {};
  const authToken = auth?.token || null;
  const token = authToken || readToken();

  // Top-level regulation info + list of semester groups
  const [regulationName, setRegulationName] = useState("");
  const [regulationId, setRegulationId] = useState("");
  const [semesters, setSemesters] = useState([
    // default one semester block
    { semester: "", branch: "", subjects: [{ name: "", subjectCode: "" }] },
  ]);

  const [submitting, setSubmitting] = useState(false);

  // Adds a new semester block
  const addSemester = () => {
    setSemesters(prev => [
      ...prev,
      { semester: "", branch: "", subjects: [{ name: "", subjectCode: "" }] },
    ]);
  };

  const removeSemester = (index) => {
    setSemesters(prev => prev.filter((_, i) => i !== index));
  };

  // Update semester block fields
  const handleSemesterFieldChange = (index, field, value) => {
    setSemesters(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  // Subject operations within a semester block
  const addSubject = (semIndex) => {
    setSemesters(prev => prev.map((s, i) => i === semIndex ? { ...s, subjects: [...s.subjects, { name: "", subjectCode: "" }] } : s));
  };

  const removeSubject = (semIndex, subjIndex) => {
    setSemesters(prev => prev.map((s, i) => {
      if (i !== semIndex) return s;
      const nextSubjects = s.subjects.filter((_, idx) => idx !== subjIndex);
      return { ...s, subjects: nextSubjects.length ? nextSubjects : [{ name: "", subjectCode: "" }] };
    }));
  };

  const handleSubjectChange = (semIndex, subjIndex, field, value) => {
    setSemesters(prev => prev.map((s, i) => {
      if (i !== semIndex) return s;
      const subjects = s.subjects.map((sub, idx) => idx === subjIndex ? { ...sub, [field]: value } : sub);
      return { ...s, subjects };
    }));
  };

  const validate = () => {
    if (!regulationId || !regulationName) {
      alert("Please provide Regulation ID and Regulation Name.");
      return false;
    }
    // ensure at least one valid subject
    const flattened = semesters.flatMap(s => s.subjects.map(sub => ({ ...sub, semester: s.semester, branch: s.branch })));
    const filled = flattened.filter(sub => sub.name?.trim() && sub.subjectCode?.trim());
    if (filled.length === 0) {
      alert("Please add at least one subject (with name and subject code).");
      return false;
    }
    // check semester numbers are valid
    for (const s of semesters) {
      if (!s.semester || isNaN(Number(s.semester))) {
        alert("Please enter valid semester number for all semester blocks.");
        return false;
      }
      if (!s.branch || !s.branch.trim()) {
        alert("Please provide branch for each semester block.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // build newSubjects as required by backend
    const newSubjects = [];
    for (const s of semesters) {
      const semesterNumber = Number(s.semester);
      const branchType = s.branch?.trim();
      for (const sub of s.subjects) {
        if (!sub.name?.trim() || !sub.subjectCode?.trim()) continue; // skip empty rows
        newSubjects.push({
          subjectCode: sub.subjectCode.trim(),
          name: sub.name.trim(),
          semester: semesterNumber,
          regulationId: regulationId,
          branchType,
        });
      }
    }

    if (newSubjects.length === 0) {
      alert("No valid subjects to submit.");
      return;
    }

    const payload = {
      name: regulationName,
      regulationId: regulationId,
      newSubjects,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/addNewRegulation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text().catch(() => "");

      if (res.status === 409) {
        alert(text || "Duplicate: regulation already exists.");
      } else if (!res.ok) {
        console.error("Regulation create failed:", res.status, text);
        alert(text || `Failed to add regulation (${res.status})`);
      } else {
        alert(text || "Regulation added successfully.");
        // optional: navigate to admin/regulation list or reset form
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Error adding regulation:", err);
      alert("Network/server error. See console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl space-y-6">
        <h2 className="text-xl font-semibold mb-2">Add Regulation</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Regulation Name</label>
            <input
              type="text"
              value={regulationName}
              onChange={(e) => setRegulationName(e.target.value)}
              placeholder="Regulation 2027 (display name)"
              className="w-full p-2 rounded-md bg-blue-50 border border-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Regulation ID</label>
            <input
              type="text"
              value={regulationId}
              onChange={(e) => setRegulationId(e.target.value)}
              placeholder="R2027 (exact id to send)"
              className="w-full p-2 rounded-md bg-blue-50 border border-blue-200"
              required
            />
          </div>
        </div>

        {/* Semesters blocks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Semesters & Subjects</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addSemester}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                + Add Semester
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {semesters.map((s, si) => (
              <div key={si} className="border rounded-lg p-4 bg-gray-50">
                {/* RESPONSIVE CHANGE: Added flex-wrap and gap to allow items to stack on small screens */}
                <div className="flex flex-wrap items-end justify-between gap-y-3 gap-x-4 mb-3">
                  {/* RESPONSIVE CHANGE: Added flex-wrap to this inner container as well */}
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="block text-xs font-medium">Semester No.</label>
                      <input
                        type="number"
                        value={s.semester}
                        onChange={(e) => handleSemesterFieldChange(si, "semester", e.target.value)}
                        className="p-2 w-28 rounded-md bg-white border border-gray-200"
                        placeholder="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium">Branch</label>
                      <input
                        type="text"
                        value={s.branch}
                        onChange={(e) => handleSemesterFieldChange(si, "branch", e.target.value)}
                        className="p-2 w-36 rounded-md bg-white border border-gray-200"
                        placeholder="CIVIL"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium">Regulation ID (auto)</label>
                      <input
                        type="text"
                        value={regulationId}
                        readOnly
                        className="p-2 w-40 rounded-md bg-gray-100 border border-gray-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* This button will now wrap gracefully if space is limited */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeSemester(si)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Remove Semester
                    </button>
                  </div>
                </div>

                {/* Subjects for this semester */}
                <div className="space-y-2">
                  {s.subjects.map((sub, subi) => (
                    // RESPONSIVE CHANGE: Added flex-wrap to allow subject inputs to stack on small screens
                    <div key={subi} className="flex flex-wrap gap-2 items-center">
                      <div className="w-8 text-sm text-gray-700">{subi + 1}.</div>
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => handleSubjectChange(si, subi, "name", e.target.value)}
                        placeholder="Subject Name"
                        // RESPONSIVE CHANGE: Added a min-width to prevent this field from becoming too small
                        className="min-w-[150px] flex-1 p-2 rounded-md bg-white border border-gray-200"
                      />
                      <input
                        type="text"
                        value={sub.subjectCode}
                        onChange={(e) => handleSubjectChange(si, subi, "subjectCode", e.target.value)}
                        placeholder="Subject Code"
                        className="w-48 p-2 rounded-md bg-white border border-gray-200"
                      />
                      <input
                        type="text"
                        value={regulationId}
                        readOnly
                        className="w-40 p-2 rounded-md bg-gray-100 border border-gray-200 text-sm"
                        title="This is auto-filled from regulation id"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubject(si, subi)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => addSubject(si)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      + Add Subject to Semester {s.semester || si + 1}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {submitting ? "Submitting..." : "Submit Regulation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegulationForm;