import React from "react";
import Profileleft from "../admin_profile/ProfileLeft";
import teacher from "../../assets/teacher.jpg";
import FacultyPanel from "./FacultyPanel";
import TeacherNavBar from "../navbars/TeacherNavbar";

const UpdateTeach = () => {
  return (
    <>
      <TeacherNavBar />
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar / Panel */}
        <Profileleft />

        {/* Update Form */}
        <form className="flex flex-col justify-around items-center bg-white shadow-2xl rounded-xl p-8 m-4 md:ml-6 md:w-[500px] space-y-4">
          <img
            src={teacher}
            alt="Teacher"
            className="h-[130px] w-[180px] rounded-xl object-cover"
          />
          <input
            className="bg-blue-100 p-2 rounded-xl w-full"
            type="file"
            placeholder="Upload image"
          />
          <input
            className="bg-blue-100 p-2 rounded-xl w-full"
            type="text"
            placeholder="Enter address"
          />
          <input
            className="bg-blue-100 p-2 rounded-xl w-full"
            type="text"
            placeholder="Enter branch"
          />
          <input
            className="bg-blue-100 p-2 rounded-xl w-full"
            type="text"
            placeholder="Enter subject"
          />
          <input
            className="bg-blue-100 p-2 rounded-xl w-full"
            type="text"
            placeholder="Enter designation"
          />
          <input
            className="bg-blue-100 p-2 rounded-xl w-full"
            type="password"
            placeholder="Enter password"
          />
          <button className="text-white bg-yellow-500 p-3 rounded-xl w-[150px] hover:bg-yellow-600 transition">
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateTeach;
