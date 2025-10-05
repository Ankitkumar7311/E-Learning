import React, { useState, useEffect, useCallback } from "react";
import TeacherTable from "./TeacherTable";
import { useAuth } from "../../auth/AuthContext";

const API_BASE_URL = "http://localhost:8080/VidyaSarthi";

// ✅ Reusable Input Component
const InputField = ({ ...props }) => (
  <input
    {...props}
    className={`w-full h-[50px] p-3 border border-gray-300 rounded-2xl bg-blue-100 text-gray-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      ${props.disabled ? "opacity-70 cursor-not-allowed" : ""}`}
  />
);

// ✅ Reusable Button Component
const ActionButton = ({ children, disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    className={`w-full sm:w-[200px] h-[50px] bg-yellow-500 text-white font-bold rounded-[20px] 
      hover:bg-yellow-600 transition duration-300 shadow 
      ${disabled ? "opacity-50 cursor-not-allowed hover:bg-yellow-500" : ""}`}
  >
    {children}
  </button>
);

const AddRemoveFaculty = () => {
  const { token } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [addForm, setAddForm] = useState({
    name: "",
    facultyId: "",
    email: "",
    password: "",
  });
  const [removeId, setRemoveId] = useState("");
  const [removeName, setRemoveName] = useState("");

  // ✅ Fetch all faculty
  const fetchAllFaculty = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/facultyList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Error fetching faculty: ${response.status}`);
      const data = await response.json();
      // Adjust if API returns data object
      setFacultyList(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch faculty list.");
    }
  }, [token]);

  useEffect(() => {
    fetchAllFaculty();
  }, [fetchAllFaculty]);

  // ✅ Fetch faculty name by ID for remove form
  useEffect(() => {
    if (!token) return;
    if (!removeId.trim()) {
      setRemoveName("");
      return;
    }

    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/faculty/${removeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setRemoveName("Faculty not found");
          return;
        }
        const data = await response.json();
        setRemoveName(data.name || "Name not available");
      } catch (error) {
        setRemoveName("Error fetching name");
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [removeId, token]);

  // ✅ Handle input change for Add Form
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // ✅ Add Faculty
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.facultyId || !addForm.email || !addForm.password) {
      alert("Please fill all fields to add a faculty.");
      return;
    }
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/addNewTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      alert("Faculty added successfully!");
      setAddForm({ name: "", facultyId: "", email: "", password: "" });
      fetchAllFaculty();
    } catch (error) {
      console.error(error);
      alert("Failed to add faculty.");
    }
  };

  // ✅ Remove Faculty
  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!removeId) {
      alert("Please enter a Faculty ID to remove.");
      return;
    }
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/deleteFaculty/${facultyIdToRemove}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      alert("Faculty removed successfully!");
      setRemoveId("");
      setRemoveName("");
      fetchAllFaculty();
    } catch (error) {
      console.error(error);
      alert("Failed to remove faculty.");
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 p-6 flex flex-col items-center">
      <section className="w-full max-w-5xl flex flex-wrap justify-center gap-8 mb-10">
        {/* Add Faculty Form */}
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full sm:max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Add Faculty</h2>
          <div className="flex flex-col gap-y-5">
            <InputField name="name" placeholder="Enter Faculty Name" value={addForm.name} onChange={handleAddChange} required />
            <InputField name="facultyId" placeholder="Enter Faculty Id" value={addForm.facultyId} onChange={handleAddChange} required />
            <InputField name="email" type="email" placeholder="Enter Faculty Email" value={addForm.email} onChange={handleAddChange} required />
            <InputField name="password" type="password" placeholder="Enter Password" value={addForm.password} onChange={handleAddChange} required />
            <ActionButton type="submit" disabled={!token}>Add</ActionButton>
          </div>
        </form>

        {/* Remove Faculty Form */}
        <form onSubmit={handleRemoveSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full sm:max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Remove Faculty</h2>
          <div className="flex flex-col gap-y-5">
            <InputField placeholder="Enter Faculty ID to remove" value={removeId} onChange={(e) => setRemoveId(e.target.value)} required />
            <InputField placeholder="Name (Auto-fetched)" value={removeName} disabled />
            <ActionButton type="submit" disabled={!token}>Remove</ActionButton>
          </div>
        </form>
      </section>

      {/* Teacher Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <TeacherTable faculty={facultyList} />
        </div>
      </div>
    </div>
  );
};

export default AddRemoveFaculty;
