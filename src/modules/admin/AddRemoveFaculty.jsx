// src/modules/admin/AddRemoveFaculty.jsx
import React, { useState, useEffect, useCallback } from "react";
import TeacherTable from "./TeacherTable";
import { useAuth } from "../../auth/AuthContext";

// ✅ Dynamic API Base URL
const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

// ✅ Robust Token Reader
const readToken = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    console.warn("readToken error:", e);
    return localStorage.getItem("token") || null;
  }
};

// ✅ Reusable Modal Component
const Modal = ({ message, type = "success", onClose }) => {
  const isSuccess = type === "success";
  const colors = {
    bg: isSuccess ? "bg-green-50" : "bg-red-50",
    border: isSuccess ? "border-green-400" : "border-red-400",
    text: isSuccess ? "text-green-800" : "text-red-800",
    iconBg: isSuccess ? "bg-green-100" : "bg-red-100",
    icon: isSuccess ? "text-green-600" : "text-red-600",
    button: isSuccess ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`${colors.bg} border-l-4 ${colors.border} rounded-lg shadow-2xl max-w-md w-full animate-fadeIn`}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={`${colors.iconBg} rounded-full p-2 flex-shrink-0`}>
              {isSuccess ? (
                <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${colors.text} mb-1`}>{isSuccess ? "Success!" : "Error"}</h3>
              <p className={`text-sm ${colors.text}`}>{message}</p>
            </div>
            <button onClick={onClose} className={`${colors.text} hover:opacity-70 transition duration-200`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className={`px-4 py-2 rounded-md text-sm font-medium transition ${colors.button}`}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ✅ Reusable Input Component
const InputField = ({ ...props }) => (
  <input
    {...props}
    className={`w-full h-[50px] p-3 border border-gray-300 rounded-lg bg-blue-100 text-gray-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${props.disabled ? "opacity-70 cursor-not-allowed bg-gray-200" : ""}`}
  />
);

// ✅ Reusable Button Component
const ActionButton = ({ children, variant = 'add', disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    className={`w-full h-[50px] text-white font-bold rounded-lg transition duration-300 shadow 
      ${variant === 'add' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const AddRemoveFaculty = () => {
  const { token: contextToken } = useAuth() || {};
  const token = contextToken || readToken();

  const [facultyList, setFacultyList] = useState([]);
  const initialFormState = { name: "", facultyId: "", email: "", password: "", address: "", designation: "" };
  const [addForm, setAddForm] = useState(initialFormState);
  const [removeId, setRemoveId] = useState("");
  const [removeName, setRemoveName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const fetchAllFaculty = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/facultyList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Error fetching faculty: ${response.status}`);
      const data = await response.json();
      setFacultyList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setModal({ type: "error", message: "Failed to fetch faculty list." });
    }
  }, [token]);

  useEffect(() => {
    fetchAllFaculty();
  }, [fetchAllFaculty]);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(addForm).some(field => field === "")) {
      setModal({ type: "error", message: "Please fill all fields to add a faculty." });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/addNewTeacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(addForm),
      });
      const text = await response.text().catch(() => "");
      if (!response.ok) throw new Error(text || `Failed to add faculty (${response.status})`);

      setModal({ type: "success", message: "Faculty added successfully!" });
      setAddForm(initialFormState);
      fetchAllFaculty();
    } catch (error) {
      console.error(error);
      setModal({ type: "error", message: error.message || "Failed to add faculty." });
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Efficiently find faculty name from local state on blur
  const handleFetchFacultyName = () => {
    if (!removeId) {
      setRemoveName('');
      return;
    }
    const facultyMember = facultyList.find(f => String(f.facultyId) === String(removeId));
    if (facultyMember) {
      setRemoveName(facultyMember.name);
    } else {
      setRemoveName('');
      setModal({ type: "error", message: `Faculty with ID "${removeId}" not found.` });
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!removeId || !removeName) {
      setModal({ type: "error", message: "Please enter a valid Faculty ID and fetch the name first." });
      return;
    }
    setRemoveLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/deleteFaculty/${encodeURIComponent(removeId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await response.text().catch(() => "");
      if (!response.ok) throw new Error(text || `Remove failed (${response.status})`);
      
      setModal({ type: "success", message: `Faculty ${removeName} (${removeId}) removed successfully!` });
      setRemoveId("");
      setRemoveName("");
      fetchAllFaculty();
    } catch (error) {
      console.error(error);
      setModal({ type: "error", message: error.message || "Failed to remove faculty." });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50 p-6 flex flex-col items-center">
      {modal && <Modal message={modal.message} type={modal.type} onClose={() => setModal(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-10">
        {/* Add Faculty Form */}
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">Add New Faculty</h2>
          <InputField name="name" placeholder="Enter Faculty Name" value={addForm.name} onChange={handleAddChange} required />
          <InputField name="facultyId" placeholder="Enter Faculty ID" value={addForm.facultyId} onChange={handleAddChange} required />
          <InputField name="email" type="email" placeholder="Enter Email" value={addForm.email} onChange={handleAddChange} required />
          <InputField name="password" type="password" placeholder="Enter Password" value={addForm.password} onChange={handleAddChange} required />
          <InputField name="address" placeholder="Enter Address" value={addForm.address} onChange={handleAddChange} required />
          <InputField name="designation" placeholder="Enter Designation" value={addForm.designation} onChange={handleAddChange} required />
          <ActionButton type="submit" variant="add" disabled={loading || !token}>
            {loading ? "Adding..." : "Add Faculty"}
          </ActionButton>
        </form>

        {/* Remove Faculty Form */}
        <form onSubmit={handleRemoveSubmit} className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">Remove Faculty</h2>
          <InputField
            placeholder="Enter Faculty ID to remove"
            value={removeId}
            onChange={(e) => setRemoveId(e.target.value)}
            onBlur={handleFetchFacultyName}
            required
          />
          <InputField placeholder="Name (Auto-fetched)" value={removeName} disabled />
          <ActionButton type="submit" variant="remove" disabled={removeLoading || !removeName || !token}>
            {removeLoading ? "Removing..." : "Remove Faculty"}
          </ActionButton>
        </form>
      </div>

      {/* Teacher Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <TeacherTable faculty={facultyList} />
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AddRemoveFaculty;