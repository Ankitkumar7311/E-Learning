import React, { useState, useEffect, useCallback } from "react";
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

const StudentTable = () => {
  const auth = useAuth?.() || {};
  const authToken = auth?.token || null;

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [error, setError] = useState("");

  const rowsPerPage = 10;
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const delayBetweenPhrases = 1500;

  useEffect(() => {
    if (!isSearchActive) {
      setPlaceholder("");
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

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = authToken || readToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_BASE}/studentList`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to fetch students (${response.status})`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setError(error.message);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const handleUpdate = () => {
      console.log("Students updated event received");
      fetchStudents();
    };
    window.addEventListener("studentsUpdated", handleUpdate);
    return () => {
      window.removeEventListener("studentsUpdated", handleUpdate);
    };
  }, [fetchStudents]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredStudents = students.filter((student) => {
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

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading students</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchStudents}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Student List</h2>

        <div className="relative h-11 w-full sm:w-64 [perspective:1000px]">
          <div
            className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
              isSearchActive ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div className="absolute w-full h-full [backface-visibility:hidden]">
              <button
                onClick={() => setIsSearchActive(true)}
                className="w-11 h-11 ml-auto flex items-center justify-center rounded-full bg-blue-100 text-gray-500 hover:text-yellow-600 focus:outline-none border-2 border-yellow-300 transition-colors duration-300"
                aria-label="Open search bar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="relative w-full h-full">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={() => {
                    if (!searchQuery) setIsSearchActive(false);
                  }}
                  className="w-full h-11 pl-5 pr-12 rounded-full outline-none bg-blue-100 placeholder:text-black border-2 border-yellow-500 shadow-md text-sm sm:text-base"
                />
                <button
                  onClick={() => setIsSearchActive(false)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-gray-500 hover:text-blue-500"
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

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow-lg">
        <div className="min-w-[600px] sm:min-w-[700px]">
          <table className="w-full table-fixed text-sm sm:text-base">
            <thead className="bg-yellow-500 text-white">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={col}
                    className={`p-2 sm:p-3 text-center font-semibold ${
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
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                      <span className="ml-3">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                    {searchQuery ? "No students found matching your search." : "No students found."}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.studentId || idx}
                    className={`${idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-200 transition`}
                  >
                    <td className="px-3 sm:px-4 py-2 text-center border-r-3 border-white">{row.studentId}</td>
                    <td className="px-3 sm:px-4 py-2 text-center border-r-3 border-white">{row.name}</td>
                    <td className="px-3 sm:px-4 py-2 text-center border-r-3 border-white break-all">{row.email}</td>
                    <td className="px-3 sm:px-4 py-2 text-center border-r-3 border-white">{row.branch}</td>
                    <td className="px-3 sm:px-4 py-2 text-center border-r-3 border-white">{row.year}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition w-full sm:w-auto"
          >
            Previous
          </button>
          <span className="font-semibold text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
