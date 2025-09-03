import React from "react";
import tableBg from "../assets/Table_backGround.png";

const students = [
  { roll: "20000001", name: "Prem Kr", course: "Data Structures" },
  { roll: "20000002", name: "Aarav Singh", course: "Fluid Mechanics" },
  { roll: "20000003", name: "Neha Sharma", course: "Microprocessors" },
  { roll: "20000004", name: "Rohit Patel", course: "Surveying" },
  { roll: "20000005", name: "Siya Verma", course: "Computer Networks" },
  { roll: "20000006", name: "Karan Roy", course: "Thermodynamics" },
  { roll: "20000007", name: "Aisha Khan", course: "Genetic Engineering" },
  { roll: "20000008", name: "Vikram Das", course: "Algorithms" },
  { roll: "20000009", name: "Meera Jain", course: "VLSI Design" },
  { roll: "20000010", name: "Aditya Gupta", course: "DBMS" },
];

const Table = () => {
  return (
    <div className="flex justify-center items-start gap-12 p-4">
      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="border-separate text-center shadow-lg rounded-lg min-w-[400px]">
          <thead className="text-white bg-orange-300">
            <tr>
              <th className="px-4 py-2 border border-white rounded-tl-lg">Roll Number</th>
              <th className="px-4 py-2 border border-white">Name</th>
              <th className="px-4 py-2 border border-white rounded-tr-lg">Course</th>
            </tr>
          </thead>
          <tbody
            className="bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${tableBg})` }}
          >
            {students.map((student) => (
              <tr key={student.roll}>
                <td className="px-4 py-2 border border-white">{student.roll}</td>
                <td className="px-4 py-2 border border-white">{student.name}</td>
                <td className="px-4 py-2 border border-white">{student.course}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="bg-white rounded-b-lg px-4 py-2">
                <div className="flex justify-between font-bold">
                  <a href="" className="hover:text-orange-300">
                    {"<< Prev. Page"}
                  </a>
                  <a href="" className="hover:text-orange-300">
                    {"Next Page >>"}
                  </a>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Search Link */}
      <div className="flex items-center">
        <p className="font-bold hover:text-orange-300">
          <a href="">{"Search Student >>"}</a>
        </p>
      </div>
    </div>
  );
};

export default Table;
