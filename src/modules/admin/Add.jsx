import React, { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:8080/VidyaSarthi";

// Reusable Input Component
const InputField = ({ ...props }) => (
  <input
    {...props}
    className={`w-full h-[50px] p-3 border border-gray-300 rounded-2xl bg-blue-100 text-gray-700
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      ${props.disabled ? "opacity-70 cursor-not-allowed bg-gray-200" : ""}`}
  />
);

// Reusable Button Component
const ActionButton = ({ children, variant = 'add', ...props }) => (
  <button
    {...props}
    className={`w-full h-[50px] text-white font-bold rounded-[20px] 
    transition duration-300 shadow-md ${
      variant === 'add' 
        ? 'bg-yellow-500 hover:bg-yellow-600' 
        : 'bg-yellow-500 hover:bg-red-400'
    }`}
  >
    {children}
  </button>
);

// Student Table Component with responsive styles
const StudentTable = ({ students }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white table-auto">
      <thead className="bg-yellow-500 text-white">
        <tr>
          <th className="p-3 text-center font-semibold border-r-2 border-white whitespace-nowrap">Name</th>
          <th className="p-3 text-center font-semibold border-r-2 border-white whitespace-nowrap">Student ID</th>
          <th className="p-3 text-center font-semibold border-r-2 border-white whitespace-nowrap">Email</th>
          <th className="p-3 text-center font-semibold border-r-2 border-white whitespace-nowrap">Branch</th>
          <th className="p-3 text-center font-semibold whitespace-nowrap">Year</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {students && students.length > 0 ? (
          students.map((student, idx) => (
            <tr key={student.studentId} className={`${idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-200 transition`}>
              <td className="px-4 py-2 text-center border-r-2 border-white whitespace-nowrap">{student.name}</td>
              <td className="px-4 py-2 text-center border-r-2 border-white whitespace-nowrap">{student.studentId}</td>
              <td className="px-4 py-2 text-center border-r-2 border-white whitespace-nowrap">{student.email}</td>
              <td className="px-4 py-2 text-center border-r-2 border-white whitespace-nowrap">{student.branch}</td>
              <td className="px-4 py-2 text-center whitespace-nowrap">{student.year}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">
              No students found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);


const Add = () => {
  const initialFormState = { name: "", studentId: "", email: "", branch: "", year: "", password: "" };
  const [studentList, setStudentList] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [studentIdToRemove, setStudentIdToRemove] = useState('');
  const [studentNameToRemove, setStudentNameToRemove] = useState('');

  // State and Constants for the 3D Search Bar
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const delayBetweenPhrases = 1500;

  // Effect for Search Bar Typing Animation
  useEffect(() => {
    if (!isSearchActive) {
      setPlaceholder('');
      return;
    }

    const placeholders = ["Search with Email...", "Search with Student ID..."];
    let placeholderIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      const currentPhrase = placeholders[placeholderIndex];
      let displayText = isDeleting
        ? currentPhrase.substring(0, charIndex - 1)
        : currentPhrase.substring(0, charIndex + 1);

      setPlaceholder(displayText);
      charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
      let speed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && displayText === currentPhrase) {
        speed = delayBetweenPhrases;
        isDeleting = true;
      } else if (isDeleting && displayText === '') {
        isDeleting = false;
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        speed = 500;
      }
      
      timeoutId = setTimeout(type, speed);
    };

    timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, [isSearchActive]);

  const fetchAllStudents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getListByRole/Student`); 
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStudentList(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudentList([]); 
    }
  }, []);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  // Effect for auto-fetching student name when removing
  useEffect(() => {
    const fetchStudentName = async () => {
      if (studentIdToRemove.trim()) {
        try {
          const response = await fetch(`${API_BASE_URL}/searchByStudentId/${studentIdToRemove}`);
          if (!response.ok) {
            setStudentNameToRemove("Student not found");
            return;
          }
          const data = await response.json();
          setStudentNameToRemove(data.name || "Name not available");
        } catch (error) {
          console.error("Failed to fetch student name:", error);
          setStudentNameToRemove("Error fetching name");
        }
      } else {
        setStudentNameToRemove("");
      }
    };
    const timerId = setTimeout(fetchStudentName, 500);
    return () => clearTimeout(timerId);
  }, [studentIdToRemove]);

  // Effect for filtering students based on search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = studentList.filter(student =>
      (student.studentId?.toLowerCase() || '').includes(lowercasedQuery) ||
      (student.email?.toLowerCase() || '').includes(lowercasedQuery)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, studentList]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some(field => field === "")) {
      alert("Please fill out all fields to add a student.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      alert("Student added successfully!");
      setFormData(initialFormState);
      await fetchAllStudents();
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Error adding student. Please check the console.");
    }
  };
  
  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!studentIdToRemove) {
      alert("Please enter a Student ID to remove.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/deleteStudent/${studentIdToRemove}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      alert("Student removed successfully!");
      setStudentIdToRemove('');
      setStudentNameToRemove('');
      await fetchAllStudents();
    } catch (error) {
      console.error("Failed to remove student:", error);
      alert("Error removing student. Please check the console.");
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 p-6 flex flex-col items-center">
      <section className="w-full max-w-5xl flex flex-wrap justify-center gap-8 mb-10">
        {/* Add Student Form */}
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full sm:max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Add Student</h2>
          <div className="flex flex-col gap-y-5">
            <InputField name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter Name" required />
            <InputField name="studentId" value={formData.studentId} onChange={handleInputChange} placeholder="Enter Student ID" required />
            <InputField name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter Email" required />
            <InputField name="branch" value={formData.branch} onChange={handleInputChange} placeholder="Enter Branch (e.g., CSE)" required />
            <InputField name="year" value={formData.year} onChange={handleInputChange} placeholder="Enter Year (e.g., 2026)" required />
            <InputField name="password" value={formData.password} onChange={handleInputChange} type="password" placeholder="Enter Password" required />
            <ActionButton type="submit" variant="add">Add Student</ActionButton>
          </div>
        </form>

        {/* Remove Student Form */}
        <form onSubmit={handleRemoveSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full sm:max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Remove Student</h2>
          <div className="flex flex-col gap-y-5">
            <InputField 
              name="studentIdToRemove"
              value={studentIdToRemove}
              onChange={(e) => setStudentIdToRemove(e.target.value)}
              placeholder="Enter Student ID to remove" 
              required
            />
            <InputField 
              name="studentNameToRemove"
              value={studentNameToRemove}
              placeholder="Student name (Auto-fetched)" 
              disabled
            />
            <ActionButton type="submit" variant="remove">Remove Student</ActionButton>
          </div>
        </form>
      </section>

      {/* --- Student List Table Section --- */}
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Student List</h2>
          
          {/* 3D Flipping Search Bar */}
          <div className="relative h-11 w-64 [perspective:1000px]">
            <div 
              className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isSearchActive ? '[transform:rotateY(180deg)]' : ''}`}
            >
              {/* Front Side: Search Icon */}
              <div className="absolute w-full h-full [backface-visibility:hidden]">
                <button
                  onClick={() => setIsSearchActive(true)}
                  className={`w-11 h-11 ml-auto flex items-center justify-center rounded-full bg-blue-100 text-gray-500 hover:text-yellow-600 focus:outline-none border-2 border-yellow-300 transition-colors duration-300`}
                  aria-label="Open search bar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Back Side: Search Input */}
              <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="relative w-full h-full">
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsSearchActive(false); }}
                    className={`w-full h-11 pl-5 pr-12 rounded-full outline-none bg-blue-100 placeholder:text-black border-2 border-yellow-500 shadow-md`}
                  />
                  <button
                    onClick={() => setIsSearchActive(false)}
                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-yellow-500 hover:text-blue-400"
                    aria-label="Close search bar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="min-w-[700px] bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <StudentTable students={filteredStudents} />
        </div>
      </div>
    </div>
  );
};

export default Add;