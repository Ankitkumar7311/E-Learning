import React, { useState, useEffect } from "react";
import StudentTable from "./StudentTable";
import { useAuth } from "../../context/AuthContext";

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

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

// Improved Modal Component
const Modal = ({ message, type = "success", onClose }) => {
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-50" : "bg-red-50";
  const borderColor = isSuccess ? "border-green-400" : "border-red-400";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const iconBg = isSuccess ? "bg-green-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`${bgColor} border-l-4 ${borderColor} rounded-lg shadow-2xl max-w-md w-full animate-fadeIn`}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={`${iconBg} rounded-full p-2 flex-shrink-0`}>
              {isSuccess ? (
                <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${textColor} mb-1`}>
                {isSuccess ? "Success!" : "Error"}
              </h3>
              <p className={`text-sm ${textColor}`}>{message}</p>
            </div>

            <button
              onClick={onClose}
              className={`${textColor} hover:opacity-70 transition duration-200 flex-shrink-0`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                isSuccess 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ name, value, onChange, onBlur, type = "text", placeholder, disabled = false }) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    type={type}
    placeholder={placeholder}
    disabled={disabled}
    className={`px-3 py-2 rounded bg-blue-100 outline-none focus:ring-2 focus:ring-blue-400 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`}
  />
);

const Button = ({ children, type = "submit", variant = 'add', disabled = false }) => (
  <button
    type={type}
    disabled={disabled}
    className={`text-white font-medium rounded px-6 py-2 transition duration-300 shadow ${
      variant === 'add' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const Add = () => {
  const auth = useAuth?.() || {};
  const authToken = auth?.token || null;
  
  const initialFormState = { name: "", studentId: "", email: "", branch: "", year: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [studentIdToRemove, setStudentIdToRemove] = useState('');
  const [studentNameToRemove, setStudentNameToRemove] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchStudents = async () => {
    try {
      const token = authToken || readToken();
      const response = await fetch(`${API_BASE}/studentList`, {
        method: "GET",
        headers: { 
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Fetch students error:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.values(formData).some(field => field === "")) {
      setModal({ type: "error", message: "Please fill out all fields before submitting." });
      return;
    }

    setLoading(true);
    try {
      const token = authToken || readToken();

      const response = await fetch(`${API_BASE}/addStudent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text().catch(() => "");

      if (!response.ok) {
        throw new Error(text || `Failed to add student (${response.status})`);
      }

      setModal({ 
        type: "success", 
        message: `${formData.name} (${formData.studentId}) has been successfully added to the system!` 
      });
      setFormData(initialFormState);
      await fetchStudents();
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    } catch (error) {
      console.error("Failed to add student:", error);
      setModal({ type: "error", message: error.message || "Failed to add student. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStudentName = () => {
    if (!studentIdToRemove) {
      setStudentNameToRemove('');
      return;
    }

    const student = students.find(s => String(s.studentId) === String(studentIdToRemove));
    if (student) {
      setStudentNameToRemove(student.name);
    } else {
      setStudentNameToRemove('');
      setModal({ type: "error", message: `Student with ID "${studentIdToRemove}" not found.` });
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentIdToRemove || !studentNameToRemove) {
      setModal({ type: "error", message: "Please enter a valid Student ID and fetch the student's name first." });
      return;
    }

    setRemoveLoading(true);
    try {
      const token = authToken || readToken();

      const response = await fetch(`${API_BASE}/deleteStudent/${studentIdToRemove}`, {
        method: "DELETE",
        headers: { 
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

      const text = await response.text().catch(() => "");

      if (!response.ok) {
        throw new Error(text || `Failed to remove student (${response.status})`);
      }

      setModal({ 
        type: "success", 
        message: `${studentNameToRemove} (${studentIdToRemove}) has been successfully removed from the system.` 
      });
      setStudentIdToRemove('');
      setStudentNameToRemove('');
      await fetchStudents();
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    } catch (error) {
      console.error("Failed to remove student:", error);
      setModal({ type: "error", message: error.message || "Failed to remove student. Please try again." });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50 p-6 flex flex-col items-center">
      {modal && (
        <Modal 
          message={modal.message} 
          type={modal.type} 
          onClose={() => setModal(null)} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Add Student Card */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <form onSubmit={handleAddSubmit} className="flex flex-col space-y-3">
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">Add New Student</h2>
            <InputField name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter Name" />
            <InputField name="studentId" value={formData.studentId} onChange={handleInputChange} placeholder="Enter Student ID" />
            <InputField name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter Email" />
            <InputField name="branch" value={formData.branch} onChange={handleInputChange} placeholder="Enter Branch (e.g., CSE)" />
            <InputField name="year" value={formData.year} onChange={handleInputChange} placeholder="Enter Year (e.g., 2026)" />
            <InputField name="password" value={formData.password} onChange={handleInputChange} type="password" placeholder="Enter Password" />
            <Button type="submit" variant="add" disabled={loading}>
              {loading ? "Adding..." : "Add Student"}
            </Button>
          </form>
        </div>

        {/* Remove Student Card */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <form onSubmit={handleRemoveSubmit} className="flex flex-col space-y-3">
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">Remove Student</h2>
            <InputField 
              name="studentIdToRemove"
              value={studentIdToRemove}
              onChange={(e) => setStudentIdToRemove(e.target.value)}
              onBlur={handleFetchStudentName}
              placeholder="Enter Student ID" 
            />
            <InputField 
              name="studentNameToRemove"
              value={studentNameToRemove}
              placeholder="Student name will appear here" 
              disabled
            />
            <Button type="submit" variant="remove" disabled={removeLoading}>
              {removeLoading ? "Removing..." : "Remove Student"}
            </Button>
          </form>
        </div>
      </div>

      {/* Scrollable Student Table */}
      <div className="w-full overflow-x-auto mt-8">
        <div className="min-w-[700px]">
          <StudentTable />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Add;