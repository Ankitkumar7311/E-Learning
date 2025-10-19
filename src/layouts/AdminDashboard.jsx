import React, { useState } from "react";
// 1. Import Link for navigation
import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaUserTie,
  FaFileUpload,
  FaSearch,
  FaBars,
  FaChartBar, // 2. Import a dashboard icon
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi"; // 3. Import logout icon

// --- NavLink Component (UNCHANGED) ---
const NavLink = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="
      flex items-center w-full 
      px-4 py-3 
      text-yellow-100 
      rounded-lg 
      hover:bg-yellow-700 hover:text-white
      transition-colors duration-200
    "
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </button>
);
// --- End of NavLink Component ---

// --- 1. MODIFIED Confirmation Modal Component ---
const ConfirmationModal = ({ message, onConfirm, onClose }) => (
  // Changed items-center to items-start and added pt-8 to move it to the top
  <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black bg-opacity-60 backdrop-blur-sm">
    {/* Added animate-slide-down class for the animation */}
    <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-slide-down">
      <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
);
// --- End of Confirmation Modal ---


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This function contains the ACTUAL logout logic
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vidyaSarthiAuth");
    window.location.assign("/login");
  };

  // This function just OPENS the modal
  const handleMenuLogout = () => {
    setIsModalOpen(true);
  };

  // --- Actions Array (UNCHANGED) ---
  const actions = [
    {
      icon: <FaChartBar size={20} />, 
      text: "Analytics Dashboard",
      route: "", 
    },
    {
      icon: <FaUserGraduate size={20} />,
      text: "Add / Remove Student",
      route: "add-remove-student",
    },
    {
      icon: <FaUserTie size={20} />,
      text: "Add / Remove Teacher",
      route: "add-remove-faculty",
    },
    {
      icon: <FaFileUpload size={20} />,
      text: "Add Regulations",
      route: "regulation",
    },
    {
      icon: <FaSearch size={20} />,
      text: "Search Users",
      route: "view-faculty-student",
    },
  ];

  return (
    <>
      {/* --- 2. NEW: Animation styles for the modal --- */}
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-down {
            animation: slideDown 0.3s ease-out forwards;
          }
        `}
      </style>
      
      {/* Render the modal when state is true */}
      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={confirmLogout}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* AdminNavBar component is no longer needed */}
      <div className="flex min-h-screen bg-gray-100 font-sans">
        
        {/* --- Mobile Menu Button (Hamburger) (UNCHANGED) --- */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white text-gray-800 rounded-full shadow-lg"
          aria-label="Open sidebar"
        >
          <FaBars size={20} />
        </button>

        {/* --- Mobile Overlay (UNCHANGED) --- */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />
        )}

        {/* --- Responsive Fixed Left Sidebar (UNCHANGED) --- */}
        <nav
          className={`
            w-72 h-screen bg-yellow-600 shadow-xl p-6 
            flex flex-col flex-shrink-0
            fixed inset-y-0 left-0 z-50
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0
          `}
        >
          {/* 6. MODIFIED Sidebar Header (Logo removed, centered) */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-yellow-700">
            <div>
              <Link to='/admin/dashboard/'>
                <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              </Link>
              <p className="text-sm text-yellow-200">E-learning</p>
            </div>
          </div>

          {/* Wrapper to push footer links to the bottom */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Primary Action List */}
            <div className="flex flex-col gap-2 mt-6">
              {actions.map(({ icon, text, route }, index) => (
                <NavLink
                  key={index}
                  icon={icon}
                  text={text}
                  onClick={() => {
                    navigate(route);
                    setIsSidebarOpen(false); // Close sidebar on mobile
                  }}
                />
              ))}
            </div>
          </div>

          {/* 7. MODIFIED Sidebar Footer (Help removed) */}
          <div className="pt-4 mt-auto border-t border-yellow-700">
            {/* Help & Support Link Removed */}

            <button
              onClick={handleMenuLogout} // <-- This now opens the modal
              className="
                flex items-center w-full 
                px-4 py-3 
                text-white rounded-lg 
                font-medium
                hover:bg-yellow-700
                transition-colors duration-200
              "
            >
              <span className="mr-3"><FiLogOut size={20} /></span>
              <span>Log out</span>
            </button>
          </div>
        </nav>

        {/* --- Scrollable Right Content Area (UNCHANGED) --- */}
        <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-8">
          {/* 8. NEW: Spacer for mobile hamburger button */}
          <div className="h-16 lg:hidden" />
          
          <div className="max-w-screen-xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
              {/* Nested Routes will be rendered here */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;