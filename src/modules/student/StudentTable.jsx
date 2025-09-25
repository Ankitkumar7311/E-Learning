// import React from 'react';
// import ExportButton from './ExportResult';


// const StudentTable = [
//   { rollNumber: '200XXXXXX', name: 'Prem Kr.', course: 'B.Tech', batch: '2020-24', feeStatus: 'No due', registration: 'Provisional', verification: 'Pending' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
//   { rollNumber: 'Roll Number', name: 'Name', course: 'Course', batch: 'Batch', feeStatus: 'Fee Status', registration: 'Registration', verification: 'Verification' },
// ];
// const StudentTable = () => {
 

//   return (
//     <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
     
      
//       {/* Table Section */}
//       <div className="w-full max-w-6xl overflow-x-auto shadow-md sm:rounded-lg">
//         <table className="w-full text-sm text-left text-gray-500">
//           <thead className="text-xs text-gray-700 uppercase" style={{ backgroundColor: '#F3B300' }}>
//             <tr className="border-b-2 border-white">
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Roll Number</th>
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Name</th>
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Course</th>
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Batch</th>
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Fee Status</th>
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Registration</th>
//               <th scope="col" className="px-6 py-3 border-r-2 border-white">Verification</th>
//               <th scope="col" className="px-6 py-3">Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student, index) => (
//               <tr 
//                 key={index} 
//                 className="border-b-2 border-white hover:bg-gray-50"
//                 style={{ backgroundColor: '#E0F2F7' }}
//               >
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r-2 border-white">{student.rollNumber}</td>
//                 <td className="px-6 py-4 border-r-2 border-white">{student.name}</td>
//                 <td className="px-6 py-4 border-r-2 border-white">{student.course}</td>
//                 <td className="px-6 py-4 border-r-2 border-white">{student.batch}</td>
//                 <td className="px-6 py-4 border-r-2 border-white">{student.feeStatus}</td>
//                 <td className="px-6 py-4 border-r-2 border-white">{student.registration}</td>
//                 <td className="px-6 py-4 border-r-2 border-white">{student.verification}</td>
//                 <td className="px-6 py-4">
//                   <a href="#" className="font-medium text-blue-600 hover:underline">
//                     {index === 0 ? 'Open' : 'Details'}
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination Section */}
//       <div className="flex justify-between items-center w-full max-w-6xl mt-4 text-gray-700">
//         <button className="px-4 py-2 text-blue-500 rounded-md hover:bg-gray-200">
//           {'<< Prev. Page'}
//         </button>
//         <span className="text-sm">Search Teacher</span>
//         <button className="px-4 py-2 text-blue-500 rounded-md hover:bg-gray-200">
//           {'Next Page >>'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentTable; 
