// import React from "react";

// // Reusable card component for a facility/feature
// const FacilityCard = ({ icon, title, description }) => (
//   <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 group">
//     <div className="text-blue-600 mb-4 text-5xl group-hover:text-blue-800 transition-colors duration-300">
//       {icon}
//     </div>
//     <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
//       {title}
//     </h3>
//     <p className="text-gray-600 text-sm leading-relaxed">
//       {description}
//     </p>
//   </div>
// );

// const Facilities = () => {
//   return (
//     <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* --- Header Section --- */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
//             A Digital Campus Ecosystem
//           </h1>
//           <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//             Our College Management System is designed to streamline academic workflows by providing a centralized, efficient, and user-friendly digital platform for everyone in your institution.
//           </p>
//         </div>

//         {/* --- System Features Grid --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           <FacilityCard
//             icon="🛡️"
//             title="Secure Role-Based Access"
//             description="Tailored dashboards and functionalities for Admins, Faculty, and Students, ensuring users only access information relevant to their role."
//           />
//           <FacilityCard
//             icon="⚙️"
//             title="Centralized Admin Control"
//             description="Admins can easily manage academic years, semesters, faculty details, and all user accounts from a single, powerful control panel."
//           />
//           <FacilityCard
//             icon="📤"
//             title="Dynamic Resource Upload"
//             description="Faculty can effortlessly upload and organize syllabi, video lectures, course materials, and previous year question papers in PDF format."
//           />
//           <FacilityCard
//             icon="🎓"
//             title="On-Demand Student Access"
//             description="Students can register, select their branch, and instantly access all relevant academic content, study materials, and exam resources 24/7."
//           />
//           <FacilityCard
//             icon="📝"
//             title="Comprehensive Exam Prep"
//             description="Provides a dedicated repository for previous year question papers and faculty-curated important questions to boost student preparation."
//           />
//           <FacilityCard
//             icon="🗺️"
//             title="Interactive Syllabus Management"
//             description="A clear and organized syllabus module where faculty can detail topics and attach resources, and students can track their progress."
//           />
//           <FacilityCard
//             icon="💬"
//             title="Streamlined Communication"
//             description="Promotes better interaction between students and faculty by ensuring academic updates and materials are accessible from one central place."
//           />
//           <FacilityCard
//             icon="🌐"
//             title="24/7 Digital Campus"
//             description="Eliminates the dependency on physical records and notice boards by making all academic information accessible online, anytime."
//           />
//           <FacilityCard
//             icon="🚀"
//             title="Scalable & Future-Ready"
//             description="Built on a robust Django framework, the system is ready for future enhancements like performance tracking and LMS tool integration."
//           />
//         </div>

//         {/* --- Call to Action --- */}
//         <div className="text-center mt-16 p-8 bg-blue-600 text-white rounded-lg shadow-xl">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Digitize Your Institution?</h2>
//           <p className="text-lg mb-6">
//             See how our College Management System can reduce manual workload, improve accessibility, and create a modern learning environment.
//           </p>
//           <a 
//             href="/contact" // You can link this to a contact or demo request page
//             className="inline-block bg-white text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-900 transition-all duration-300"
//           >
//             Request a Demo
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Facilities;
import React from "react";

// Reusable card component for a facility
const FacilityCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 group">
    <div className="text-blue-600 mb-4 text-5xl group-hover:text-blue-800 transition-colors duration-300">
      {icon} {/* This will be an emoji or an icon placeholder */}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

const Facilities = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Our Vibrant Community & Facilities
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Beyond academics, our campus thrives as a hub of activity, offering a rich array of facilities designed to support your growth, well-being, and social connections. Discover spaces where ideas flourish, talents are honed, and friendships are forged.
          </p>
        </div>

        {/* --- Facilities Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FacilityCard
            icon="📚"
            title="State-of-the-Art Library"
            description="A quiet sanctuary for learning and research, our library boasts a vast collection of physical and digital resources, comfortable study zones, and access to leading academic databases."
          />
          <FacilityCard
            icon="⚽"
            title="Sports & Recreation Complex"
            description="Stay active and engaged! Our modern sports complex includes fields for various outdoor games, an indoor stadium for badminton and table tennis, and a well-equipped gymnasium."
          />
          <FacilityCard
            icon="🍽"
            title="Hygienic Canteens & Food Courts"
            description="Fuel your day with delicious and healthy meals. Our canteens and food courts offer a diverse menu, ensuring a variety of options to suit every taste and dietary need."
          />
          <FacilityCard
            icon="🚌"
            title="Comfortable Transportation"
            description="Ensuring hassle-free commutes, our robust transportation system connects major city points to the campus, providing safe and comfortable travel for all students and staff."
          />
          <FacilityCard
            icon="💡"
            title="Advanced Laboratories"
            description="Ignite your practical skills in our cutting-edge laboratories. Equipped with the latest technology, they provide hands-on experience crucial for innovation and research across all disciplines."
          />
          <FacilityCard
            icon="🩺"
            title="Health & Wellness Center"
            description="Your well-being is our priority. Our campus features a dedicated health center with medical professionals, first-aid facilities, and counseling services to support your physical and mental health."
          />
          <FacilityCard
            icon="🏠"
            title="Secure Hostel Accommodation"
            description="Experience a home away from home with our separate, well-maintained hostels for boys and girls. We provide a safe, comfortable, and nurturing environment with 24/7 security, dedicated wardens, furnished rooms, and common recreational areas to foster community living."
          />
          <FacilityCard
            icon="🎉"
            title="Auditoriums & Seminar Halls"
            description="Host and attend inspiring events! Our spacious auditoriums and modern seminar halls are perfect venues for conferences, cultural programs, guest lectures, and student presentations."
          />
           <FacilityCard
            icon="🤝"
            title="Student Activity Centers"
            description="Discover your passion and connect with peers! These vibrant hubs host various clubs, workshops, and student-led initiatives, fostering creativity, leadership, and community engagement."
          />
        </div>

        {/* --- Call to Action / Further Info --- */}
        <div className="text-center mt-16 p-8 bg-blue-600 text-white rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Growing Community!</h2>
          <p className="text-lg mb-6">
            We believe a strong community enhances the educational journey. Explore our facilities and become a part of something great.
          </p>
          <a 
            href="/contact" // You might want to link this to a contact or visit page
            className="inline-block bg-white text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-900 transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Facilities;