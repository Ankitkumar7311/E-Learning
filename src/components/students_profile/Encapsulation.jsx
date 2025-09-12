import React, { useState } from 'react';
import StudentNavBar from '../navbars/StudentNavBar'

const Encapsulation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // This should be dynamic based on your PDF
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const tutorialUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your tutorial URL

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <StudentNavBar /> */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">

          {/* PDF Viewer Section */}
          <div className="flex justify-center mb-6">
            <div className="h-[600px] w-full max-w-2xl border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="h-full w-full flex flex-col items-center justify-center text-gray-500">
                <p>PDF Viewer Placeholder</p>
                <p>Current Page: {currentPage}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mb-6">
            <a href={tutorialUrl} target="_blank" rel="noopener noreferrer">
              <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
                Watch Tutorial
              </button>
            </a>
            <a href={pdfUrl} download>
              <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
                Download PDF
              </button>
            </a>
          </div>

          {/* Navigation Section */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`text-blue-600 font-bold hover:underline ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              &lt;&lt; Prev. Page
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`text-blue-600 font-bold hover:underline ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next Page &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encapsulation;