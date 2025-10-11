// src/components/StudentNavBar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/sylla4.png";
import Logout from "../admin/popups/Logout"; // same path used in TeacherNavBar

const StudentNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    "/student/documents": "College Materials",
    "/student/dashboard": "Student Dashboard",
    "/student/academic-calendar": "Academic Calendar",
    "/student/faculty-qb": "Question Banks",
    "/student/request-question": "Request Questions",
    "/student/announcements": "Announcements",
    "/student/subjects/encapsulation": "Encapsulation",
  };

  const pageTitle = pageTitles[location.pathname] || "Student Panel";

  // A component for menu items to avoid repetition
  // Now accepts an 'onCloseMenu' prop to close the menu after an action
  const MenuItems = ({ isMobile = false, onCloseMenu }) => (
    <div
      className={`flex ${
        isMobile ? "flex-col space-y-4 px-6 pt-8 text-lg" : "flex-col space-y-3 p-6"
      }`}
    >
      <button
        type="button"
        className="w-full rounded-lg bg-slate-100 px-4 py-3 text-left font-semibold text-slate-800"
      >
        {pageTitle}
      </button>

      <Link
        to="/help-support"
        className="block rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-100"
        onClick={onCloseMenu} // Close menu on click
      >
        Help & Support
      </Link>

      {/*
        Integrate the Logout component here.
        It will handle its own modal and logic.
        We pass a className prop to allow styling for mobile vs desktop.
      */}
      <Logout
        buttonClassName={`flex w-full items-center justify-center space-x-2 rounded-lg bg-yellow-400 py-3 px-4 font-bold text-white transition-colors hover:bg-yellow-500`}
        // Optionally, you might want the Logout modal to close the nav menu too
        onLogoutSuccess={onCloseMenu}
      />
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/95 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex flex-shrink-0 items-center gap-3">
              <img src={logo} alt="Vidya Sarthi Logo" className="h-14 w-14 " />
              <div>
                <span className="block text-lg font-bold text-gray-800">Student Panel</span>
                <span className="hidden text-sm font-semibold text-gray-600 sm:block">E-learning</span>
              </div>
            </div>

            {/* Page Title Button - visible on desktop only */}
            <button
              type="button"
              className="hidden rounded-full border border-slate-300 bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 lg:block"
            >
              {pageTitle}
            </button>
          </div>

          {/* Right Section for DESKTOP */}
          <div className="hidden items-center space-x-8 lg:flex">
            <Link
              to="/help-support"
              className="font-medium text-gray-700 transition duration-300 hover:text-blue-600"
            >
              Help & Support
            </Link>

            {/* Desktop logout - now uses the same Logout component as in MenuItems */}
            <Logout />
          </div>

          {/* Hamburger Menu Button for TABLET & MOBILE */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              <FiMenu className="h-6 w-6" />
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

      {/* Tablet Sidebar */}
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
          {/* Pass onCloseMenu to MenuItems for tablet view */}
          <MenuItems onCloseMenu={() => setIsMenuOpen(false)} />
        </div>
      </div>

      {/* Mobile Full-screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-white md:hidden">
          <div className="flex items-center justify-between p-4">
            <span className="font-bold text-gray-800">Menu</span>
            <button onClick={() => setIsMenuOpen(false)}>
              <FiX className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="mt-4">
            {/* Pass onCloseMenu to MenuItems for mobile view */}
            <MenuItems isMobile={true} onCloseMenu={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentNavBar;