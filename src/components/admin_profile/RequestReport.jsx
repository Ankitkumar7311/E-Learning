import React, { useState } from 'react';
import AdminNavBar from './AdminNavBar'; // <-- yaha import karo

// Main App component
const RequestReport = () => {
  // Mock data for the table
  const [data, setData] = useState([
    { id: 1, request: 'CS304', module: 'ME304', comment: 'Information is wrong', complete: true },
    { id: 2, request: 'CS304', module: 'ME304', comment: 'Please Add DOF\'s concept in detail', complete: true },
    { id: 3, request: 'CS304', module: 'ME304', comment: 'Photo is wrong', complete: true },
    { id: 4, request: 'CS304', module: 'ME304', comment: 'Link not working', complete: false },
    { id: 5, request: null, module: null, comment: null, complete: null },
    { id: 6, request: null, module: null, comment: null, complete: null },
    { id: 7, request: null, module: null, comment: null, complete: null },
    { id: 8, request: null, module: null, comment: null, complete: null },
  ]);

  // Total count for the "Complete" column
  const totalComplete = data.filter(item => item.complete).length;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Admin Navbar yaha call hoga */}
      <AdminNavBar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
          {/* Main Table */}
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">S.N.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Request Code</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Module Code</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Comment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complete</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-300">{item.id}.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-300">{item.request}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-300">{item.module}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-300">{item.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.complete === true && (
                        <div className="flex justify-center items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {item.complete === false && (
                        <div className="flex justify-center items-center text-orange-500">
                          Pending
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-50">
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 border-r border-gray-300">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-bold text-gray-900">
                    {totalComplete}
                  </td>
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
