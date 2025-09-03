import React, { useState } from "react";

const StudentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const columns = [
    "Roll Number",
    "Name",
    "Course",
    "Batch",
    "Fee Status",
    "Registration",
    "Verification",
    "Details",
  ];

  // Dummy 15 rows for pagination
  const data = Array.from({ length: 15 }, (_, index) => ({
    roll: `R${index + 1}`,
    name: "Name",
    course: "Course",
    batch: "Batch",
    fee: "Paid",
    reg: "Done",
    verify: "Yes",
    details: "View",
  }));

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-6">
      {/* Outer Table Container */}
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-yellow-500 text-white">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-3 text-center font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-blue-100" : "bg-blue-50"
                } hover:bg-blue-200 transition`}
              >
                <td className="p-3 text-center">{row.roll}</td>
                <td className="p-3 text-center">{row.name}</td>
                <td className="p-3 text-center">{row.course}</td>
                <td className="p-3 text-center">{row.batch}</td>
                <td className="p-3 text-center">{row.fee}</td>
                <td className="p-3 text-center">{row.reg}</td>
                <td className="p-3 text-center">{row.verify}</td>
                <td className="p-3 text-center text-blue-600 cursor-pointer hover:underline">
                  {row.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTable;
