import React from "react";

// Sub-component for displaying a statistic
const StatCard = ({ value, label }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <span className="text-4xl font-extrabold text-blue-600">{value}</span>
    <p className="text-sm text-gray-600 mt-2 font-semibold">{label}</p>
  </div>
);

// Sub-component for displaying a resource link
const ResourceLink = ({ title }) => (
  <a
    href="#"
    className="bg-white p-4 rounded-lg shadow-md text-center font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300"
  >
    {title}
  </a>
);

const CentralLibrary = () => {
  const resources = [
    "Our Team", "N-List", "Downloads", "Gallery", "Resources", 
    "JNTUH-eLSDM", "Digital Library", "IEEE Digital Library", "Advisory Committee", 
    "Library Sections", "E-Resources", "Layout & Floor Plan", "Question Papers", 
    "Rules & Regulations", "Working Hours", "Borrowing Facility", "Merit Card"
  ];
  
  // Define librarian info, including the new imageUrl
  const librarian = {
      name: "Mr. G. Srinivas Reddy",
      title: "Chief Librarian",
      qualifications: "M.Sc, M.A, B.Ed, M.LI.Sc, PGDLAN, M.Phil, (Ph.D)",
      address1: "TKR College of Engineering & Technology",
      address2: "Meerpet, Balapur, Hyderabad-500097.",
      phone: "9949139414, 8498085220",
      email: "tkreslibrary@gmail.com",
      imageUrl: "/src/assets/srinivas.jpg" // <<-- REPLACE WITH ACTUAL IMAGE PATH
  };

  return (
    <div className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Central Library
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            The gateway to knowledge and culture, our library is a fully equipped, integrated knowledge center for students and faculty.
          </p>
        </div>

        {/* --- Stats Section --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatCard value="1,740+" label="Carpet Area (sqm)" />
          <StatCard value="94,760" label="Volumes" />
          <StatCard value="6,230" label="e-Journals" />
          <StatCard value="163" label="Print Journals" />
        </section>

        {/* --- About Section --- */}
        <section className="bg-white p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Our Library</h2>
          <p className="text-gray-700 leading-relaxed">
            Established in 2002, the Central Library at TKR College of Engineering & Technology is a temple of learning. Located on the 2nd and 3rd floors of the Central Block, it spans a carpet area of over 1740 sqm. Our library is a fully automated, modern facility using barcode technology. It houses an extensive collection of **94,760 volumes** and **12,086 titles** across all disciplines, including Polytechnic, B.Tech, M.Tech, and MBA. We also provide access to national and international journals, technical magazines, and online resources through EBSCO-IEEE, INFLIBNET N-List, and DELNET.
          </p>
        </section>

        {/* --- Vision & Mission Section --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-700 italic">
              “To become one of the pioneers in the state in the field of information resources, services and technology applications.”
            </p>
          </div>
          <div className="bg-green-50 p-8 rounded-lg border-l-4 border-green-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-700 italic">
              “To provide information resources and excellent services to all its stakeholders along with an appropriate environment for information access, learning, and research activities.”
            </p>
          </div>
        </section>
        
        {/* --- Resources & Links Section --- */}
        <section className="mb-16">
           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Resources & Information</h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {resources.map(link => <ResourceLink key={link} title={link} />)}
           </div>
        </section>

        {/* --- Librarian Contact Section (Updated) --- */}
        <section className="bg-white p-8 rounded-lg shadow-lg">
           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contact Us</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-4xl mx-auto">
             {/* Image Section */}
             <div className="md:col-span-1 flex justify-center items-center"> {/* Added items-center here */}
                <div className="w-48 h-48 bg-gray-200 rounded-full shadow-lg overflow-hidden border-4 border-blue-100">
                    <img src={librarian.imageUrl} alt={librarian.name} className="w-full h-full object-cover" />
                </div>
             </div>
             {/* Details Section */}
             <div className="md:col-span-2 text-center md:text-left">
               <h3 className="text-2xl font-semibold text-gray-900">{librarian.name}</h3>
               <p className="text-blue-600 font-medium">{librarian.title}</p>
               <p className="text-sm text-gray-500 mt-1 mb-4">{librarian.qualifications}</p>
               <p className="text-gray-700">{librarian.address1}</p>
               <p className="text-gray-600">{librarian.address2}</p>
               <div className="mt-4">
                   <p className="text-gray-800"><b>Phone:</b> {librarian.phone}</p>
                   <p className="text-gray-800"><b>Email:</b> {librarian.email}</p>
               </div>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default CentralLibrary;