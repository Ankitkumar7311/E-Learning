import React from "react";

// A reusable card component for displaying each course
const CourseCard = ({ title, abbreviation, intake }) => (
  <div className="bg-blue-100 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out p-6 text-center">
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    {abbreviation && (
        <p className="text-sm text-gray-500 mb-3">({abbreviation})</p>
    )}
    <div className="mt-4">
      <span className="text-gray-600">Annual Intake: </span>
      <span className="text-2xl font-bold text-blue-600">{intake}</span>
    </div>
  </div>
);

// Main Courses component
const Courses = () => {
  // Data for all courses organized by category
  const ugCourses = [
    { title: "Civil Engineering", abbreviation: "Civil", intake: 30 },
    { title: "Electrical & Electronics Engineering", abbreviation: "EEE", intake: 30 },
    { title: "Electronics & Communication Engineering", abbreviation: "ECE", intake: 180 },
    { title: "Computer Science & Engineering", abbreviation: "CSE", intake: 420 },
    { title: "CSE (Data Science)", abbreviation: "CSD", intake: 180 },
    { title: "CSE (AI & Machine Learning)", abbreviation: "CSM", intake: 180 },
    { title: "Information Technology", abbreviation: "IT", intake: 120 },
    { title: "CSE (AI & ML)", abbreviation: null, intake: 270 },
    { title: "CSE (DS)", abbreviation: null, intake: 210 },
  ];

  const pgCourses = [
    { title: "Power Electronics", abbreviation: "EEE (P.E)", intake: 24 },
    { title: "Computer Science & Engineering", abbreviation: "CSE", intake: 24 },
    { title: "Master of Business Administration", abbreviation: "MBA", intake: 60 },
  ];

  const diplomaCourses = [
    { title: "Diploma in Civil Engineering", abbreviation: "DCE", intake: 60 },
    { title: "Diploma in Electrical & Electronics", abbreviation: "DEEE", intake: 120 },
    { title: "Diploma in Mechanical Engineering", abbreviation: "DME", intake: 120 },
    { title: "Diploma in Electronics & Communication", abbreviation: "DECE", intake: 120 },
    { title: "Diploma in Computer Engineering", abbreviation: "DCME", intake: 60 },
  ];

  return (
    <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Our Academic Programs
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the diverse range of undergraduate, postgraduate, and diploma courses we offer.
          </p>
        </div>

        {/* --- Undergraduate (UG) Courses --- */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-500 pb-3">
            Undergraduate Programs (B.Tech)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ugCourses.map((course) => (
              <CourseCard key={course.title + course.intake} {...course} />
            ))}
          </div>
        </div>

        {/* --- Postgraduate (PG) Courses --- */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-green-500 pb-3">
            Postgraduate Programs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pgCourses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>

        {/* --- Diploma Courses --- */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-purple-500 pb-3">
            Diploma Programs (2nd Shift)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {diplomaCourses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;