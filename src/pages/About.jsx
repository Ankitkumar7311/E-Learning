import React from "react";

// --- START: SVG Icon Components for Visual Appeal ---
const IconAdmin = ({ className = "w-10 h-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>
);
const IconFaculty = ({ className = "w-10 h-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
);
const IconStudent = ({ className = "w-10 h-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
);
// --- END: SVG Icon Components ---

// Reusable component for feature cards
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const About = () => {
  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* --- Hero Section --- */}
      <section className="text-center py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          College Management System
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          A role-based web application to streamline and digitize core academic workflows, creating a centralized and efficient ecosystem for students, faculty, and administrators.
        </p>
      </section>

      {/* --- Key Features (Role-Based) Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            A Tailored Experience for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<IconAdmin />}
              title="For Administrators"
              description="Securely manage academic years, semesters, faculties, and user accounts. A powerful dashboard to oversee the entire academic structure."
            />
            <FeatureCard
              icon={<IconFaculty />}
              title="For Faculty"
              description="Easily upload and manage syllabi, course materials, question papers, and important resources. A unified platform to support teaching."
            />
            <FeatureCard
              icon={<IconStudent />}
              title="For Students"
              description="Register with email authentication, select your branch, and get instant access to all relevant academic content, anytime and anywhere."
            />
          </div>
        </div>
      </section>

      {/* --- Problem & Solution Section --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* The Problem */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Challenge</h2>
            <p className="text-gray-600 mb-4">
              Traditional academic management is often fragmented and inefficient, relying on manual records, physical handouts, and disconnected tools. This leads to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span> Inaccuracies and errors in data.</li>
              <li className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span> Delays and communication gaps.</li>
              <li className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span> Limited accessibility to learning materials.</li>
            </ul>
          </div>
          {/* The Solution */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Solution</h2>
            <p className="text-gray-600">
              Our proposed system centralizes and automates these operations. By providing a single, secure, and user-friendly platform, we eliminate manual work, enhance accuracy, and ensure real-time availability of all academic content.
            </p>
          </div>
        </div>
      </section>

      {/* --- Objectives Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Core Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-blue-600">Streamline</h3>
              <p className="text-gray-600">Eliminate manual processes and reduce paperwork.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-blue-600">Centralize</h3>
              <p className="text-gray-600">Provide a single source of truth for all academic data.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-blue-600">Enhance Access</h3>
              <p className="text-gray-600">Make resources available to students and faculty 24/7.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-blue-600">Promote Growth</h3>
              <p className="text-gray-600">Create a scalable foundation for future digital tools.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- NEW FOOTER: Call to Action Section --- */}
      <section className="py-20 px-4 bg-gray-800 text-white">
          <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Academic Experience?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover how our College Management System can streamline operations, empower faculty, and enhance learning at your institution.
              </p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Request a Demo
              </button>
          </div>
      </section>

    </div>
  );
};

export default About;