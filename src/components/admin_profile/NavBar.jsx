import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='h-16 text-xl flex flex-row justify-evenly items-center bg-[#E3EBFF] shadow-md  decoration-none' style={{textDecoration:"none"}}>
      <Link to="/" className="text-2xl font-semibold text-gray-800 decoration-none">Mrs.College Guide</Link>
      <Link to="/universities" className="font-medium hover:text-blue-600">Universities</Link>
      <Link to="/courses" className="font-medium  hover:text-blue-600">Courses</Link>
      <Link to="/community" className="font-medium  hover:text-blue-600">Community</Link>
      <Link to="/news" className="font-medium  hover:text-blue-600">News</Link>
      <Link to="/about" className="font-medium  hover:text-blue-600">About</Link>
      <Link to="/login" className="uppercase font-semibold  hover:text-blue-600">Login</Link>
      <Link
        to="/signup"
        className="rounded bg-yellow-500 h-8 w-24 flex items-center justify-center text-white uppercase font-semibold hover:bg-yellow-600 shadow decoration-none"
      >
        Sign Up
      </Link>
    </nav>
  );
};

export default NavBar;
