import React from 'react';
import { Link } from 'react-router-dom';

// ✅ Import your PNG images
import academic22 from '../../assets/academic22.png';
import fac from '../../assets/faculty-p.png';
import req from '../../assets/request-q.png';
import ann from '../../assets/annc.png';

// Main Documents component
const Documents = () => {
  const latestItems = [
    { name: "Academic Calendar", icon: academic22 },
    { name: "Faculty Provided QB", icon: fac },
    { name: "Request Question on Topic", icon: req },
    { name: "Announcement", icon: ann }
  ];

  const subjects = [
    "Encapsulation", "Inheritance", "Polymorphism",
    "Abstraction", "Interface", "Advantages/Dis-Advantages Of Objects"
  ];

  const pyqs = [
    "Summer 2022-2023", "Winter 2022-2023", "Summer 2022-2023",
    "Summer 2022-2023", "Summer 2022-2023", "Summer 2022-2023"
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-8">
      {/* Header */}
      <header className="flex items-center justify-between p-4 text-black rounded-lg shadow-md mb-8 flex-wrap">
        <div className="flex items-center space-x-2">
          <img src="https://placehold.co/40x40/ffffff/blue?text=🎓" alt="Logo" className="rounded-full w-10 h-10" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Study Material</h1>
            <p className="text-xs">Vidya Sarthi</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 flex-wrap">
          <button className="px-4 py-2 bg-white text-blue-500 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200">College Material</button>
          <Link to='/request-report' className="text-sm font-semibold">Help & Support</Link>
          <Link  to='/student-login' className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-bold shadow-md hover:bg-yellow-300 transition-colors duration-200">Log out</Link>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Latest Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Latest:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {latestItems.map((item, index) => (
              <div
                key={index}
                className="relative bg-gray-100 p-6 rounded-lg text-center flex flex-col items-center justify-center space-y-2 shadow-sm transition-transform transform hover:scale-105"
              >
                {/* ✅ PNG recolored to orange-300 */}
                <div className="w-full h-34 flex items-center justify-center rounded-lg  bg-[#F3B900]">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-12 h-12 object-contain  "
                  
                  />
                </div>
                <p className="text-base font-semibold text-blue-600">{item.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Subject & PYQs Sections */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Subject Section */}
          <section className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold mb-4">Subject:</h2>
            <div className="space-y-2 mb-4">
              {subjects.map((subject, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 bg-gray-200 text-blue-600 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200"
                >
                  {subject}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="cursor-pointer hover:text-blue-500">&lt;&lt; Prev. Page</span>
              <span className="cursor-pointer hover:text-blue-500">Next Page &gt;&gt;</span>
            </div>
          </section>

          {/* PYQs Section */}
          <section className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold mb-4">PYQs:</h2>
            <div className="space-y-2 mb-4">
              {pyqs.map((pyq, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 bg-gray-200 text-blue-600 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200"
                >
                  {pyq}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="cursor-pointer hover:text-blue-500">&lt;&lt; Prev. Page</span>
              <span className="cursor-pointer hover:text-blue-500">Next Page &gt;&gt;</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documents;
