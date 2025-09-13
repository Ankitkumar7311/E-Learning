import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
          About Us
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Welcome to <span className="font-semibold text-blue-600">Mrs.College Guide</span>! 
          Here you can explore everything about our mission, vision, and 
          services that help students discover the best opportunities. 
          Our goal is to make education guidance simple, accessible, and effective.
        </p>
      </div>
    </div>
  );
};

export default About;
