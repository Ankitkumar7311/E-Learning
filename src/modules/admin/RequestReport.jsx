// import React, { useState } from "react";
// import AdminNavBar from "./AdminNavBar";
// import Editmaterialedit from "./Editmaterialedit"; // 👈 your existing component
// import CustomModal from "../faculty/common_modal/CustomModal";

// const RequestReport = () => {
//   const [data, setData] = useState([
//     { id: 1, request: "CS304", module: "ME304", comment: "Information is wrong" },
//     { id: 2, request: "CS304", module: "ME304", comment: "Please Add DOF's concept in detail" },
//     { id: 3, request: "CS304", module: "ME304", comment: "Photo is wrong" },
//     { id: 4, request: "CS304", module: "ME304", comment: "Link not working" },
//   ]);
//   const totalCount = data.length;


//   const [openModal, setOpenModal] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
//       {/* Content */}
//       <div className="flex-1 flex items-center justify-center p-1 font-sans">
//         <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden">
//           <div className="p-6">
//             <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {["S.N.", "Request Code", "Module Code", "Comment", "Action"].map((head, idx) => (
//                     <th
//                       key={idx}
//                       className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                         idx < 4 ? "border-r border-gray-300" : ""
//                       }`}
//                     >
//                       {head}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {data.map((item) => (
//                   <tr key={item.id}>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
//                       {item.id}.
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">
//                       {item.request}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">
//                       {item.module}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">
//                       {item.comment}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       <button
//                         onClick={() => {
//                           setSelectedId(item.id);
//                           setOpenModal(true);
//                         }}
//                         className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
                
//                 {/* ✅ Total Row */}
//                 <tr className="bg-gray-50 font-medium">
//                   <td
//                     colSpan="4"
//                     className="px-6 py-4 text-right border-r border-gray-300"
//                   >
//                     Total
//                   </td>
//                   <td className="px-6 py-4 text-left font-bold text-gray-900">
//                     {totalCount}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal with your custom component */}
//       {openModal && (
//         <CustomModal isOpen={openModal} onClose={() => setOpenModal(false)} title="Edit Material">
//           {/* 👇 Here you insert your already built component */}
//           <Editmaterialedit requestId={selectedId} onClose={() => setOpenModal(false)} />
//         </CustomModal>
//       )}
//     </div>
//   );
// };

// export default RequestReport;
import React, { useState } from "react";
import AdminNavBar from "./AdminNavBar";
import Editmaterialedit from "./Editmaterialedit"; // Your existing component
import CustomModal from "../faculty/common_modal/CustomModal"; // Modal wrapper

const RequestReport = () => {
  const [data, setData] = useState([
    { id: 1, request: "CS304", module: "ME304", comment: "Information is wrong" },
    { id: 2, request: "CS304", module: "ME304", comment: "Please Add DOF's concept in detail" },
    { id: 3, request: "CS304", module: "ME304", comment: "Photo is wrong" },
    { id: 4, request: "CS304", module: "ME304", comment: "Link not working" },
  ]);
  const totalCount = data.length;

  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start px-4">
      {/* Optional: Admin Navigation */}
      {/* <AdminNavBar /> */}

      {/* Main Content */}
      <div className="w-full max-w-5xl mt-6">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* ✅ Scroll wrapper for small screens */}
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["S.N.", "Request Code", "Module Code", "Comment", "Action"].map((head, idx) => (
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-300">
                      {item.id}.
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">
                      {item.request}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">
                      {item.module}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-300">
                      {item.comment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpenModal(true);
                        }}
                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-gray-50 font-medium">
                  <td colSpan="4" className="px-6 py-4 text-right border-r border-gray-300">
                    Total
                  </td>
                  <td className="px-6 py-4 text-left font-bold text-gray-900">
                    {totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <CustomModal isOpen={openModal} onClose={() => setOpenModal(false)} title="Edit Material">
          <Editmaterialedit requestId={selectedId} onClose={() => setOpenModal(false)} />
        </CustomModal>
      )}
    </div>
  );
};

export default RequestReport;