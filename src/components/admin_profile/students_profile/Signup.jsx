import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ navigation ke liye import

// Signup Component
const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Yaha aap apna signup logic (API call, validation, OTP check) add kar sakte ho
    console.log("Signup form submitted!");

    // Signup ke baad Login page pe redirect
    navigate("/Student-login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 flex items-center justify-center">
      {/* Container Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">SignUp</h1>
          <hr className="border-t-2 border-gray-300 w-12" />
          <p className="text-sm text-gray-500 mt-2">Welcome onboard with us!</p>
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
              <button
                type="button"
                className="mt-1 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition-colors duration-200 flex-shrink-0"
              >
                Generate OTP
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter your OTP"
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-400 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
