import React, { useState, useEffect, useCallback } from "react";

const TeacherTable = () => {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  
  const rowsPerPage = 10;
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const delayBetweenPhrases = 1500;

  // --- Effect for Typing Animation (Unchanged) ---
  useEffect(() => {
    if (!isSearchActive) {
      setPlaceholder('');
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

  // Function to fetch faculty data (Unchanged)
  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/VidyaSarthi/getListByRole/Faculty");
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

  useEffect(() => { fetchFaculty(); }, [fetchFaculty]);
  useEffect(() => {
    const handleUpdate = () => { fetchFaculty(); };
    window.addEventListener('facultyUpdated', handleUpdate);
    return () => window.removeEventListener('facultyUpdated', handleUpdate);
  }, [fetchFaculty]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredFaculty = faculty.filter(member => {
    const query = searchQuery.toLowerCase();
    const facultyId = String(member.facultyId).toLowerCase();
    const email = member.email.toLowerCase();
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Faculty List</h2>
        
        {/* --- 3D Flipping Search Bar --- */}
        <div className="relative h-11 w-64 [perspective:1000px]">
          <div 
            className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isSearchActive ? '[transform:rotateY(180deg)]' : ''}`}
          >
            {/* Front Side: Search Icon */}
            <div className="absolute w-full h-full [backface-visibility:hidden]">
              <button
                onClick={() => setIsSearchActive(true)}
                className={`w-11 h-11 ml-auto flex items-center justify-center rounded-full bg-blue-100 
                           text-gray-500 hover:text-yellow-600 focus:outline-none 
                           border-2 border-yellow-300 transition-colors duration-300`}
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
                  onChange={handleSearchChange}
                  onBlur={() => { if (!searchQuery) setIsSearchActive(false); }}
                  className={`w-full h-11 pl-5 pr-12 rounded-full outline-none bg-blue-100
                              placeholder:text-black border-2 border-yellow-500 shadow-md`}
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
      
      <div className="overflow-x-auto rounded-lg shadow-lg">
        {/* Table remains unchanged */}
        <table className="w-full table-fixed">
          <thead className="bg-yellow-500 text-white">
            <tr>
              {columns.map((col, index) => (
                <th key={col} className={`p-3 text-center font-semibold ${index < columns.length - 1 ? 'border-r-3 border-white' : ''}`}>
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
                  <td className="px-4 py-2 text-center border-r-3 border-white min-w-[120px]">{row.facultyId}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white min-w-[200px]">{row.name}</td>
                  <td className="px-4 py-2 text-center border-r-3 border-white min-w-[250px]">{row.email}</td>
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