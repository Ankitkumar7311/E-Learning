import { Link } from "react-router-dom";
import teacher from "../../assets/teacher.jpg";
import { FaRegEdit } from "react-icons/fa";

let SectionLeft = () => {
  return (
    <>
      <div className="h-full w-full md:w-1/2 flex justify-center py-3 shadow-sm">
        <div className="flex flex-col rounded-xl bg-[white] h-auto md:h-[525px] w-[90%] sm:w-72 md:w-60 p-3">
          <div className="flex flex-col items-center gap-2">
            <img
              src={teacher}
              alt="no img"
              className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px] rounded-xl"
            />
            <h4 className="text-center text-sm sm:text-base md:text-lg">PREM KUMAR</h4>
          </div>

          <hr className="border-[#202020] border-[1.5px] w-full my-2" />

          <span className="text-[13px] sm:text-[15px]/[20px]">
            Subject: Compiler Design <br />
            Batch: 2020 - 24 <br />
            Roll: 200XXXX
          </span>
          <hr className="border-[#202020] border-[1.5px] w-full my-2" />

          <span className="text-sm sm:text-base">
            Phone: <br />
            +91 XXXXXXXXXX <br />
            Email : <br />
            XXXXXXXXXXXXXX
          </span>
          <hr className="border-[#202020] border-[1.5px] w-full my-2" />

          <span className="text-sm sm:text-base">
            Address: <br />
            Village, Block, Lakhisarai <br />
            Bihar 811315 <br />
          </span>
          <br />
          <aside className="flex items-center justify-center">
            <Link to="/update-profile-student">
              <button className="flex items-center justify-evenly gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-full transition text-sm sm:text-base">
                <FaRegEdit size={18} /> Request
              </button>
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
};
export default SectionLeft;
