import React from 'react';
import logo from '../../assets/Ellipse.png';

const FacultyPanel = () => {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <img className="h-14 w-14" src={logo} alt="E-learning platform" />
          <div>
            <h1 className="text-lg font-bold text-gray-800">Faculty Panel</h1>
            <span className="text-sm font-medium text-gray-600">E-learning Platform</span>
          </div>
        </div>

        {/* Faculty Button */}
        <a
          href="#"
          className="bg-slate-200 border border-slate-300 text-slate-700 font-semibold px-6 py-2 rounded-full hover:bg-blue-300 hover:text-white transition-colors"
        >
          Faculty
        </a>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-700 font-medium hover:text-blue-600">
          Help & Support
        </a>
        <button className="flex items-center bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg hover:bg-yellow-600 transition-colors">
          <span>Log out</span>
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
    </nav>
  );
};

export default FacultyPanel;
