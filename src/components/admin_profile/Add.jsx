// src/App.jsx
import React from "react";

const  Add=()=> {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white space-y-10">
      
      {/* Top Section */}
      
      <div className="flex space-x-8">
        {/* Add Student Card */}
        <div className="bg-white shadow-md rounded-lg p-6 w-64">
          <div className="flex flex-col space-y-3 gap-2">
            <h2 className="font-medium text-gray-700 mb-4">Add Student:</h2>
            <input
              type="text"
              placeholder="Enter Name"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <input
              type="text"
              placeholder="Enter Id"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <input
              type="email"
              placeholder="Enter Email"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <input
              type="text"
              placeholder="Enter Branch"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <input
              type="text"
              placeholder="Enter Year"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <input
              type="password"
              placeholder="Enter Password"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <button className="bg-yellow-500 text-white font-medium rounded px-4 py-2 hover:bg-yellow-600">
              Add
            </button>
          </div>
        </div>

        {/* Remove Student Card */}
        <div className="bg-white shadow-md rounded-lg p-6 w-64">
          <h2 className="font-medium text-gray-700 mb-4">Remove Student:</h2>
          <div className="flex flex-col space-y-3 gap-2 ">
            <input
              type="text"
              placeholder="Enter Roll Number"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
            />
            <input
              type="text"
              placeholder="Name (Auto)"
              className="px-3 py-2 rounded bg-blue-100 outline-none"
              disabled
            />
            <button className="bg-yellow-500 text-white font-medium rounded px-4 py-2 hover:bg-yellow-600">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* View Student List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <button className="bg-yellow-500 text-white font-medium rounded px-6 py-3 hover:bg-yellow-600">
          View Student List
        </button>
      </div>
    </div>
  );
}

export default Add;
