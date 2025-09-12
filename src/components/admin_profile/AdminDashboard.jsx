import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaDollarSign, FaFolder, FaFileUpload } from "react-icons/fa";

// Reusable Action Button
const ActionButton = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 bg-blue-100 hover:bg-blue-200 rounded-2xl shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    <div className="mb-4 bg-yellow-400 p-4 rounded-xl shadow">{icon}</div>
    <span className="text-center font-semibold text-blue-900">{text}</span>
  </button>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Button Config Array
  const actions = [
    {
      icon: <FaDollarSign size={40} className="text-white" />,
      text: "Add Faculty / Remove Faculty",
      route: "add-remove-faculty",
    },
    {
      icon: <FaFolder size={40} className="text-white" />,
      text: "View Faculty & Students",
      route: "view-faculty-student",
    },
    {
      icon: <FaFolder size={40} className="text-white" />,
      text: "Add Student / Remove Student",
      route: "add-remove-student",
    },
    {
      icon: <FaFileUpload size={40} className="text-white" />,
      text: "Add Regulations",
      route: "regulation",
    },
  ];

  return (
    <>
      {/* <AdminNavBar /> */}
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="p-4 sm:p-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>

              {/* Action Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {actions.map(({ icon, text, route }, index) => (
                    <ActionButton
                      key={index}
                      icon={icon}
                      text={text}
                      onClick={() => navigate(route)}
                    />
                ))}
              </div>

              {/* Nested Routes */}
              <div className="mt-10">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;