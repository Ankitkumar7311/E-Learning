import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importing icons for the menu button
import { FiMenu, FiX } from 'react-icons/fi';

const NavBar = () => {
  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/universities', label: 'Universities' },
    { to: '/courses', label: 'Courses' },
    { to: '/community', label: 'Community' },
    { to: '/news', label: 'News' },
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login', extra: 'uppercase font-semibold' },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* Main Navbar for Desktop and Mobile */}
      <div className="relative h-16 flex items-center justify-between lg:justify-evenly bg-[#E3EBFF] shadow-md text-lg font-medium px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 tracking-wide hover:text-blue-700 transition-colors duration-300"
        >
          Mrs.College Guide
        </Link>

        {/* Navigation Links for Desktop */}
        <div className="hidden lg:flex gap-6">
          {navLinks.map(({ to, label, extra }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-2 py-1 text-gray-700 hover:text-blue-600 transition duration-300 group ${extra || ''}`}
            >
              {label}
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Sign Up Button for Desktop */}
        <Link
          to="/signup"
          className="hidden lg:flex h-9 w-28 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold uppercase text-white shadow-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
        >
          Sign Up
        </Link>

        {/* Hamburger Menu Button for Mobile */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel (Right Aligned) */}
      {/* CHANGE: Removed 'w-full', added 'right-0 w-64', and updated animation classes */}
      <div
        className={`lg:hidden absolute top-16 right-0 w-64 bg-[#E3EBFF] shadow-lg rounded-b-lg p-5 origin-top-right transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-start gap-4">
          {navLinks.map(({ to, label, extra }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
              className={`text-gray-700 hover:text-blue-600 ${extra || ''}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/signup"
            onClick={() => setIsMenuOpen(false)} // Close menu on link click
            className="mt-2 flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold uppercase text-white shadow-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;