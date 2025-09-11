import React from 'react';

const UploadPdf = () => {
  return (
    <div className="w-full px-6 mt-6">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 w-full">
        <h2 className="text-xl font-normal mb-6 text-gray-800">Upload Pdf:</h2>
        
        {/* Inner Box */}
        <div className="border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-normal mb-6 text-gray-700">Complete your Upload:</h3>
          
          {/* Upload Row */}
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-gray-700 whitespace-nowrap">Upload Document :</span>
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full bg-blue-50 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                value="Upload from Local"
                readOnly
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-8 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
              Upload Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPdf;
