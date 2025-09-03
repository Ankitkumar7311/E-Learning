import React, { useState } from "react";

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenerateOTP = () => {
    alert("OTP has been sent to your email!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Account created successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100  p-4">
      <div className=" p-8 bg-white rounded-lg shadow-xl w-[500px]">
        <h2 className="text-2xl font-semibold text-left text-gray-800 h-[20px] w-[100px]">
          Signup
        </h2>
        <br />
        <p className="mt-2 text-left text-gray-600">Welcome onboard with us!</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm inset-shadow-indigo-500 hover:bg-blue-200 bg-[#D8E7F5]"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm inset-shadow-indigo-500 hover:bg-blue-200 bg-[#D8E7F5]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            {/* Flex container to align input and button */}
            <div className="mt-1 flex items-center">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                // Use flex-grow and a margin to the right to create spacing
                className="flex-grow block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2 inset-shadow-indigo-500 hover:bg-blue-200 bg-[#D8E7F5]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={handleGenerateOTP}
                className="px-3 h-10 py-2 text-[10px] font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Generate OTP
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={formData.otp}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm inset-shadow-indigo-500 hover:bg-blue-200 bg-[#D8E7F5]"
              placeholder="Enter your OTP"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSignUp;
