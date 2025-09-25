import React from "react";
import { Link } from "react-router-dom";

// ✅ Import your PNG images
import academic22 from "../../assets/academic22.png";
import fac from "../../assets/faculty-p.png";
import req from "../../assets/request-q.png";
import ann from "../../assets/annc.png";

// Main Documents component
const Documents = () => {
  const latestItems = [
    {
      name: "Academic Calendar",
      icon: academic22,
      route: "/student/academic-calendar",
    },
    { name: "Faculty Provided QB", icon: fac, route: "/student/faculty-qb" },
    {
      name: "Request Question on Topic",
      icon: req,
      route: "/student/request-question",
    },
    { name: "Announcement", icon: ann, route: "/student/announcements" },
  ];

  const subjects = [
    { name: "Encapsulation", route: "/student/subjects/encapsulation" },
    { name: "Inheritance", route: "/student/subjects/inheritance" },
    { name: "Polymorphism", route: "/student/subjects/polymorphism" },
    { name: "Abstraction", route: "/student/subjects/abstraction" },
    { name: "Interface", route: "/student/subjects/interface" },
    {
      name: "Advantages/Dis-Advantages Of Objects",
      route: "/student/subjects/advantages",
    },
  ];

  const pyqs = [
    "Summer 2022-2023",
    "Winter 2022-2023",
    "Summer 2022-2023",
    "Summer 2022-2023",
    "Summer 2022-2023",
    "Summer 2022-2023",
  ];

  return (
    <>
      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Latest Section */}
        <section className="mb-3">
          <h2 className="text-xl font-bold mb-4">Latest:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {latestItems.map((item, index) => (
              <Link
                key={index}
                to={item.route}
                className="relative bg-gray-100 p-3 rounded-lg text-center flex flex-col items-center justify-center space-y-2 shadow-sm transition-transform transform hover:scale-105"
              >
                <div
                  key={index}
                  className="relative bg-gray-100 p-3 rounded-lg text-center flex flex-col items-center justify-center space-y-2 shadow-sm transition-transform transform hover:scale-105"
                >
                  {/* ✅ PNG recolored to orange-300 */}
                  <div className="w-30 h-25 flex items-center justify-center rounded-lg  bg-[#F3B900]">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-10 h-10 object-contain  "
                    />
                  </div>
                  <p className="text-base font-semibold text-blue-600">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subject & PYQs Sections */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Subject Section */}
          <section className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner ">
            <h2 className="text-xl font-bold mb-4">Subject:</h2>
            <div className="space-y-2 mb-4">
              {subjects.map((subject, index) => (
                <Link key={index} to={subject.route}>
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 bg-gray-200 text-blue-600 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200"
                  >
                    {subject.name}
                  </button>
                </Link>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="cursor-pointer hover:text-blue-500">
                &lt;&lt; Prev. Page
              </span>
              <span className="cursor-pointer hover:text-blue-500">
                Next Page &gt;&gt;
              </span>
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
              <span className="cursor-pointer hover:text-blue-500">
                &lt;&lt; Prev. Page
              </span>
              <span className="cursor-pointer hover:text-blue-500">
                Next Page &gt;&gt;
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Documents;
