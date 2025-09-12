import React from "react";
import UploadStuNavbar from "./UploadStuNavbar";
import teacher from "../../assets/teacher.jpg";
import { Link } from "react-router-dom";
import SectionLeft from "../students_profile/SectionLeft";

const UpdateStudent = () => {
  return (
    <>
      <UploadStuNavbar />
      <SectionLeft />

      {/* <div className="absolute left-[600px] h-[580px] w-[580px] shadow-2xl rounded-xl "> */}
      <form className="flex flex-col justify-around items-center absolute left-[600px] h-[560px] w-[580px] shadow-2xl rounded-xl">
        <img
          src={teacher}
          alt="no img"
          className="h-[130px] w-[180px] rounded-xl"
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
      {/* </div> */}
    </>
  );
};

export default UpdateStudent;
