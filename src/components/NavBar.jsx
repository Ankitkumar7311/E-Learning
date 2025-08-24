import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='h-16 flex flex-row justify-evenly items-center bg-[#E3EBFF] shadow-md'>
      <Link to="/"><h1 className='text-xl font-semibold text-gray-800'>Mrs.College Guide</h1></Link>
      <Link to="/universities"><h1>Universities</h1></Link>
      <Link to="/courses"><h1>Courses</h1></Link>
      <Link to="/community"><h1>Community</h1></Link>
      <Link to="/news"><h1>News</h1></Link>
      <Link to="/about"><h1>About</h1></Link>
      <Link to="/login"><h1 className='uppercase font-bold'>Login</h1></Link>
      <Link to="/signup">
        <h1 className='rounded bg-yellow-500 h-8 w-24 flex items-center justify-center text-white uppercase hover:bg-yellow-600 shadow'>
          Sign Up
        </h1>
      </Link>
    </nav>
  );
};

export default NavBar;
