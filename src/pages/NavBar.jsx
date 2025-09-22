import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const NavBar = () => {
  // State to manage the menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/universities', label: 'Universities' },
    { to: '/courses', label: 'Courses' },
    { to: '/community', label: 'Community' },
    { to: '/news', label: 'News' },
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login', extra: 'uppercase font-semibold' },
  ];
  
  // A reusable component for menu items to avoid repetition
  const MenuItems = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col items-start gap-6 p-6 text-lg' : 'flex-col items-start gap-4 p-6'}`}>
      {navLinks.map(({ to, label, extra }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setIsMenuOpen(false)}
          className={`w-full rounded-md px-4 py-2 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${extra || ''}`}
        >
          {label}
        </Link>
      ))}
      <Link
        to="/signup"
        onClick={() => setIsMenuOpen(false)}
        className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold uppercase text-white shadow-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-30 bg-[#E3EBFF]/95 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide text-gray-800 transition-colors duration-300 hover:text-blue-700"
          >
            Mrs.College Guide
          </Link>

          {/* Navigation Links for Desktop */}
          <div className="hidden items-center lg:flex lg:gap-6">
            {navLinks.map(({ to, label, extra }) => (
              <Link
                key={to}
                to={to}
                className={`group relative px-2 py-1 text-lg font-medium text-gray-700 transition duration-300 hover:text-blue-600 ${extra || ''}`}
              >
                {label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Sign Up Button for Desktop */}
          <Link
            to="/signup"
            className="hidden h-9 w-28 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold uppercase text-white shadow-md transition duration-300 hover:from-yellow-500 hover:to-yellow-600 lg:flex"
          >
            Sign Up
          </Link>

          {/* Hamburger Menu Button for Tablet & Mobile */}
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-md p-2 text-gray-800 hover:bg-blue-100">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
          <button onClick={() => setIsMenuOpen(false)} className="rounded-md p-2 text-gray-600 hover:bg-gray-100">
            <FiX size={24} />
          </button>
        </div>
        <div className="hidden md:block">
          <MenuItems />
        </div>
      </div>

      {/* MOBILE: Full-screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-white md:hidden">
          <div className="flex items-center justify-between border-b p-4">
            <span className="text-lg font-bold text-gray-800">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="rounded-md p-2 text-gray-600 hover:bg-gray-100">
              <FiX size={24} />
            </button>
          </div>
          <MenuItems isMobile={true} />
        </div>
      )}
    </>
  );
};

export default NavBar;