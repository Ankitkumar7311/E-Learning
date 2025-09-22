import React from "react";

const RegulationAddedpopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4 sm:px-6">
      <div className="relative bg-white shadow-md drop-shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-[300px] sm:max-w-md md:max-w-lg text-center h-auto min-h-[16rem]">
        
        {/* Close (X) Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
        >
          ✖
        </button>

        {/* Popup Content */}
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-6">
            Regulation Added Successfully
          </h2>

          <button
            onClick={onClose}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all w-[7rem] sm:w-[8rem]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegulationAddedpopup;
