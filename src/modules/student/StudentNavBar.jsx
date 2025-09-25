import React, { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/Ellipse.png";
import { Link, useLocation } from "react-router-dom";

const StudentNavBar = () => {
  // State to manage the mobile/tablet menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const buttons = {
    "/student/documents": "College Materials",
    "/student/dashboard": "Student dashboard",
    "/student/academic-calendar": "Academic calendar",
    "/student/faculty-qb": "Question Banks",
    "/student/request-question": "Request-Questions",
    "/student/announcements": "Announcements",
    "/student/subjects/encapsulation": "Encapsulation",
  };
  const buttontext = buttons[location.pathname] || "Student Panel";

  // A reusable component for menu items to keep the code clean
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
          
          {/* --- Left Section (Logo, Title, and Desktop Page Button) --- */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex flex-shrink-0 items-center gap-3">
              <img src={logo} alt="Vidya Sarthi Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-lg font-bold text-gray-800">Student Panel</h1>
                <p className="text-[0.9375rem] text-gray-500">E-learning</p>
              </div>
            </div>
            
            {/* --- THIS BUTTON WAS MOVED HERE --- */}
            <button className="hidden rounded-full border border-slate-300 bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 lg:block">
              {buttontext}
            </button>
          </div>

          {/* --- Right Section for DESKTOP (Help & Logout) --- */}
          <div className="hidden items-center space-x-8 lg:flex">
            <Link
              to="/student/dashboard/request-report"
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

export default StudentNavBar;