// import React from "react";

// // --- START: SVG Icon Components for Visual Appeal ---
// const IconAdmin = ({ className = "w-10 h-10" }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>
// );
// const IconFaculty = ({ className = "w-10 h-10" }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
// );
// const IconStudent = ({ className = "w-10 h-10" }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
// );
// // --- END: SVG Icon Components ---

// // Reusable component for feature cards
// const FeatureCard = ({ icon, title, description }) => (
//   <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
//     <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
//       {icon}
//     </div>
//     <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//     <p className="text-gray-600 text-sm">{description}</p>
//   </div>
// );

// const About = () => {
//   return (
//     <div className=" bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* --- Hero Section --- */}
//       <section className="text-center py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
//           College Management System
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
//           A role-based web application to streamline and digitize core academic workflows, creating a centralized and efficient ecosystem for students, faculty, and administrators.
//         </p>
//       </section>

//       {/* --- Key Features (Role-Based) Section --- */}
//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             A Tailored Experience for Everyone
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <FeatureCard
//               icon={<IconAdmin />}
//               title="For Administrators"
//               description="Securely manage academic years, semesters, faculties, and user accounts. A powerful dashboard to oversee the entire academic structure."
//             />
//             <FeatureCard
//               icon={<IconFaculty />}
//               title="For Faculty"
//               description="Easily upload and manage syllabi, course materials, question papers, and important resources. A unified platform to support teaching."
//             />
//             <FeatureCard
//               icon={<IconStudent />}
//               title="For Students"
//               description="Register with email authentication, select your branch, and get instant access to all relevant academic content, anytime and anywhere."
//             />
//           </div>
//         </div>
//       </section>

//       {/* --- Problem & Solution Section --- */}
//       <section className="py-20 px-4 bg-white">
//         <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           {/* The Problem */}
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">The Challenge</h2>
//             <p className="text-gray-600 mb-4">
//               Traditional academic management is often fragmented and inefficient, relying on manual records, physical handouts, and disconnected tools. This leads to:
//             </p>
//             <ul className="space-y-2 text-gray-700">
//               <li className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span> Inaccuracies and errors in data.</li>
//               <li className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span> Delays and communication gaps.</li>
//               <li className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span> Limited accessibility to learning materials.</li>
//             </ul>
//           </div>
//           {/* The Solution */}
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-lg">
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Solution</h2>
//             <p className="text-gray-600">
//               Our proposed system centralizes and automates these operations. By providing a single, secure, and user-friendly platform, we eliminate manual work, enhance accuracy, and ensure real-time availability of all academic content.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* --- Objectives Section --- */}
//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             Core Objectives
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="font-bold text-lg text-blue-600">Streamline</h3>
//               <p className="text-gray-600">Eliminate manual processes and reduce paperwork.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="font-bold text-lg text-blue-600">Centralize</h3>
//               <p className="text-gray-600">Provide a single source of truth for all academic data.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="font-bold text-lg text-blue-600">Enhance Access</h3>
//               <p className="text-gray-600">Make resources available to students and faculty 24/7.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="font-bold text-lg text-blue-600">Promote Growth</h3>
//               <p className="text-gray-600">Create a scalable foundation for future digital tools.</p>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* --- NEW FOOTER: Call to Action Section --- */}
//       <section className="py-20 px-4 bg-gray-800 text-white">
//           <div className="max-w-5xl mx-auto text-center">
//               <h2 className="text-3xl font-bold mb-4">
//                 Ready to Transform Your Academic Experience?
//               </h2>
//               <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
//                 Discover how our College Management System can streamline operations, empower faculty, and enhance learning at your institution.
//               </p>
//               <button 
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
//               >
//                 Request a Demo
//               </button>
//           </div>
//       </section>

//     </div>
//   );
// };

// export default About;
import React from "react";

// Updated component for a profile card to display leadership information with an image
const ProfileCard = ({ name, title, description, imageUrl }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
    {/* --- Conditional Image Rendering --- */}
    <div className="w-28 h-28 bg-gray-200 rounded-full mb-4 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      ) : (
        // Fallback SVG placeholder if no imageUrl is provided
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      )}
    </div>
    <h3 className="text-xl font-bold text-gray-800">{name}</h3>
    <p className="text-blue-600 font-semibold mb-2">{title}</p>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);


