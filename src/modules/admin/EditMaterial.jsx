import React, { useState } from 'react';
import logo from '../../assets/Ellipse.png';
import Editmaterialedit from './Editmaterialedit';

const EditMaterial = () => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      {/* Main Section */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        {!showEdit ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Material
            </h2>
            <input
              type="text"
              placeholder="Enter Material Id"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100"
            />
            <button
              className="w-full py-2 font-bold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
              onClick={() => setShowEdit(true)}
            >
              Edit
            </button>
          </div>
        ) : (
          <Editmaterialedit />
        )}
      </main>
    </>
  );
};

export default EditMaterial;
