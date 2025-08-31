import Modal from "react-modal";

Modal.setAppElement("#root");

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-white p-8 rounded-xl w-[90%] max-w-6xl mx-auto shadow-xl outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-1 right-3 text-gray-500 hover:text-black"
      >
        ✖
      </button>

      {children}
    </Modal>
  );
};

export default CustomModal;
