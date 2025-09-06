// Navbar.jsx

import React from 'react';
// Importing the logout icon from react-icons
import { FiLogOut } from 'react-icons/fi';
// You should replace this with the actual path to your logo
import logo from '../../assets/Ellipse.png'; 
import { useLocation } from 'react-router-dom';

const AdminNavBar = () => {
    const location=useLocation()
    const buttons={
        "/dashboard":"Global Admin",
        "/dashboard/add-remove-faculty":"Add/Remove Faculty",
        "/dashboard/view-faculty-student":"View Faculty/Student",
        "/dashboard/regulation":"Add regulation",
        "/dashboard/add-remove-student":"Add/Remove Student"
    }
    const  buttontext=buttons[location.pathname] || "error wrong path"
  return (
      <>
    <nav className="bg-white shadow-sm w-full">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left Section: Logo and Title */}
        <div className="flex items-center space-x-4 justify-evenly ">
          <img src={logo} alt="Vidya Sarthi Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-gray-800 font-bold text-lg">Admin Panel</h1>
            <p className="text-gray-500 text-[15px]">E-learning</p>
          </div>
        </div>

        {/* Center Section: Global Admin Button */}
        <div>
          <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-2xl hover:bg-blue-300 transition-colors mr-[700px] hover:text-white">
           {buttontext}
          </button>
        </div>

        {/* Right Section: Help and Logout */}
        <div className="flex items-center space-x-8">
          <a href="#" className="text-gray-600 font-medium hover:text-black">
            Help & Support
          </a>
          <button className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition-colors">
            <span>Log out</span>
            <FiLogOut className="h-5 w-5" />
          </button>
        </div>
        
      </div>
    </nav>
    </>
  );
};

export default AdminNavBar;