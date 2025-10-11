import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TeacherTable = ({ faculty, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  const rowsPerPage = 10;
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const delayBetweenPhrases = 1500;

  // Typing animation for placeholder
  useEffect(() => {
    if (!isSearchActive) {
      setPlaceholder("");
      return;
    }

    const placeholders = ["Search by Email...", "Search by Faculty ID..."];
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredFaculty = Array.isArray(faculty)
    ? faculty.filter((member) => {
        const query = searchQuery.toLowerCase();
        const facultyId = String(member.facultyId || "").toLowerCase();
        const email = String(member.email || "").toLowerCase();
        return facultyId.includes(query) || email.includes(query);
      })
    : [];

  const columns = ["Faculty ID", "Name", "Email", "Address", "Designation"];
  const totalPages = Math.ceil(filteredFaculty.length / rowsPerPage);
  const paginatedData = filteredFaculty.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-4 sm:p-6 w-full overflow-hidden">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Faculty List</h2>

        {/* 3D Search Bar */}
        <div className="relative h-11 w-full sm:w-64 [perspective:1000px]">
          <div
            className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
              isSearchActive ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Search Button Side */}
            <div className="absolute w-full h-full [backface-visibility:hidden]">
              <button
                onClick={() => setIsSearchActive(true)}
                className="w-11 h-11 ml-auto flex items-center justify-center rounded-full bg-blue-100 text-gray-500 hover:text-yellow-600 focus:outline-none border-2 border-yellow-300 transition-colors duration-300"
                aria-label="Open search bar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Input Side */}
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
                  className="w-full h-11 pl-5 pr-12 rounded-full outline-none bg-blue-100 placeholder:text-black border-2 border-yellow-500 shadow-md"
                />
                <button
                  onClick={() => setIsSearchActive(false)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-gray-500 hover:text-blue-500"
                  aria-label="Close search bar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-yellow-500 text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col}
                  className={`p-3 text-center font-semibold text-sm sm:text-base ${
                    index < columns.length - 1 ? "border-r-2 border-yellow-400" : ""
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
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    <span className="ml-3">Loading faculty...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  {searchQuery
                    ? `No results found for "${searchQuery}".`
                    : "No faculty data available."}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.facultyId || idx}
                  className={`${
                    idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"
                  } hover:bg-blue-200 transition`}
                >
                  <td className="px-3 py-2 text-center border-r-2 border-white break-words">
                    {row.facultyId}
                  </td>
                  <td className="px-3 py-2 text-center border-r-2 border-white break-words">
                    {row.name}
                  </td>
                  <td className="px-3 py-2 text-center border-r-2 border-white break-words">
                    {row.email}
                  </td>
                  <td className="px-3 py-2 text-center border-r-2 border-white break-words">
                    {row.address}
                  </td>
                  <td className="px-3 py-2 text-center break-words">
                    {row.designation}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <span className="text-sm text-gray-600">
            Showing {paginatedData.length} of {filteredFaculty.length} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <span className="font-semibold text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

TeacherTable.propTypes = {
  faculty: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default TeacherTable;
