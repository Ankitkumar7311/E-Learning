
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
   
    setIsOpen(false);
    navigate("/StudentSection"); 
  };

  return (
    <>
      
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Logout
      </button>

      {/* Popup */}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h1 className="text-2xl font-bold mb-3">Logout from your account</h1>
            <h3 className="text-lg text-gray-600 mb-6">Do you want to logout?</h3>

            <div className="flex justify-center gap-4">
              
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg bg-yellow-500 "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
