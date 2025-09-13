import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const navLinks = [
    { to: '/universities', label: 'Universities' },
    { to: '/courses', label: 'Courses' },
    { to: '/community', label: 'Community' },
    { to: '/news', label: 'News' },
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login', extra: 'uppercase font-semibold' },
  ];

  return (
    <nav className="h-16 flex items-center justify-evenly bg-[#E3EBFF] shadow-md text-lg font-medium">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-gray-800 tracking-wide hover:text-blue-700 transition-colors duration-300"
      >
        Mrs.College Guide
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6">
        {navLinks.map(({ to, label, extra }) => (
          <Link
            key={to}
            to={to}
            className={`relative px-2 py-1 text-gray-700 hover:text-blue-600 transition duration-300 ${extra || ''}`}
          >
            {label}
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* Sign Up Button */}
      <Link
        to="/signup"
        className="flex h-9 w-28 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold uppercase text-white shadow-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
      >
        Sign Up
      </Link>
    </nav>
  );
};

export default NavBar;
