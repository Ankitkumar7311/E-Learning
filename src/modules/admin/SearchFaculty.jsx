import React from "react";
import StudentTable from "./StudentTable"; // Assuming you're now using StudentTable
import { useNavigate } from "react-router-dom";

const TeacherSearch = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/admin/dashboard/teacher-profile");
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 p-6 flex flex-col gap-20 items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Search for Teacher:
          </h1>
          <div className="flex items-center space-x-2">
            <input type="radio" />
            <span className="text-lg font-medium text-gray-800">
              Master List
            </span>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Search by List Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Search by List:
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select className="flex-1 p-2 text-gray-700 bg-[#D8E7F5] border border-gray-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected hidden>
                Select Course
              </option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="reactjs">ReactJs</option>
              <option value="node_js">NodeJs</option>
              <option value="html_css">HTML/CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="databases">Databases</option>
              <option value="algorithms">Algorithms</option>
            </select>

            <select className="flex-1 p-2 text-gray-700 bg-[#D8E7F5] border border-gray-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected hidden>
                Select Batch
              </option>
              <option value="batch_a">Batch A</option>
              <option value="batch_b">Batch B</option>
              <option value="batch_c">Batch C</option>
            </select>

            <select className="flex-1 p-2 text-gray-700 bg-[#D8E7F5] border border-gray-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected hidden>
                Select Branch
              </option>
              <option value="branch_1">Branch 1</option>
              <option value="branch_2">Branch 2</option>
              <option value="branch_3">Branch 3</option>
            </select>

            <button
              onClick={handleSubmit}
              className="flex items-center justify-center w-[200px] h-[40px] px-6 text-lg font-medium text-white bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Search
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Specific Search Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Specific Search:
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter Roll Number"
              className="flex-1 p-2 text-gray-700 bg-[#D8E7F5] border border-gray-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name (Auto)"
              className="flex-1 p-2 text-gray-700 bg-[#D8E7F5] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center w-full sm:w-auto h-[40px] px-6 text-lg font-medium text-white bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Student Table with isolated scroll */}
      <div className="w-full max-w-4xl">
        <StudentTable />
      </div>
    </div>
  );
};

export default TeacherSearch;
