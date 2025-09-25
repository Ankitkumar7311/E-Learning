// let RequestQuestion = () => {
//   return (
//     <>
//       <div className="flex flex-col gap-10 justify-center items-center px-4 sm:px-6 lg:px-10">
//         {/* Request Question on topic */}
//         <section className="w-full max-w-4xl flex flex-col">
//           <h2 className="border-[red] flex flex-col drop-shadow-2xl bg-[white] rounded justify-center items-center">
//             <main className="border-2 flex flex-col sm:flex-row items-center justify-center sm:ml-10 lg:ml-20 p-4 sm:p-6">
//               <h2 className="w-30 hidden sm:block"></h2>
//               <h1 className="h-auto w-full flex flex-col gap-3 justify-center">
//                 <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
//                   Request Question on Topic:
//                 </h2>

//                 {/* Select Semester */}
//                 <div className="mb-4 flex flex-col sm:flex-row sm:items-center w-full sm:w-200 gap-2">
//                   <label className="font-medium w-full sm:w-50">
//                     Select semester
//                   </label>
//                   <select className="w-full sm:w-100 h-11 bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p1-4">
//                     <option className="w-full h-30 drop" value ="1-1">1-1</option>
//                     <option className="w-full h-30 drop" value="1-2">1-2</option>
//                      <option className="w-full h-30 drop" value="2-1">2-1</option>
//                       <option className="w-full h-30 drop" value="2-1">2-2</option>
//                        <option className="w-full h-30 drop" value="3-1">3-1</option>
//                         <option className="w-full h-30 drop" value="3-2">3-2</option>
//                          <option className="w-full h-30 drop" value="4-1">4-1</option>
//                           <option className="w-full h-30 drop" value="4-2">4-2</option>
//                   </select>
//                 </div>

//                 {/* Enter The Subject (changed to input) */}
//                 <div className="mb-4 flex flex-col sm:flex-row sm:items-center w-full sm:w-200 gap-2">
//                   <label className="font-medium w-full sm:w-50">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter the Subject"
//                     className="w-full sm:w-100 h-11 bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p-4"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-center sm:justify-start">
//                   <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold w-40 h-10 rounded-md">
//                     Submit Now
//                   </button>
//                 </div>
//               </h1>
//             </main>
//           </h2>
//         </section>
//       </div>
//     </>
//   );
// };

// export default RequestQuestion;


let RequestQuestion = () => {
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center px-4 sm:px-6 lg:px-10">
        {/* Request Question on topic */}
        <section className="w-full max-w-4xl flex flex-col">
          <h2 className="border-[red] flex flex-col drop-shadow-2xl bg-[white] rounded justify-center items-center">
            <main className="border-2 flex flex-col sm:flex-row items-center justify-center sm:ml-10 lg:ml-20 p-4 sm:p-6">
              <h2 className="w-30 hidden sm:block"></h2>
              <h1 className="h-auto w-full flex flex-col gap-3 justify-center">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
                  Request Question on Topic:
                </h2>

                {/* Select Semester */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center w-full sm:w-200 gap-2">
                  <label className="font-medium w-full sm:w-50">
                    Select Semester
                  </label>
                  <select className="w-full sm:w-100 h-11 bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p1-4">
                    <option className="w-full h-30 drop" value="" disabled selected>
                      Choose the semester
                    </option>
                    <option className="w-full h-30 drop" value="1-1">1-1</option>
                    <option className="w-full h-30 drop" value="1-2">1-2</option>
                    <option className="w-full h-30 drop" value="2-1">2-1</option>
                    <option className="w-full h-30 drop" value="2-2">2-2</option>
                    <option className="w-full h-30 drop" value="3-1">3-1</option>
                    <option className="w-full h-30 drop" value="3-2">3-2</option>
                    <option className="w-full h-30 drop" value="4-1">4-1</option>
                    <option className="w-full h-30 drop" value="4-2">4-2</option>
                  </select>
                </div>

                {/* Subject Input Field */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center w-full sm:w-200 gap-2">
                  <label className="font-medium w-full sm:w-50">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the Subject"
                    className="w-full sm:w-100 h-11 bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p-4"
                  />
                </div>

                {/* Text Area for Topic Description */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-start w-full sm:w-200 gap-2">
                  <label className="font-medium w-full sm:w-50 mt-2 sm:mt-0">
                    Topic Description
                  </label>
                  <textarea
                    placeholder="Describe the topic in detail"
                    rows="5"
                    className="w-full sm:w-100 h-auto bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p-4 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center sm:justify-start">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold w-40 h-10 rounded-md">
                    Submit Now
                  </button>
                </div>
              </h1>
            </main>
          </h2>
        </section>
      </div>
    </>
  );
};

export default RequestQuestion;