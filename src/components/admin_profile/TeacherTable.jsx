import React from "react";
import tableBg from "../../assets/Table_backGround.png";

const Table = () => {
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

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Table Container */}
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="table-auto border-separate border-spacing-0 text-center shadow-lg rounded-lg w-full">
          <thead className="bg-orange-300 text-white">
            <tr>
              <th className="px-4 py-2 border border-white rounded-tl-lg">Roll Number</th>
              <th className="px-4 py-2 border border-white">Name</th>
              <th className="px-4 py-2 border border-white rounded-tr-lg">Course</th>
            </tr>
          </thead>
          <tbody
            style={{ backgroundImage: `url(${tableBg})`, backgroundSize: "cover" }}
          >
            {students.map((student, idx) => (
              <tr key={idx} className="hover:bg-yellow-50 transition">
                <td className="px-4 py-2 border border-white">{student.roll}</td>
                <td className="px-4 py-2 border border-white">{student.name}</td>
                <td className="px-4 py-2 border border-white">{student.course}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="bg-white px-4 py-2 rounded-b-lg">
                <div className="flex justify-between font-bold">
                  <a href="#" className="hover:text-orange-300">{"<< Prev. Page"}</a>
                  <a href="#" className="hover:text-orange-300">{"Next Page >>"}</a>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Search Link */}
      <div>
        <a href="#" className="font-bold hover:text-orange-300">
          {"Search Student >>"}
        </a>
      </div>
    </div>
  );
};

export default Table;
