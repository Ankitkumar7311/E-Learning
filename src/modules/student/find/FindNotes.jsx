let FindNotes = () => {
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center px-4 py-6">
        <section className="w-full max-w-2xl flex flex-col">
          <main className="flex flex-col gap-6">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-center mb-6">Find Notes:</h2>

            {/* Semester */}
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

            {/* Units */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
              <label className="font-semibold w-full sm:w-1/3 mb-2 sm:mb-0 text-sm sm:text-base">
                Units: <br />
                <span className="font-normal text-xs sm:text-sm">(Optional)</span>
              </label>
              <select className="w-full sm:w-2/3 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm sm:text-base">
                <option>Choose</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md shadow w-full sm:w-auto">
                Search
              </button>
            </div>
          </main>
        </section>
      </div>
    </>
  );
};

export default FindNotes;
