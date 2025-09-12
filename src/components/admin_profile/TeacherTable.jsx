import React, { useState, useEffect, useCallback } from "react";

const TeacherTable = () => {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Function to fetch faculty data
  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      // NOTE: This assumes you have a GET endpoint that returns a list of all faculty
      const response = await fetch("http://localhost:8080/VidyaSarthi/facultyList");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setFaculty(data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
      setFaculty([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch data on initial component load
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  // Effect to listen for the custom event from the AddRemoveFaculty component
  useEffect(() => {
    const handleUpdate = () => {
      fetchFaculty();
    };

    window.addEventListener('facultyUpdated', handleUpdate);

    return () => {
      window.removeEventListener('facultyUpdated', handleUpdate);
    };
  }, [fetchFaculty]);


  const columns = ["Faculty ID", "Name", "Email"];
  const totalPages = Math.ceil(faculty.length / rowsPerPage);
  const paginatedData = faculty.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Faculty List</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full">
          <thead className="bg-yellow-500 text-white">
            <tr>
              {columns.map((col, index) => (
                // Added border styling to header cells
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
              <tr><td colSpan={columns.length} className="p-4 text-center text-gray-500">No faculty found.</td></tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={row.facultyId || idx} className={`${idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-200 transition`}>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.facultyId}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.name}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white">{row.email}</td>
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

export default TeacherTable;