const About = () => {
  return (
    <div className=" py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              TKR College of Engineering and Technology
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A modern temple of learning, providing a serene and tranquil environment to boost students' potential and prepare them for global competition.
          </p>
        </div>

        {/* --- History and Foundation Section --- */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our History</h2>
            <p className="text-gray-700 leading-relaxed">
              TKR College of Engineering and Technology, an offshoot of the TKR Educational Society, was established in *2002*. Situated on a sprawling, lush green 20-acre campus at Meerpet, Hyderabad, the college provides a serene and tranquil environment. Our goal is to boost our students' mental potential and prepare them in all aspects to face cut-throat global competition with confidence and emerge victorious.
            </p>
          </div>
        </section>

        {/* --- Leadership Section (Updated with Images) --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProfileCard
              name="Sri Teegala Krishna Reddy"
              title="Founder Chairman"
              description="The Mayor of Hyderabad and a philanthropist by nature. His vision is to make quality education accessible to all students, including those from rural areas, empowering them to pursue their dreams while upholding strong moral and ethical values."
              imageUrl="./src/assets/tkrimg.jpg" // <<-- REPLACE WITH ACTUAL IMAGE PATH
            />
            <ProfileCard
              name="Dr. T. Harinath Reddy"
              title="Secretary"
              description="The pivotal source of encouragement in the college. He puts in all his efforts to see students excel and is always looking for avenues to provide them with a cutting edge to develop their capabilities and potential."
              imageUrl="/./src/assets/hariimg.jpg" // <<-- REPLACE WITH ACTUAL IMAGE PATH
            />
            <ProfileCard
              name="Sri. T. Amarnath Reddy"
              title="Treasurer"
              description="He is dedicated to developing a global perspective among students to cope with the fast-changing technological landscape. He champions a holistic approach, focusing on values, discipline, and innovation to ensure students achieve their full potential."
              imageUrl="./src/assets/amarimg.jpg" // <<-- REPLACE WITH ACTUAL IMAGE PATH
            />
            <ProfileCard
              name="Dr. D. V. Ravi Shankar"
              title="Principal"
              description="An eminent academician who heads the college. He holds an AMIE in Mechanical Engineering, M.Tech, and a Ph.D from JNT University, Hyderabad. He has published numerous research papers in national and international journals."
              imageUrl="./src/assets/krishimg.jpg" // <<-- REPLACE WITH ACTUAL IMAGE PATH
            />
          </div>
        </section>

        {/* --- Vision & Mission Section --- */}
        <section className="mb-16">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
                <p className="text-gray-700 italic leading-relaxed">
                The Institution endeavors towards imparting quality education with ethical values and strives to make students technically competent to reach new heights, making them self-reliant and globally recognized.
                </p>
            </div>
            {/* Mission */}
            <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>To impart quality education integrated with unwavering ethical values.</li>
                    <li>To foster and cultivate technical competence among students, empowering them to ascend to new heights of achievement.</li>
                    <li>To nurture a dynamic learning environment that imparts skills and knowledge for self-reliance and global recognition.</li>
                </ul>
            </div>
           </div>
        </section>

        {/* --- Academics & Affiliation --- */}
        <section>
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Academics & Affiliation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The College is affiliated with *Jawaharlal Nehru Technological University (JNTU) Kukatpally, Hyderabad. It has been approved by **AICTE, New Delhi*, and the State Government of Telangana.
            </p>
            <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Courses Offered:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                        <h4 className="font-bold text-gray-700">Undergraduate (UG)</h4>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>Civil Engineering</li>
                            <li>Electrical & Electronics Engineering</li>
                            <li>Computer Science & Engineering</li>
                            <li>Computer Science & Engineering (Data Science)</li>
                            <li>Computer Science & Engineering specialization with AI and ML</li>
                            <li>Information Technology(IT)</li>
                            <li>Electronics & Communication Engineering</li>
                            <li>Mechanical Engineering</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-700">Postgraduate (PG)</h4>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>M.Tech in CSE</li>
                            <li>M.Tech in PE</li>
                            <li>MBA</li>
                        </ul>
                    </div>
                    <div className="md:col-span-2 mt-2">
                        <h4 className="font-bold text-gray-700">Polytechnic (2nd Shift)</h4>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>CIVIL, EEE, MECH, ECE & CSE</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;