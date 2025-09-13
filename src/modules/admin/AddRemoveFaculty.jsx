import React, { useState, useEffect, useCallback } from "react";
import TeacherTable from "./TeacherTable"; // Make sure the path is correct

const API_BASE_URL = "http://localhost:8080/VidyaSarthi";

// Reusable Input Component
const InputField = ({ ...props }) => (
  <input
    {...props}
    className={`w-full h-[50px] p-3 border border-gray-300 rounded-2xl bg-blue-100 text-gray-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      ${props.disabled ? "opacity-70 cursor-not-allowed" : ""}`}
  />
);

// Reusable Button Component
const ActionButton = ({ children, ...props }) => (
  <button
    {...props}
    className={`w-[200px] h-[50px] bg-yellow-500 text-white font-bold rounded-[20px] 
    hover:bg-yellow-600 transition duration-300 shadow`}
  >
    {children}
  </button>
);

const AddRemoveFaculty = () => {
  // State for managing the list of all faculty
  const [facultyList, setFacultyList] = useState([]);

  // State for the "Add Faculty" form
  const [addForm, setAddForm] = useState({ name: "", facultyId: "", email: "", password: "" });
  
  // State for the "Remove Faculty" form
  const [removeId, setRemoveId] = useState("");
  const [removeName, setRemoveName] = useState("");

  // Fetches all faculty members from the database
  const fetchAllFaculty = useCallback(async () => {
    try {
      // NOTE: This assumes a GET endpoint at '/faculties' to fetch all faculty.
      const response = await fetch(`${API_BASE_URL}/faculties`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setFacultyList(data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
    }
  }, []);

  // Fetch the initial list when the component first loads
  useEffect(() => {
    fetchAllFaculty();
  }, [fetchAllFaculty]);

  // Fetches a single faculty's name when the removeId input changes
  useEffect(() => {
    const fetchNameById = async () => {
      if (removeId.trim()) {
        // NOTE: This assumes a GET endpoint at '/faculty/{id}' to fetch a single faculty.
        try {
            const response = await fetch(`${API_BASE_URL}/faculty/${removeId}`);
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
    const timerId = setTimeout(fetchNameById, 500); // Debounce to prevent rapid API calls
    return () => clearTimeout(timerId);
  }, [removeId]);


  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.facultyId || !addForm.email || !addForm.password) {
      alert("Please fill all fields to add a faculty.");
      return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/addFaculty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addForm),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        alert("Faculty added successfully!");
        await fetchAllFaculty(); 
        setAddForm({ name: "", facultyId: "", email: "", password: "" });
    } catch (error) {
        console.error("Failed to add faculty:", error);
        alert("Error: Could not add faculty.");
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!removeId) {
      alert("Please enter a Faculty ID to remove.");
      return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/deleteFaculty/${removeId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        alert("Faculty removed successfully!");
        await fetchAllFaculty();
        setRemoveId("");
        setRemoveName("");
    } catch (error) {
        console.error("Failed to remove faculty:", error);
        alert("Error: Could not remove faculty.");
    }
  };

  return (
    <>
      <section className="max-w-5xl mx-auto shadow rounded-xl p-8 bg-gray-100 flex flex-col items-center justify-center space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Faculty Form */}
          <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-2xl shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Faculty</h2>
            <div className="flex flex-col gap-y-5">
              <InputField name="name" placeholder="Enter Faculty Name" value={addForm.name} onChange={handleAddChange} required />
              <InputField name="facultyId" placeholder="Enter Faculty Id" value={addForm.facultyId} onChange={handleAddChange} required />
              <InputField name="email" type="email" placeholder="Enter Faculty Email" value={addForm.email} onChange={handleAddChange} required />
              <InputField name="password" type="password" placeholder="Enter Password" value={addForm.password} onChange={handleAddChange} required />
              <ActionButton type="submit">Add</ActionButton>
            </div>
          </form>

          {/* Remove Faculty Form */}
          <form onSubmit={handleRemoveSubmit} className="bg-white p-6 rounded-2xl shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Remove Faculty</h2>
            <div className="flex flex-col gap-y-5">
              <InputField placeholder="Enter Faculty ID to remove" value={removeId} onChange={(e) => setRemoveId(e.target.value)} required />
              <InputField placeholder="Name (Auto-fetched)" value={removeName} disabled />
              <ActionButton type="submit">Remove</ActionButton>
            </div>
          </form>
        </div>
      </section>

      {/* Render the TeacherTable and pass the faculty list state to it */}
      <TeacherTable faculty={facultyList} />
    </>
  );
};

export default AddRemoveFaculty;