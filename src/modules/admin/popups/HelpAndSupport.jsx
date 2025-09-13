import { useState } from "react";

const HelpAndSupport = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOk = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
      >
        Help & Support
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h1 className="text-xl font-bold mb-4">Contact Below Number:</h1>

            <div className="flex flex-col gap-2 mb-6">
              <p>9876543210</p>
              <p>7896541230</p>
              <p>7418529630</p>
            </div>

            <button
              onClick={handleOk}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpAndSupport;
