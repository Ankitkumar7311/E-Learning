import React, { useState } from "react";

const UploadPdf = () => {
  const [fileName, setFileName] = useState("Upload from Local");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload PDF</h2>
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4 text-gray-700">Complete your Upload</h3>

        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
          <label
            htmlFor="uploadDocument"
            className="w-full md:w-1/3 text-gray-700 font-medium"
          >
            Upload Document:
          </label>

          <div className="relative w-full md:w-2/3">
            <input
              type="file"
              id="uploadDocument"
              className="absolute inset-0 z-50 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="flex justify-between items-center border border-gray-300 rounded-md py-2 px-4 bg-blue-100 text-gray-600">
              <span className="truncate">{fileName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
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

        <div className="text-center">
          <button
            className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Upload Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPdf;
