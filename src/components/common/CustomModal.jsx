import Modal from "react-modal";

Modal.setAppElement("#root"); // Important for accessibility

const CustomModal = ({ isOpen, onClose, children, title }) => {
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
        aria-label="Close Modal"
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
      >
        ✖
      </button>

      {/* Optional Title */}
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}

      {/* Modal Content */}
      <div>{children}</div>
    </Modal>
  );
};

export default CustomModal;
