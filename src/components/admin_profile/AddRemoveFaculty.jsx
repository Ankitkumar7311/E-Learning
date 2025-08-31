import React from 'react';

const AddRemoveFaculty = () => {
  return (
    <section className="h-[635px] w-[900px]  mx-auto shadow rounded-xl">
      <div className=" bg-gray-100 p-8 flex flex-col items-center justify-center space-y-8 rounded-xl">
        {/* Container for the top two cards */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Add Faculty Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Faculty:</h2>
            <div className="flex flex-col gap-y-[20px]">
              <input
                type="text"
                placeholder="Enter Faculty Name"
                className="w-full h-[50px] p-3 border border-gray-300 rounded-2xl inset-shadow-sm inset-shadow-indigo-400 text-gray-700 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <input
                type="text"
                placeholder="Enter Faculty Id"
                className="w-full h-[50px] p-3 border border-gray-300 rounded-2xl inset-shadow-sm inset-shadow-indigo-400 bg-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <input
                type="email"
                placeholder="Enter Faculty Email"
                className="w-full  h-[50px] p-3 border border-gray-300 rounded-2xl inset-shadow-sm inset-shadow-indigo-400 bg-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full h-[50px] p-3 border border-gray-300 rounded-2xl inset-shadow-sm inset-shadow-indigo-400 bg-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <button className="w-[200px] h-[50px] bg-yellow-500 text-white self-center hover:bg-yellow-600 font-bold py-3 rounded-[20px]">
                Add
              </button>
            </div>
          </div>

          {/* Remove Faculty Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md  w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Remove Faculty:</h2>
            <div className="space-y-3 flex flex-col gap-y-[20px]">
              <input
                type="text"
                placeholder="Enter Roll Number"
                className="w-full h-[50px] p-3 border border-gray-300 rounded-2xl inset-shadow-sm inset-shadow-indigo-400 bg-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <input
                type="text"
                placeholder="Name (Auto)"
                disabled
                className="w-full h-[50px] p-3 border border-gray-300 rounded-2xl inset-shadow-sm inset-shadow-indigo-400 bg-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <button className="w-[200px] h-[50px] bg-yellow-500 text-white self-center hover:bg-yellow-600 font-bold py-3 rounded-[20px]">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* View Faculty List Card */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-md  w-96">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out">
              View
              <br />
              Faculty List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddRemoveFaculty;