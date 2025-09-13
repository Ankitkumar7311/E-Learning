import { Link } from "react-router-dom";
import teacher from "../../assets/teacher.jpg";
import { FaRegEdit } from "react-icons/fa";

let SectionLeft = () => {
  return (
    <>
      <div className="h-full w-1/2 flex justify-center py-3 shadow-sm ">
        <div className="flex flex-col rounded-xl bg-[white] h-[525px] w-60 ">
          <div className="flex flex-col items-center gap-2">
            <img
              src={teacher}
              alt="no img"
              className="h-[90px] w-[90px] rounded-xl"
            />
            <h4 className="text-center">PREM KUMAR</h4>
          </div>

          <hr className="border-[#202020] border-3 w-full my-2" />

          <span className=" text-[15px]/[20px]">
            Subject: Compiler Design <br />
            Batch: 2020 - 24 <br />
            Roll: 200XXXX
          </span>
          <hr className="border-[#202020] border-3 w-full my-2" />

          <span className="">
            Phone: <br />
            +91 XXXXXXXXXX <br />
            Email : <br />
            XXXXXXXXXXXXXX
          </span>
          <hr className="border-[#202020] border-3 w-full my-2" />

          <span className="">
            Address: <br />
            Village, Block, Lakhisarai <br />
            Bihar 811315 <br />
          </span>
          <br />
          <aside className="flex items-center justify-center">
              <Link to="/update-profile-student">
          <button className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition">
            <FaRegEdit size={18}/> Request
          </button>
        </Link>
          </aside>
        </div>
      </div>
    </>
  );
};
export default SectionLeft;
