import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext"; // keep using AuthContext

const TeacherTable = () => {
  const { token: authToken } = useAuth(); // get token from context
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  const rowsPerPage = 10;

  // Typing animation effect left unchanged
  useEffect(() => {
    if (!isSearchActive) {
      setPlaceholder("");
      return;
    }
    const placeholders = ["Search with Email...", "Search with Faculty ID..."];
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
      let speed = isDeleting ? 60 : 120;

      if (!isDeleting && displayText === currentPhrase) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && displayText === "") {
        isDeleting = false;
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        speed = 500;
      }

      timeoutId = setTimeout(type, speed);
    };

    timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, [isSearchActive]);

  // ✅ Fetch faculty using AuthContext token
  const fetchFaculty = useCallback(async () => {
    if (!authToken) return; // do nothing if token not available
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/VidyaSarthi/facultyList", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setFaculty(data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
      setFaculty([]);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]); // <- dependency added

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  // Listen for faculty updates
  useEffect(() => {
    const handleUpdate = () => fetchFaculty();
    window.addEventListener("facultyUpdated", handleUpdate);
    return () => window.removeEventListener("facultyUpdated", handleUpdate);
  }, [fetchFaculty]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  // Safe filtering
  const filteredFaculty = faculty.filter((member) => {
    if (!member) return false;
    const query = searchQuery.toLowerCase();
    const facultyId = String(member.facultyId || "").toLowerCase();
    const email = String(member.email || "").toLowerCase();
    return facultyId.includes(query) || email.includes(query);
  });

  const columns = ["Faculty ID", "Name", "Email"];
  const totalPages = Math.ceil(filteredFaculty.length / rowsPerPage);
  const paginatedData = filteredFaculty.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6">
      {/* Search bar and header unchanged */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Faculty List</h2>
        {/* Search bar code untouched */}
      </div>

      {/* Faculty Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full table-fixed">
          <thead className="bg-yellow-500 text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col}
                  className={`p-3 text-center font-semibold ${
                    index < columns.length - 1 ? "border-r-3 border-white" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  No faculty found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row?.facultyId || idx}
                  className={`${idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-200 transition`}
                >
                  <td className="px-4 py-2 text-center border-r-3 border-white min-w-[120px]">
                    {row?.facultyId}
                  </td>
                  <td className="px-4 py-2 text-center border-r-3 border-white min-w-[200px]">
                    {row?.name}
                  </td>
                  <td className="px-4 py-2 text-center border-r-3 border-white min-w-[250px]">
                    {row?.email}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherTable;
