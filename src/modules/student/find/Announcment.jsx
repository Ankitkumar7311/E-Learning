let Announcment = () => {
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center">
        {/* find pyqs */}
        <section className="w-200 flex flex-col">
          <h2 className="border-[red] flex flex-col drop-shadow-2xl bg-[white] rounded justify-center items-center">
            <main className="border-2 flex items-center justify-center ml-20">
              <h2 className="w-30"></h2>
              <h1 className="h-65 w-200 flex flex-col gap-3 justify-center">
                <h2 className="text-2xl font-bold mb-6">ANNOUNCEMENT:</h2>

                {/* Choose Material Type */}
                <div className="mb-4 flex items-center w-200">
                  <label className="font-medium w-50">TOPIC:</label>
                  <select className="w-100 h-11 bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p1-4">
                    <option className="w-full h-30 drop">PQY</option>
                  </select>
                </div>

                {/* Enter The Text (changed to input) */}
                <div className="mb-4 flex items-center w-200">
                  <label className="font-medium w-50">Enter The Text:</label>
                  <input
                    type="text"
                    placeholder="Describe What You Want"
                    className="w-100 h-11 bg-blue-100 border border-gray-100 rounded-lg shadow-lg drop-shadow-2xl p-4"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
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

export default Announcment;
