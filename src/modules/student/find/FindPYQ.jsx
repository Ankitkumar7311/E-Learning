import Input from "@mui/material/Input";

let FindPYQ = () => {
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center px-4 py-6">
        {/* find pyqs */}
        <section className="w-full max-w-2xl flex flex-col">
          <main className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-start mb-6">Find PYQs:</h2>

            {/* Choose Regulation */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
              <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
              Regulation:
              </label>
              <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm sm:text-base">
                <option>select</option>
                <option>R15</option>
                <option>R17</option>
                <option>R18</option>
                <option>R19</option>
                <option>R20</option>
                <option>R22</option>
              </select>


            </div>


            {/* Choose Branch */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
              <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
              Branch :
              </label>
              <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm sm:text-base">
                <option>select</option>
                <option>CSE</option>
                <option>CSD</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>MECH</option>
                <option>CIVIL</option>

              </select>

   
            </div>


            {/* Choose Semester */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
              <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
                Choose Semester:
              </label>
              <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm sm:text-base">
                <option>7th Semester (2023-24 Autumn)</option>
              </select>
            </div>

            {/* Subjects */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
              <label className="font-medium w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
                Subjects:
              </label>
              <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm sm:text-base">
                <option>Choose Subject</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md shadow w-full sm:w-35">
                Search
              </button>
            </div>
          </main>
        </section>
      </div>
    </>
  );
};

export default FindPYQ;
