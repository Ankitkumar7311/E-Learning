import React from "react";

const InputField = ({ type = "text", placeholder, disabled = false }) => (
  <input
    type={type}
    placeholder={placeholder}
    disabled={disabled}
    className={`px-3 py-2 rounded bg-blue-100 outline-none focus:ring-2 focus:ring-blue-400 ${
      disabled ? "opacity-70 cursor-not-allowed" : ""
    }`}
  />
);

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-yellow-500 text-white font-medium rounded px-6 py-2 hover:bg-yellow-600 transition duration-300 shadow"
  >
    {children}
  </button>
);

const Add = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-10 p-6">
      {/* Top Section (Grid Layout for Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Student Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-sm">
          <h2 className="font-semibold text-gray-700 mb-4 text-lg">Add Student</h2>
          <div className="flex flex-col space-y-3">
            <InputField placeholder="Enter Name" />
            <InputField placeholder="Enter Id" />
            <InputField type="email" placeholder="Enter Email" />
            <InputField placeholder="Enter Branch" />
            <InputField placeholder="Enter Year" />
            <InputField type="password" placeholder="Enter Password" />
            <Button>Add</Button>
          </div>
        </div>

        {/* Remove Student Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-sm">
          <h2 className="font-semibold text-gray-700 mb-4 text-lg">Remove Student</h2>
          <div className="flex flex-col space-y-3">
            <InputField placeholder="Enter Roll Number" />
            <InputField placeholder="Name (Auto)" disabled />
            <Button>Remove</Button>
          </div>
        </div>
      </div>

      {/* View Student List */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <Button>View Student List</Button>
      </div>
    </div>
  );
};

export default Add;
