import React, { useState } from "react";
import teacher from "../../assets/teacher.jpg";
import { useNavigate } from "react-router-dom";
import SectionLeft from "../../layouts/studentdashboard/SectionLeft";
import StudentNavBar from "../student/StudentNavBar";
 
const UpdateStudent = () => {
  const navigate = useNavigate();
  const [update, setUpdate] = useState({
    address: "",
    semester: "",
    studentId: "",
    phone: "",
    regulation: "",
  });
 
  const [preview, setPreview] = useState(teacher);
 
  const { address, semester, studentId, phone, regulation } = update;
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdate({ ...update, [name]: value });
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/VidyaSarthi/updateStudent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        }
      );
 
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        return;
      }
 
      console.log("Update successful", update);
      setUpdate({
        address: "",
        semester: "",
        studentId: "",
        phone: "",
        regulation: "",
      });
 
      navigate("/student/student-dashboard");
    } catch (err) {
      console.error("Network or server error:", err);
    }
  };
 
  return (
    <>
      <StudentNavBar />
      <section className="flex flex-col lg:flex-row gap-6 bg-gray-50 min-h-screen px-4 sm:px-6 md:px-8 py-10 overflow-auto">
 
        {/* Left Section */}
        <div className="w-full sm:flex sm:justify-center lg:w-1/3">
          <SectionLeft />
        </div>
 
        {/* Right Section */}
        <div className="flex flex-col flex-1 items-center lg:w-2/3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">
            Update Student Details
          </h1>
 
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">
            {/* Image Upload Card */}
            <div className="shadow-xl rounded-xl p-6 bg-white flex flex-col items-center w-full sm:max-w-md sm:mx-auto lg:w-1/2">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-blue-100 p-2 rounded-lg w-full cursor-pointer"
              />
              <p className="text-gray-500 mt-3 text-sm text-center">
                Upload or update your profile photo
              </p>
            </div>
 
            {/* Form Card */}
            <form
              onSubmit={handleSubmit}
              className="shadow-xl rounded-xl p-6 bg-white flex flex-col gap-4 w-full sm:max-w-md sm:mx-auto lg:w-1/2"
            >
              <input
                className="bg-blue-50 border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200"
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                placeholder="Enter address"
              />
              <input
                className="bg-blue-50 border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200"
                type="text"
                name="phone"
                value={phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              <input
                className="bg-blue-50 border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200"
                type="text"
                name="semester"
                value={semester}
                onChange={handleChange}
                placeholder="Enter semester"
              />
              <input
                className="bg-blue-50 border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200"
                type="text"
                name="regulation"
                value={regulation}
                onChange={handleChange}
                placeholder="Enter regulation"
              />
              <input
                className="bg-blue-50 border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200"
                type="password"
                name="studentId"
                value={studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
              />
              <button
                type="submit"
                className="text-white bg-yellow-500 p-3 rounded-lg w-full font-semibold hover:bg-yellow-600 shadow-md hover:shadow-lg transition duration-300"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
 
export default UpdateStudent;
 
 