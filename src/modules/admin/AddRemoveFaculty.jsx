import React, { useState, useEffect, useCallback } from "react";
import TeacherTable from "./TeacherTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:8080/VidyaSarthi";

// Reusable Input Component
const InputField = ({ ...props }) => (
  <input
    {...props}
    className={`w-full h-[45px] p-3 border border-gray-300 rounded-2xl bg-blue-100 text-gray-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      ${props.disabled ? "opacity-70 cursor-not-allowed" : ""}`}
  />
);

// Reusable Button Component
const ActionButton = ({ children, ...props }) => (
  <button
    {...props}
    className={`w-full sm:w-[150px] h-[45px] bg-yellow-500 text-white font-bold rounded-[20px] 
    hover:bg-yellow-600 transition duration-300 shadow`}
  >
    {children}
  </button>
);

const AddRemoveFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [addForm, setAddForm] = useState({ name: "", facultyId: "", email: "", password: "" });
  const [removeId, setRemoveId] = useState("");
  const [removeName, setRemoveName] = useState("");

  const fetchAllFaculty = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faculties`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setFacultyList(data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
      toast.error("Failed to fetch faculty.");
    }
  }, []);

  useEffect(() => {
    fetchAllFaculty();
  }, [fetchAllFaculty]);

  useEffect(() => {
    const fetchNameById = async () => {
      if (removeId.trim()) {
        try {
          const response = await fetch(`${API_BASE_URL}/searchByFacultyId/${removeId}`);
          if (!response.ok) {
            setRemoveName("Faculty not found");
            return;
          }
          const data = await response.json();
          setRemoveName(data.name || "Name not available");
        } catch (error) {
          setRemoveName("Error fetching name");
        }
      } else {
        setRemoveName("");
      }
    };
    const timerId = setTimeout(fetchNameById, 500);
    return () => clearTimeout(timerId);
  }, [removeId]);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.facultyId || !addForm.email || !addForm.password) {
      toast.error("Please fill all fields to add a faculty.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/addFaculty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success("Faculty added successfully!");
      await fetchAllFaculty();
      setAddForm({ name: "", facultyId: "", email: "", password: "" });
    } catch (error) {
      console.error("Failed to add faculty:", error);
      toast.error("Error: Could not add faculty.");
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!removeId) {
      toast.error("Please enter a Faculty ID to remove.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/deleteFaculty/${removeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success("Faculty removed successfully!");
      await fetchAllFaculty();
      setRemoveId("");
      setRemoveName("");
    } catch (error) {
      console.error("Failed to remove faculty:", error);
      toast.error("Error: Could not remove faculty.");
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 p-6 flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="w-full max-w-5xl flex flex-wrap justify-center gap-8 mb-10">
        {/* Add Faculty Form */}
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full sm:max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Add Faculty</h2>
          <div className="flex flex-col gap-y-5">
            <InputField name="name" placeholder="Enter Faculty Name" value={addForm.name} onChange={handleAddChange} required />
            <InputField name="facultyId" placeholder="Enter Faculty Id" value={addForm.facultyId} onChange={handleAddChange} required />
            <InputField name="email" type="email" placeholder="Enter Faculty Email" value={addForm.email} onChange={handleAddChange} required />
            <InputField name="password" type="password" placeholder="Enter Password" value={addForm.password} onChange={handleAddChange} required />
            <ActionButton type="submit">Add</ActionButton>
          </div>
        </form>

        {/* Remove Faculty Form */}
        <form onSubmit={handleRemoveSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full sm:max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Remove Faculty</h2>
          <div className="flex flex-col gap-y-5">
            <InputField placeholder="Enter Faculty ID to remove" value={removeId} onChange={(e) => setRemoveId(e.target.value)} required />
            <InputField placeholder="Name (Auto-fetched)" value={removeName} disabled />
            <ActionButton type="submit">Remove</ActionButton>
          </div>
        </form>
      </section>

      {/* Scrollable Teacher Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <TeacherTable faculty={facultyList} />
        </div>
      </div>
    </div>
  );
};

export default AddRemoveFaculty;
