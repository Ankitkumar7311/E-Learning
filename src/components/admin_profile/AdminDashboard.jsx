import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaDollarSign, FaFolder, FaFileUpload } from "react-icons/fa";

const ActionButton = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-6 bg-blue-100 hover:bg-blue-200 rounded-xl shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="mb-4 bg-yellow-400 p-4 rounded-lg">{icon}</div>
      <span className="text-center font-semibold text-blue-900">{text}</span>
    </button>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="p-4 sm:p-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions:</h2>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <ActionButton
                icon={<FaDollarSign size={28} className="text-white" />}
                text="Add Faculty / Remove Faculty"
                onClick={() => navigate("add-remove-faculty")}
              />
              <ActionButton
                icon={<FaFolder size={28} className="text-white" />}
                text="View Faculty & Students"
                onClick={() => navigate("view-faculty-student")}
              />

<ActionButton
                icon={<FaFolder size={28} className="text-white" />}
                text="Add Student / Remove Student"
                onClick={() => navigate("add-remove-student")}
              />

              <ActionButton
                icon={<FaFileUpload size={28} className="text-white" />}
                text="Add Regulations"
                onClick={() => navigate("regulation")}
              />
            </div>

            {/* Nested routes render yaha hoga */}
            <div className="mt-10">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
