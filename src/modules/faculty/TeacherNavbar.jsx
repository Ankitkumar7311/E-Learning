import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/Ellipse.png"; // Make sure this path is correct

const TeacherNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    "/teacher/update-profile": "Update Profile",
    "/teacher/dashboard": "Faculty Panel",
    "/request-report": "Report / Request",
    "/edit-material": "Edit Material",
  };

  const pageTitle = pageTitles[location.pathname] || "Teacher Section";

  // A component for menu items to avoid repetition
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
        {pageTitle}
      </button>
      <Link
        to="/teacher/dashboard/request-report"
        className="block rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-100"
        onClick={() => setIsMenuOpen(false)}
      >
        Help & Support
      </Link>
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
        {/* Main container for the navbar content */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* --- Left Section (Logo, Title, and Desktop Page Button) --- */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex flex-shrink-0 items-center gap-3">
              <img className="h-14 w-14" src={logo} alt="E-learning platform" />
              <div>
                <span className="block text-lg font-bold text-gray-800">
                  Teacher Panel
                </span>
                <span className="hidden text-sm font-semibold text-gray-600 sm:block">
                  E-learning Platform
                </span>
              </div>
            </div>
            {/* Page Title Button: VISIBLE ON DESKTOP ONLY */}
            <button
              type="button"
              className="hidden rounded-full border border-slate-300 bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 lg:block"
            >
              {pageTitle}
            </button>
          </div>

          {/* --- Right Section for DESKTOP --- */}
          {/* Help & Logout Links: VISIBLE ON DESKTOP ONLY */}
          <div className="hidden items-center space-x-8 lg:flex">
            <Link
              to="/teacher/request-report"
              className="font-medium text-gray-700 transition duration-300 hover:text-blue-600"
            >
              Help & Support
            </Link>
            <Link to="/login">
              <button className="flex items-center space-x-2 rounded-lg bg-yellow-400 py-2 px-4 font-bold text-white transition-colors hover:bg-yellow-500">
                <span>Log out</span>
                <FiLogOut className="h-5 w-5" />
              </button>
            </Link>
          </div>

          {/* --- Hamburger Menu Button for TABLET & MOBILE --- */}
          {/* This button is HIDDEN on large screens (`lg:hidden`) */}
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

      {/* --- MENUS for TABLET and MOBILE --- */}

      {/* Backdrop for Tablet Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 hidden bg-black/40 md:block lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* TABLET: Left Sidebar Menu (Visible on `md` up to `lg`) */}
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

      {/* MOBILE: Full-screen Menu (Hidden on `md` and up) */}
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

export default TeacherNavBar;