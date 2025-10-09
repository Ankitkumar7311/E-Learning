// src/components/AdminNavBar.jsx
import React, { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/sylla4.png";
import { Link, useLocation } from "react-router-dom";
import Logout from "../admin/popups/Logout"; // Desktop logout (modal + proper clearing)

const AdminNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const buttons = {
    "/admin/dashboard": "Global Admin",
    "/admin/dashboard/add-remove-faculty": "Add/Remove Faculty",
    "/admin/dashboard/view-faculty-student": "View Faculty/Student",
    "/admin/dashboard/regulation": "Add regulation",
    "/admin/dashboard/add-remove-student": "Add/Remove Student",
    "/request-report": "Report-request",
  };
  const buttontext = buttons[location.pathname] || "Admin Panel";

  // Reusable menu items (mobile/tablet)
  const MenuItems = ({ isMobile = false }) => (
    <div
      className={`flex ${
        isMobile
          ? "flex-col space-y-4 px-6 pt-8 text-lg"
          : "flex-col space-y-3 p-6"
      }`}
    >
      <button
        type="button"
        className="w-full rounded-lg bg-slate-100 px-4 py-3 text-left font-semibold text-slate-800"
      >
        {buttontext}
      </button>

      <Link
        to="/request-report"
        className="block rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-100"
        onClick={() => setIsMenuOpen(false)}
      >
        Help & Support
      </Link>

      {/* Fallback logout entry for mobile/menu (keeps menu simple) */}
      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
        <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-yellow-400 py-3 px-4 font-bold text-white transition-colors hover:bg-yellow-500">
          <span>Log out</span>
          <FiLogOut className="h-5 w-5" />
        </button>
      </Link>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/95 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left Section: Logo and Title */}
          <div className="flex flex-shrink-0 items-center gap-3">
            <img src={logo} alt="Vidya Sarthi Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
              <p className="text-[15px] text-gray-500">E-learning</p>
            </div>
          </div>

          {/* Center and Right Sections for DESKTOP */}
          <div className="hidden flex-1 items-center justify-between pl-8 lg:flex">
            {/* Center-left button */}
            <button className="rounded-2xl bg-gray-200 py-2 px-6 font-semibold text-gray-700 hover:bg-blue-100">
              {buttontext}
            </button>

            {/* Right-aligned links */}
            <div className="flex items-center space-x-8">
              <Link
                to="/request-report"
                className="font-medium text-gray-700 transition duration-300 hover:text-blue-600"
              >
                Help & Support
              </Link>

              {/* Desktop logout uses the Logout component (modal + proper clearing) */}
              <Logout />
            </div>
          </div>

          {/* Hamburger Menu Button for TABLET & MOBILE */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop for Tablet Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 hidden bg-black/40 md:block lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* TABLET: Left Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMenuOpen(false)}>
            <FiX className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="hidden md:block">
          <MenuItems />
        </div>
      </div>

      {/* MOBILE: Full-screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-white md:hidden">
          <div className="flex items-center justify-between p-4">
            <span className="font-bold text-gray-800">Menu</span>
            <button onClick={() => setIsMenuOpen(false)}>
              <FiX className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="mt-4">
            <MenuItems isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavBar;
