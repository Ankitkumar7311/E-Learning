import React, { useState } from 'react';

const App = () => {
  const [course, setCourse] = useState('');
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [regStatus, setRegStatus] = useState('');
  const [verification, setVerification] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [isMasterList, setIsMasterList] = useState(false);

  const handleSearch = () => {
    console.log("Search by List:", { course, batch, branch });
  };

  const handleFilter = () => {
    console.log("Apply Filter:", { paymentStatus, regStatus, verification });
  };

  const handleSpecificSearch = () => {
    console.log("Specific Search:", { rollNumber, name, fatherName });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 space-y-6 border border-gray-200">
        
        {/* Header with Master List */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-gray-700">Search for students:</h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Master List</span>
            <input
              type="radio"
              checked={isMasterList}
              onChange={() => setIsMasterList(!isMasterList)}
              className="form-radio h-4 w-4 text-orange-500 rounded-full border-gray-300 focus:ring-orange-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Search by List Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Search by List:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              <option value="course1">Course 1</option>
              <option value="course2">Course 2</option>
            </select>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Batch</option>
              <option value="batch1">Batch 1</option>
              <option value="batch2">Batch 2</option>
            </select>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Apply Filter Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Apply Filter:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <select
              value={regStatus}
              onChange={(e) => setRegStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Reg. Status</option>
              <option value="registered">Registered</option>
              <option value="unregistered">Unregistered</option>
            </select>
            <select
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Verification</option>
              <option value="verified">Verified</option>
              <option value="notVerified">Not Verified</option>
            </select>
            <button
              onClick={handleFilter}
              className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Specific Search Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Specific Search:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name (Auto)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Father's Name"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSpecificSearch}
              className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
