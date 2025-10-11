import React from "react";
// "Link" is no longer needed, so the import has been removed.

// A reusable card component for displaying each course's resources
const CourseCard = ({ title, abbreviation, description }) => (
  <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out p-6 flex flex-col text-center">
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      {abbreviation && (
        <p className="text-sm text-gray-500 mb-3">({abbreviation})</p>
      )}
      <p className="text-sm text-gray-700 mt-3 leading-relaxed">
        {description}
      </p>
    </div>
    {/* The div containing the "View Resources" button has been removed from here. */}
  </div>
);

// Main Courses component
const Courses = () => {
  // Data for the B.Tech courses that have resources available
  const btechResources = [
    { 
      title: "Computer Science & Engineering", 
      abbreviation: "CSE", 
      description: "Access notes, materials, and question banks covering algorithms, software development, and computer architecture."
    },
    {
      title: "Artificial Intelligence & Machine Learning",
      abbreviation: "AI-ML",
      description: "Find resources for intelligent systems, data-driven automation, and advanced analytics for your AI & ML coursework."
    },
    { 
      title: "Data Science", 
      abbreviation: "DS", 
      description: "All the materials you need to master data extraction, analysis, and visualization to drive decision-making."
    },
    { 
      title: "Electronics & Communication", 
      abbreviation: "ECE", 
      description: "Resources on electronic circuits, communication systems, and integrated circuits that power modern devices."
    },
    { 
      title: "Information Technology", 
      abbreviation: "IT", 
      description: "Coursework materials covering networking, cybersecurity, databases, and modern system administration."
    },
    {
      title: "Mechanical Engineering",
      abbreviation: "MECH",
      description: "A complete resource bank for designing, analyzing, and manufacturing complex mechanical systems."
    },
    { 
      title: "Electrical & Electronics Engineering", 
      abbreviation: "EEE", 
      description: "Explore notes and question papers on power generation, transmission, and modern electronic control systems."
    },
    { 
      title: "Civil Engineering", 
      abbreviation: "Civil", 
      description: "Get access to materials for designing and building the infrastructure of modern society, like bridges and buildings."
    },
  ];

  return (
    <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Your B.Tech Resource Hub
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Access comprehensive study materials, notes, and question banks for all your B.Tech subjects, organized by branch.
          </p>
        </div>

        {/* --- B.Tech Resource Branches --- */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-500 pb-3">
            Select Your Branch
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {btechResources.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;