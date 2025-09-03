import teacher from "../../assets/teacher.jpg";
import { FaRegEdit } from "react-icons/fa";

const ProfileLeft = () => {
  return (
    <div className="h-full w-1/2 flex justify-center py-3 shadow-sm">
      <div className="flex flex-col rounded-xl bg-white h-[525px] w-60 p-4">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={teacher}
            alt="Profile"
            className="h-[90px] w-[90px] rounded-xl object-cover"
          />
          <h4 className="text-center font-semibold">PREM KUMAR</h4>
        </div>

        <hr className="border-gray-600 my-2" />

        <div className="text-sm leading-5 space-y-2">
          <p>
            <b>Subject:</b> Compiler Design <br />
            <b>Batch:</b> 2020 - 24 <br />
            <b>Roll:</b> 200XXXX
          </p>

          <hr className="border-gray-600" />

          <p>
            <b>Phone:</b> +91 XXXXXXXXXX <br />
            <b>Email:</b> XXXXXXXXXXXXXX
          </p>

          <hr className="border-gray-600" />

          <p>
            <b>Address:</b> Village, Block, Lakhisarai <br />
            Bihar 811315
          </p>
        </div>

        {/* Request Button */}
        <div className="flex justify-center mt-4">
          <button className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition">
            <FaRegEdit size={18} /> Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeft;
