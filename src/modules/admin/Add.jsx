import React, { useState } from "react";
import StudentTable from "./StudentTable";

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

const Button = ({ children, type = "submit", variant = 'add' }) => (
  <button
    type={type}
    className={`text-white font-medium rounded px-6 py-2 transition duration-300 shadow ${
      variant === 'add' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'
    }`}
  >
    {children}
  </button>
);

const Add = () => {
  const initialFormState = { name: "", studentId: "", email: "", branch: "", year: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [studentIdToRemove, setStudentIdToRemove] = useState('');
  const [studentNameToRemove, setStudentNameToRemove] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some(field => field === "")) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // 🔑 get token
      const response = await fetch("http://localhost:8080/VidyaSarthi/addStudent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      alert("Student added successfully!");
      setFormData(initialFormState);
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Error adding student. Please check the console.");
    }
  };

  const handleFetchStudentName = async () => {
    if (!studentIdToRemove) {
      setStudentNameToRemove('');
      return;
    }
    setStudentNameToRemove('Loading...');
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/VidyaSarthi/student/${studentIdToRemove}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Student not found');
      const data = await response.json();
      setStudentNameToRemove(data.name || 'Name not found');
    } catch (error) {
      console.error("Failed to fetch student name:", error);
      setStudentNameToRemove('');
      alert(error.message);
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!studentIdToRemove || !studentNameToRemove || studentNameToRemove === 'Loading...') {
      alert("Please enter a valid Student ID and fetch the student's name first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/VidyaSarthi/deleteStudent/${studentIdToRemove}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      alert("Student removed successfully!");
      setStudentIdToRemove('');
      setStudentNameToRemove('');
      window.dispatchEvent(new CustomEvent('studentsUpdated'));
    } catch (error) {
      console.error("Failed to remove student:", error);
      alert("Error removing student. Please check the console.");
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50 p-6 flex flex-col items-center">
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
            <Button type="submit" variant="add">Add Student</Button>
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
            <Button type="submit" variant="remove">Remove Student</Button>
          </form>
        </div>
      </div>

      {/* ✅ Scrollable Student Table */}
      <div className="w-full overflow-x-auto mt-8">
        <div className="min-w-[700px]">
          <StudentTable />
        </div>
      </div>
    </div>
  );
};

export default Add;
