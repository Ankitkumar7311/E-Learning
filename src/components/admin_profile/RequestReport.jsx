import React, { useState } from "react";
import AdminNavBar from "./AdminNavBar";

const RequestReport = () => {
  // Mock data for the table
  const [data] = useState([
    { id: 1, request: "CS304", module: "ME304", comment: "Information is wrong", complete: true },
    { id: 2, request: "CS304", module: "ME304", comment: "Please Add DOF's concept in detail", complete: true },
    { id: 3, request: "CS304", module: "ME304", comment: "Photo is wrong", complete: true },
    { id: 4, request: "CS304", module: "ME304", comment: "Link not working", complete: false },
  ]);

  const totalComplete = data.filter((item) => item.complete).length;

  // ✅ Small subcomponent for status rendering
  const StatusCell = ({ complete }) => {
    if (complete === true) {
      return (
        <div className="flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (complete === false) {
      return <span className="flex justify-center text-orange-500">Pending</span>;
    }
    return null;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavBar />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
          <div className="p-6">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["S.N.", "Request Code", "Module Code", "Comment", "Complete"].map((head, idx) => (
                    <th
                      key={idx}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        idx < 4 ? "border-r border-gray-300" : ""
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">{item.id}.</td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">{item.request}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">{item.module}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">{item.comment}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <StatusCell complete={item.complete} />
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-50 font-medium">
                  <td colSpan="4" className="px-6 py-4 text-right border-r border-gray-300">
                    Total
                  </td>
                  <td className="px-6 py-4 text-left font-bold text-gray-900">{totalComplete}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestReport;
