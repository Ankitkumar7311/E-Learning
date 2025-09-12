import React, { useState, useEffect, useCallback } from "react";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false); // For search bar animation
  const rowsPerPage = 10;

  // Function to fetch student data (Unchanged)
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/VidyaSarthi/studentList");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch data on initial component load (Unchanged)
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Effect to listen for the custom event from the Add component (Unchanged)
  useEffect(() => {
    const handleUpdate = () => {
      fetchStudents();
    };

    window.addEventListener('studentsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('studentsUpdated', handleUpdate);
    };
  }, [fetchStudents]);

  // Handle search input change and reset page
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when a new filter is applied
  };

  // Filter students based on search query (ID and Email)
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    const studentId = String(student.studentId).toLowerCase();
    const email = student.email.toLowerCase();
    return studentId.includes(query) || email.includes(query);
  });

  const columns = ["Student ID", "Name", "Email", "Branch", "Year"];
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Student List</h2>
        
        {/* --- Search Bar --- */}
        <div className="relative flex items-center">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(searchQuery !== "")}
            className={`
              h-10 pl-10 pr-4 rounded-full outline-none
              transition-all duration-300 ease-in-out 
              focus:ring-2 focus:ring-yellow-500
              ${isSearchActive || searchQuery ? 'w-64 bg-white shadow-md' : 'w-10 bg-transparent cursor-pointer'}
            `}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full">
          <thead className="bg-yellow-500 text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col}
                  className={`p-3 text-center font-semibold ${index < columns.length - 1 ? 'border-r-3 border-white' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length} className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length} className="p-4 text-center text-gray-500">No students found.</td></tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={row.studentId || idx} className={`${idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-200 transition`}>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.studentId}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.name}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.email}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.branch}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">Previous</button>
          <span className="font-semibold">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">Next</button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;