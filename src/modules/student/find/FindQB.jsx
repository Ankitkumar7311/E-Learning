// let FindQB = () => {
//   return (
//     <>
//       <div className="flex flex-col gap-10 justify-center items-center px-4 py-6">
//         {/* find qb */}
//         <main className="flex flex-col gap-2 w-full max-w-2xl">
//           <h2 className="text-2xl font-bold text-center">Find QB:</h2>

//           {/* Choose Semester */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
//             <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
//               Choose Regulation:
//             </label>
//             <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base">
//               <option>Choose the Regulation</option>
//             </select>
//           </div>

//            {/* Choose Semester */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
//             <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
//               Choose Branch:
//             </label>
//             <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base">
//               <option>Choose the Branch</option>
//             </select>
//           </div>

//            {/* Choose Semester */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
//             <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
//               Choose Semester:
//             </label>
//             <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base">
//               <option>Choose the Semester</option>
//             </select>
//           </div>

//           {/* Choose Subjects */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
//             <label className="font-semibold w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
//               Choose Subjects:
//               <br />
//               <span className="font-normal text-xs sm:text-sm">
//                 (Choose Priority Wise)
//               </span>
//             </label>
//             <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base">
//               <option>Choose Subject</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center">
//             <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md shadow w-full sm:w-auto">
//               Search
//             </button>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default FindQB;


let FindQB = () => {
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center px-4 py-6 md:px-8 lg:px-16">
        {/* find qb */}
        <main className="flex flex-col gap-4 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-left">
            Find QB:
          </h2>

          {/* Choose Regulation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
            <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base md:text-lg">
              Choose Regulation:
            </label>
            <select className="w-full sm:w-2/3 h-11 md:h-12 lg:h-14 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base md:text-lg">
              <option hidden>Choose the Regulation</option>
            </select>
          </div>

          {/* Choose Branch */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
            <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base md:text-lg">
              Choose Branch:
            </label>
            <select className="w-full sm:w-2/3 h-11 md:h-12 lg:h-14 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base md:text-lg">
              <option hidden>Choose the Branch</option>
            </select>
          </div>

          {/* Choose Semester */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
            <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base md:text-lg">
              Choose Semester:
            </label>
            <select className="w-full sm:w-2/3 h-11 md:h-12 lg:h-14 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base md:text-lg">
              <option hidden>Choose the Semester</option>
            </select>
          </div>

          {/* Choose Subjects */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
            <label className="font-semibold w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base md:text-lg">
              Choose Subjects:
              <br />
              
            </label>
            <select className="w-full sm:w-2/3 h-11 md:h-12 lg:h-14 bg-blue-100 border border-gray-200 rounded-lg shadow p-2 text-sm sm:text-base md:text-lg">
              <option hidden>Choose the Subject</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-left ml-51.5 mt-3">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 md:px-8 md:py-3 rounded-md shadow w-full sm:w-auto text-sm md:text-lg">
              Search
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default FindQB;
