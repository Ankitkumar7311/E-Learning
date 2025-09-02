import React, { useState } from 'react';

const Editmaterialedit = () => {
  const [uploadSource, setUploadSource] = useState('Upload from Local');

  const handleUploadSourceChange = (e) => {
    setUploadSource(e.target.value);
    console.log(`Selected upload source: ${e.target.value}`);
  };

  const handleUploadChanges = () => {
    // Logic to handle the upload of the document
    console.log('Uploading changes...');
    alert('Changes are being uploaded!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Upload Pdf:</h2>
        <div className="border border-gray-300 p-6 rounded-lg">
          <h3 className="text-md font-medium text-gray-600 mb-4">Complete your Upload:</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Upload Document :</span>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={uploadSource}
                onChange={handleUploadSourceChange}
              >
                <option>Upload from Local</option>
                <option>Upload from Drive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300 mt-4"
              onClick={handleUploadChanges}
            >
              Upload Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editmaterialedit;
