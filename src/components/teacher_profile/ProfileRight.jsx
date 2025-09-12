import { useState } from "react";

import UploadQB from "../upload/UploadQB";
import UploadPYQ from "../upload/UploadPYQ";
import UploadNotes from "../upload/UploadNotes";
import UploadNewsEvents from "../upload/UploadNewsEvents";
import RequestReport from "../admin_profile/RequestReport";
import CustomModal from "../common/CustomModal";
import EditMaterial from "../admin_profile/EditMaterial";

import uploadImg from "../../assets/10.png";
import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";
import editImg from "../../assets/10.png";

const ProfileRight = () => {
  const [modalContent, setModalContent] = useState(null);

  const features = [
    { img: uploadImg, label: "Uploaded Module" },
    { img: profileImg, label: "Profile Status" },
    { img: requestImg, label: "Request/Report", component: <RequestReport /> },
    { img: editImg, label: "Edit Material", component: <EditMaterial /> },
  ];

  const uploads = [
    { title: "Upload PYQ", tag: "PYQ", component: <UploadPYQ /> },
    { title: "Upload Notes", tag: "Notes", component: <UploadNotes /> },
    { title: "Upload QB", tag: "QB", component: <UploadQB /> },
    {
      title: "Upload News & Events",
      tag: "Events",
      component: <UploadNewsEvents />,
    },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* Features Section */}
        <section className="h-32 bg-white shadow-md rounded-2xl flex justify-between items-center px-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 w-1/4 cursor-pointer"
              onClick={() => item.component && setModalContent(item.component)}
            >
              <div className="bg-blue-100 rounded-full flex items-center justify-center w-14 h-14">
                <img src={item.img} alt={item.label} className="w-7 h-7" />
              </div>
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
            </div>
          ))}
        </section>

        {/* Upload Section */}
        <section className="grid grid-cols-2 gap-4 mt-5">
          {uploads.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center py-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setModalContent(item.component)}
            >
              <div className="bg-blue-100 rounded-lg w-full h-20 flex flex-col items-center justify-center">
                <p className="text-[15px] font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent">
                  {item.title}
                </p>
              </div>
              <p className="text-green-600 text-[13px] mt-2">{item.tag}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Reusable Modal */}
      <CustomModal
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
      >
        {modalContent}
      </CustomModal>
    </>
  );
};

export default ProfileRight;
