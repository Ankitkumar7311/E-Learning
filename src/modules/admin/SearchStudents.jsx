import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "./StudentTable";

const App = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    course: "",
    batch: "",
    branch: "",
    paymentStatus: "",
    regStatus: "",
    verification: "",
    rollNumber: "",
    name: "",
    fatherName: "",
    isMasterList: false,
  });

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Search by List:", {
      course: filters.course,
      batch: filters.batch,
      branch: filters.branch,
    });
navigate("/admin/dashboard/student-profile"); //  Full path
  };

  const handleFilter = () => {
    console.log("Apply Filter:", {
      paymentStatus: filters.paymentStatus,
      regStatus: filters.regStatus,
      verification: filters.verification,
    });
    navigate("/student-profile");
  };

  const handleSpecificSearch = () => {
    console.log("Specific Search:", {
      rollNumber: filters.rollNumber,
      name: filters.name,
      fatherName: filters.fatherName,
    });
    navigate("/student-profile");
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 inset-shadow-sm inset-shadow-indigo-500 hover:bg-blue-200 bg-[#D8E7F5]";

  const buttonClass =
    "px-4 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200";

  return (
    <>
      <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 font-sans">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 space-y-6 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800">
              Search for students:
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                checked={filters.isMasterList}
                onChange={() =>
                  handleChange("isMasterList", !filters.isMasterList)
                }
                className="form-radio h-4 w-4 text-orange-500 rounded-full border-gray-300 focus:ring-orange-500 cursor-pointer"
              />
              <span className="text-lg font-medium text-gray-800">
                Master List
              </span>
            </div>
          </div>

          {/* Search by List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Search by List:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <select
                value={filters.course}
                onChange={(e) => handleChange("course", e.target.value)}
                className={inputClass}
              >
                <option value="">Select Course</option>
                <option value="course1">Course 1</option>
                <option value="course2">Course 2</option>
              </select>
              <select
                value={filters.batch}
                onChange={(e) => handleChange("batch", e.target.value)}
                className={inputClass}
              >
                <option value="">Select Batch</option>
                <option value="batch1">Batch 1</option>
                <option value="batch2">Batch 2</option>
              </select>
              <select
                value={filters.branch}
                onChange={(e) => handleChange("branch", e.target.value)}
                className={inputClass}
              >
                <option value="">Select Branch</option>
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
              </select>
              <button
                onClick={handleSearch}
                className={`${buttonClass} flex items-center justify-center space-x-2`}
              >
                <span>Search</span>
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
          </div>

          {/* Apply Filter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Apply Filter:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleChange("paymentStatus", e.target.value)}
                className={inputClass}
              >
                <option value="">Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <select
                value={filters.regStatus}
                onChange={(e) => handleChange("regStatus", e.target.value)}
                className={inputClass}
              >
                <option value="">Reg. Status</option>
                <option value="registered">Registered</option>
                <option value="unregistered">Unregistered</option>
              </select>
              <select
                value={filters.verification}
                onChange={(e) => handleChange("verification", e.target.value)}
                className={inputClass}
              >
                <option value="">Verification</option>
                <option value="verified">Verified</option>
                <option value="notVerified">Not Verified</option>
              </select>
              <button onClick={handleFilter} className={buttonClass}>
                Apply
              </button>
            </div>
          </div>

          {/* Specific Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              Specific Search:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <input
                type="text"
                placeholder="Enter Roll Number"
                value={filters.rollNumber}
                onChange={(e) => handleChange("rollNumber", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Name (Auto)"
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
        </div>
      </div>
      <StudentTable />
    </>
  );
};

export default App;
