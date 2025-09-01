import React from 'react'
import AdminNavBar from './AdminNavBar'
import Profileleft from './Profileleft'
import teacher  from "../assets/teacher.jpg"
import FacultyPanel from './FacultyPanel'



const UpdateTeach = () => {
  return <>
  <FacultyPanel/>
  <Profileleft/>
  
  {/* <div className="absolute left-[600px] h-[580px] w-[580px] shadow-2xl rounded-xl "> */}
    <form className="flex flex-col justify-around items-center absolute left-[600px] h-[550px] w-[580px] shadow-2xl rounded-xl">
        <img src={teacher} alt="no img" className="h-[130px] w-[180px] rounded-xl"/>
        <input className=" bg-blue-100 p-2 rounded-xl w-[250px] " type="file" placeholder="upload image |->" /> 
        <input className=" bg-blue-100 p-2 rounded-xl w-[250px]" type="text" placeholder="Enter address" />
        <input className=" bg-blue-100 p-2 rounded-xl w-[250px]" type="text" placeholder="Enter branch"/>
        <input className=" bg-blue-100 p-2 rounded-xl w-[250px]" type="text" placeholder="Enter subject" />
        <input className=" bg-blue-100 p-2 rounded-xl w-[250px]" type="text" placeholder="Enter designation" />
        <input className=" bg-blue-100 p-2 rounded-xl w-[250px]" type="password" placeholder="Enter password" />

        <button className="text-white bg-yellow-500 p-3 rounded-xl w-[150px]">update</button>
    </form>
  {/* </div> */}
  </>
}

export default UpdateTeach