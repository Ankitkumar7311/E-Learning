import { useState } from "react";

import { Modal, Button } from "react-bootstrap";

import uploadImg from "../../assets/10.png";
import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";
import editImg from "../../assets/10.png";

let ProfileRight = () => {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [semester, setSemester] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!semester || !selectedFile) {
      alert("Please select a semester and upload a file.");
      return;
    }
    console.log("Uploading:", { semester, selectedFile });
    handleClose();
  };

  const features = [
    {
      img: uploadImg,
      p: "Uploaded Module",
    },
    {
      img: profileImg,
      p: "Profile Status",
    },
    {
      img: requestImg,
      p: " Request/Report",
    },
    {
      img: editImg,
      p: "Edit Material",
    },
  ];

  const uploads = [
    { title: "Upload PYQ", label: "PYQ" },
    { title: "Upload Notes", label: "Notes" },
    { title: "Upload QB", label: "QB" },
    { title: "Upload News & Events", label: "Events" },
  ];

  return (
    <>
      <div className="h-full w-full  pl-20 py-4">
        <section
          id="section1"
          className="h-[120px] w-160 bg-[white] shadow-md rounded-2xl flex justify-between items-center"
        >
          {features.map((items, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 w-1/4"
              >
                <div className="bg-blue-100 rounded-full flex items-center justify-center w-15 h-15">
                  <img src={items.img} alt={items.p} className="w-7 h-7 " />
                </div>
                <p className="text-sm font-medium text-gray-800">{items.p}</p>
              </div>
            );
          })}
        </section>

        {/* section 2 */}
        <section
          id="section2"
          className="w-180 bg-[white] h-80 rounded-xl grid grid-cols-2  justify-start items-center mt-3 "
        >
          {uploads.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md h-34 w-75 flex flex-col items-center justify-center pt-2 pr-2 pl-2"
                onClick={handleShow} // 👈 open modal on click
              >
                {/* Inner blue box */}
                <div className="bg-blue-100 rounded-lg w-full h-full flex flex-col items-center justify-center relative ">
                  <p className="text-[15px] font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent">
                    {item.title}
                  </p>
                </div>
                {/* Label below */}
                <p className="text-green-600 text-[13px]">{item.label}</p>
              </div>
            );
          })}
        </section>
      </div>
      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdown */}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Select Semester
            </label>
            <select
              className="form-select w-full border rounded px-3 py-2"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">-- Select Semester --</option>
              <option value="Sem1">Semester 1</option>
              <option value="Sem2">Semester 2</option>
              <option value="Sem3">Semester 3</option>
              <option value="Sem4">Semester 4</option>
              <option value="Sem5">Semester 5</option>
              <option value="Sem6">Semester 6</option>
              <option value="Sem7">Semester 7</option>
              <option value="Sem8">Semester 8</option>
            </select>
          </div>

          {/* File Input */}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Upload File
            </label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ProfileRight;
