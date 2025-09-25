import React from "react";
import UploadStuNavbar from "./UploadStuNavbar";
import teacher from "../../assets/teacher.jpg";
import { Link } from "react-router-dom";
import SectionLeft from "../../layouts/studentdashboard/SectionLeft";

const UpdateStudent = () => {
  return (
    <>
      <UploadStuNavbar />

      {/* ✅ Flex container for SectionLeft + Form */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 p-4">
        {/* Left Section */}
        <SectionLeft />

        {/* Form (no styles inside changed) */}
        <form className="flex flex-col justify-around items-center md:h-[550px] w-[580px] shadow-sm rounded-md">
          <img
            src={teacher}
            alt="no img"
            className="h-[130px] w-[140px] rounded-xl"
          />
          <input
            className=" bg-blue-100 p-2 rounded-xl w-[250px] "
            type="file"
            placeholder="upload image |->"
          />
          <input
            className=" bg-blue-100 p-2 rounded-xl w-[250px]"
            type="text"
            placeholder="Enter address"
          />
          <input
            className=" bg-blue-100 p-2 rounded-xl w-[250px]"
            type="text"
            placeholder="Enter phone number"
          />
          <input
            className=" bg-blue-100 p-2 rounded-xl w-[250px]"
            type="text"
            placeholder="Enter semester"
          />
          <input
            className=" bg-blue-100 p-2 rounded-xl w-[250px]"
            type="text"
            placeholder="Enter regulation"
          />
          <input
            className=" bg-blue-100 p-2 rounded-xl w-[250px]"
            type="password"
            placeholder="Enter student-id"
          />

          <Link to="/student/student-dashboard">
            <button className="text-white bg-yellow-500 p-3 rounded-xl w-[150px]">
              update
            </button>
          </Link>
        </form>
      </div>
    </>
  );
};

export default UpdateStudent;
