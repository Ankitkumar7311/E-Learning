
import { useState } from "react";

const FacultyRemovePopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOk = () => {
    
    console.log("Faculty data printed in console");
    setIsOpen(false); 
  };

  return (
    <>
      
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg "
      >
        Remove faculty
      </button>

      
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h1 className="text-2xl font-bold mb-6">
              Faculty removed successfully
            </h1>

            <button
              onClick={handleOk}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg "
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyRemovePopup;
