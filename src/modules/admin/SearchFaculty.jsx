import React, { useState } from "react";

const SearchStudents = () => {
  const [filters, setFilters] = useState({
    semesters: "",
    batch: "",
    branch: "",
    rollNumber: "",
    name: "",
    fatherName: "",
    isMasterList: false,
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // -------- Search by List / Master List --------
  const handleSearch = async () => {
    try {
      setLoading(true);

      const body = {
        semesters: filters.semesters ? [filters.semesters] : [],
        years: filters.batch ? [Number(filters.batch)] : [],
        branches: filters.branch ? [filters.branch] : [],
      };

      let url = "";
      let options = {};

      if (filters.isMasterList) {
        url = `http://localhost:8080/VidyaSarthi/studentList?years=${body.years.join(
          ","
        )}&branches=${body.branches.join(",")}&semesters=${body.semesters.join(",")}`;
        options = { method: "GET" };
      } else {
        url = "http://localhost:8080/VidyaSarthi/searchStudentByFilter";
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        };
      }

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error fetching students. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // -------- Specific Search --------
  const handleSpecificSearch = async () => {
    try {
      setLoading(true);
      let url = "";

      if (filters.rollNumber) {
        url = `http://localhost:8080/VidyaSarthi/searchByStudentId/${filters.rollNumber}`;
      } else {
        url = `http://localhost:8080/VidyaSarthi/searchByStudent?name=${filters.name}&fatherName=${filters.fatherName}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch student");

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching student:", error);
      alert("Error fetching student. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-200 bg-[#D8E7F5]";
  const buttonClass =
    "px-4 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200";

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 space-y-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search for students:
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isMasterList}
              onChange={() =>
                handleChange("isMasterList", !filters.isMasterList)
              }
              className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
            />
            <span className="text-lg font-medium text-gray-800">Master List</span>
          </div>
        </div>

        {/* Search by List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Search by List:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <select
              value={filters.semesters}
              onChange={(e) => handleChange("semesters", e.target.value)}
              className={inputClass}
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester-{i + 1}
                </option>
              ))}
            </select>

            <select
              value={filters.batch}
              onChange={(e) => handleChange("batch", e.target.value)}
              className={inputClass}
            >
              <option value="">Select Year</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>

            <select
              value={filters.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
              className={inputClass}
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
            </select>

            <button onClick={handleSearch} className={buttonClass}>
              Search
            </button>
          </div>
        </div>

        {/* Specific Search */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Specific Search:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input
              type="text"
              placeholder="Enter Student-Id"
              value={filters.rollNumber}
              onChange={(e) => handleChange("rollNumber", e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Name"
              value={filters.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Father's Name"
              value={filters.fatherName}
              onChange={(e) => handleChange("fatherName", e.target.value)}
              className={inputClass}
            />
            <button onClick={handleSpecificSearch} className={buttonClass}>
              Apply
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="mt-6">
          {loading ? (
            <p className="text-blue-600 font-semibold">Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-white rounded-lg shadow-md bg-white">
                <thead className="bg-yellow-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left border border-white">Student Id</th>
                    <th className="px-4 py-2 text-left border border-white">Name</th>
                    <th className="px-4 py-2 text-left border border-white">Branch</th>
                    <th className="px-4 py-2 text-left border border-white">Semester</th>
                    <th className="px-4 py-2 text-left border border-white">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-blue-100" : "bg-white"}
                    >
                      <td className="px-4 py-2 border border-white">
                        {student.studentId || "—"}
                      </td>
                      <td className="px-4 py-2 border border-white">
                        {student.name || "—"}
                      </td>
                      <td className="px-4 py-2 border border-white">
                        {student.branch || "—"}
                      </td>
                      <td className="px-4 py-2 border border-white">
                        {student.semester || "—"}
                      </td>
                      <td className="px-4 py-2 border border-white">
                        {student.year || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchStudents;