import React from "react";
import faculty from "../../assets/faculty.jpg";
import TeacherNavBar from "../navbars/TeacherNavbar";

const TeacherProfile = () => {
  return (
<> 
{/* <TeacherNavBar/> */}
   <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-6">
        <hr className="border-gray-400 mb-2" />
        <h1 className="text-2xl font-bold">Teacher Information</h1>
        <hr className="border-gray-400 mt-2" />
      </div>

      {/* Teacher Info Section */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="text-left space-y-2">
          <p><span className="font-semibold">Name:</span> Prem Kumar</p>
          <p><span className="font-semibold">Roll:</span> 200XXXX</p>
          <p><span className="font-semibold">Subject:</span> Compiler Design</p>
        </div>
        <img
          src={faculty}
          alt="Teacher"
          className="h-36 w-48 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Classes Table */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="table-auto w-full border border-black rounded-lg border-collapse text-center">
          <thead className="bg-yellow-200">
            <tr>
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Class Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1.</td>
              <td className="border px-4 py-2">CS304</td>
              <td className="border px-4 py-2">CSE 4th Sec A</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">2.</td>
              <td className="border px-4 py-2">CS304</td>
              <td className="border px-4 py-2">CSE 4th Sec B</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">3.</td>
              <td className="border px-4 py-2">CS304</td>
              <td className="border px-4 py-2">IT 4th Sec A</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">4.</td>
              <td className="border px-4 py-2">CS304</td>
              <td className="border px-4 py-2">EE 4th Sec D</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">5.</td>
              <td className="border px-4 py-2">ME304</td>
              <td className="border px-4 py-2">Environmental Sciences & Green..</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-semibold">
              <td colSpan="3" className="border px-4 py-2">Total Classes - 5</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
 </> );
};

export default TeacherProfile;
