import React from 'react';
import logo from '../../assets/Ellipse.png';

const EditMaterial = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm">
          <img className="h-14 w-14 ml-[50px]" src={logo} alt="E-learning platform"  />
                
            </div>
           <div className="ml-5">
            <span className="block text-lg font-bold text-gray-800">Faculty Panel</span>
            <span className="block text-sm font-bold  text-gray-800">E-learning Platform</span>
          </div>
          </div>
          <a href="#"><span className="bg-blue-200 border border-slate-300 text-slate-700 font-semibold px-8 py-2.5 rounded-full hover:bg-blue-300 hover:text-white ml-[50px]">
            Faculty
          </span></a>
        </div>
        <div className="flex items-center">
        <a href="#" className="text-gray-700 font-medium mr-8 hover:text-blue-600">
          Help & Support
        </a>
        <button className="flex items-center bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg hover:bg-yellow-600 transition-colors mr-[50px]">
          <span>Log out</span>
          {/* Logout Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
      </header>
      {/* -------------------- */}

      <main className="container mx-auto px-4 py-12 flex flex-col items-center space-y-8">
        {/* Edit Material Card */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Material</h2>
          <input
            type="text"
            placeholder="Enter Material Id"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 inset-shadow-sm inset-shadow-indigo-400  "
          />
          <button
            className="w-full py-2 font-bold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
        </div>
        {/* -------------------- */}

        {/* Upload PDF Section */}
      </main>
    </div>
  );
};

export default EditMaterial;