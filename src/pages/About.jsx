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
              TKR College of Engineering and Technology, an offshoot of the TKR Educational Society, was established in **2002**. Situated on a sprawling, lush green 20-acre campus at Meerpet, Hyderabad, the college provides a serene and tranquil environment. Our goal is to boost our students' mental potential and prepare them in all aspects to face cut-throat global competition with confidence and emerge victorious.
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
              imageUrl="./src/assets/tkrimg.jpg"
            />
            <ProfileCard
              name="Dr. T. Harinath Reddy"
              title="Secretary"
              description="The pivotal source of encouragement in the college. He puts in all his efforts to see students excel and is always looking for avenues to provide them with a cutting edge to develop their capabilities and potential."
              imageUrl="/./src/assets/hariimg.jpg" 
            />
            <ProfileCard
              name="Sri. T. Amarnath Reddy"
              title="Treasurer"
              description="He is dedicated to developing a global perspective among students to cope with the fast-changing technological landscape. He champions a holistic approach, focusing on values, discipline, and innovation to ensure students achieve their full potential."
              imageUrl="./src/assets/amarimg.jpg" 
            />
            <ProfileCard
              name="Dr. D. V. Ravi Shankar"
              title="Principal"
              description="An eminent academician who heads the college. He holds an AMIE in Mechanical Engineering, M.Tech, and a Ph.D from JNT University, Hyderabad. He has published numerous research papers in national and international journals."
              imageUrl="./src/assets/krishimg.jpg" 
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
              The College is affiliated with **Jawaharlal Nehru Technological University (JNTU) Kukatpally, Hyderabad**. It has been approved by **AICTE, New Delhi**, and the State Government of Telangana.
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