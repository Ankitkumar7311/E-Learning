import React from 'react';

// Main Documents component
const Documents = () => {
  const latestItems = [
    { name: "Academic Calendar", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-yellow-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Z" />
      </svg>
    ) },
    { name: "Faculty Provided QB", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-blue-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 8.25H6.75h1.5A1.125 1.125 0 0 1 10.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 8.25H6.75M12 18.75h.008v.008H12v-.008ZM19.5 14.25a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-2.25a2.25 2.25 0 0 1 2.25-2.25m15 4.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-2.25a2.25 2.25 0 0 1 2.25-2.25m-6.75 6.75h.008v.008h-.008v-.008ZM19.5 18.75h.008v.008h-.008v-.008Zm-9-6h.008v.008H10.5v-.008ZM6.75 12h.008v.008H6.75v-.008ZM12 12h.008v.008H12v-.008Zm4.5-6.75h.008v.008h-.008V5.25Z" />
      </svg>
    ) },
    { name: "Request Question on Topic", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-purple-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.5A1.5 1.5 0 0 1 3 12h.75m0 0a1.5 1.5 0 0 0 1.5 1.5H7.5m-4.5-3v-2.25c0-.853.504-1.63 1.265-1.956L8.25 6m-4.5 5.25a1.5 1.5 0 0 0 1.5 1.5h.75m-4.5-3h9m-9-3h9m-.75 6.75a1.5 1.5 0 0 1-1.5 1.5h-.75m4.5-5.25v-2.25c0-.853-.504-1.63-1.265-1.956L8.25 6" />
      </svg>
    ) },
    { name: "Announcement", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-yellow-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5l7.5-7.5-7.5-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5l7.5-7.5-7.5-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5l7.5-7.5-7.5-7.5" />
      </svg>
    ) }
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
      <header className="flex items-center justify-between p-4  text-black rounded-lg shadow-md mb-8 flex-wrap">
        <div className="flex items-center space-x-2">
          <img src="https://placehold.co/40x40/ffffff/blue?text=🎓" alt="Logo" className="rounded-full w-10 h-10" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Study Material</h1>
            <p className="text-xs">Vidya Sarthi</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 flex-wrap">
          <button className="px-4 py-2 bg-white text-blue-500 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200">College Material</button>
          <div className="text-sm font-semibold">Help & Support</div>
          <button className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-bold shadow-md hover:bg-yellow-300 transition-colors duration-200">Log out</button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Latest Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Latest:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {latestItems.map((item, index) => (
              <div key={index} className="relative bg-gray-100 p-6 rounded-lg text-center flex flex-col items-center justify-center space-y-2 shadow-sm transition-transform transform hover:scale-105">
                {item.request && (
                  <div className="absolute top-2 right-2 bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">{item.request}</div>
                )}
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-inner">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-blue-600">{item.name}</p>
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
                <button key={index} className="w-full text-left px-4 py-2 bg-gray-200 text-blue-600 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200">{subject}</button>
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
                <button key={index} className="w-full text-left px-4 py-2 bg-gray-200 text-blue-600 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200">{pyq}</button>
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
