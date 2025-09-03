import React from "react";

// Reusable Input Component
const InputField = ({ type = "text", placeholder, disabled = false }) => (
  <input
    type={type}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full h-[50px] p-3 border border-gray-300 rounded-2xl bg-blue-100 text-gray-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
  />
);

// Reusable Button Component
const ActionButton = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`w-[200px] h-[50px] bg-yellow-500 text-white font-bold rounded-[20px] 
    hover:bg-yellow-600 transition duration-300 shadow ${className}`}
  >
    {children}
  </button>
);

const AddRemoveFaculty = () => {
  return (
    <section className="min-h-screen max-w-5xl mx-auto shadow rounded-xl p-8 bg-gray-100 flex flex-col items-center justify-center space-y-10">
      {/* Add & Remove Faculty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Faculty */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Faculty</h2>
          <div className="flex flex-col gap-y-5">
            <InputField placeholder="Enter Faculty Name" />
            <InputField placeholder="Enter Faculty Id" />
            <InputField type="email" placeholder="Enter Faculty Email" />
            <InputField type="password" placeholder="Enter Password" />
            <ActionButton>Add</ActionButton>
          </div>
        </div>

        {/* Remove Faculty */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Remove Faculty</h2>
          <div className="flex flex-col gap-y-5">
            <InputField placeholder="Enter Roll Number" />
            <InputField placeholder="Name (Auto)" disabled />
            <ActionButton>Remove</ActionButton>
          </div>
        </div>
      </div>

      {/* View Faculty List */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-96 flex justify-center">
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out">
          View <br /> Faculty List
        </button>
      </div>
    </section>
  );
};

export default AddRemoveFaculty;
