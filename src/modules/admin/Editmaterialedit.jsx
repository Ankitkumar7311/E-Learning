import React, { useState } from 'react';

const Editmaterialedit = () => {
  const [uploadSource, setUploadSource] = useState('Upload from Local');

  const handleUploadSourceChange = (e) => {
    setUploadSource(e.target.value);
    console.log(`Selected upload source: ${e.target.value}`);
  };

  const handleUploadChanges = () => {
    console.log('Uploading changes...');
    alert('Changes are being uploaded!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload Pdf:</h2>
        
        <div className="border border-gray-300 p-6 rounded-lg">
          <h3 className="text-md font-medium text-gray-600 mb-6">Complete your Upload:</h3>

          <div className="flex flex-col gap-4 mb-6">
            <label className="text-gray-600 font-medium">Upload Document:</label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <select
                className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:border-blue-500"
                value={uploadSource}
                onChange={handleUploadSourceChange}
              >
                <option>Upload from Local</option>
                <option>Upload from Drive</option>
              </select>
              <input
                type="file"
                className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
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