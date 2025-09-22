import uploadImg from "../../assets/10.png";
import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";
import editImg from "../../assets/10.png";
import { Link } from "react-router-dom";

let SectionRight = () => {
  const features = [
    { img: uploadImg, p: "Current Semester", route: "" },
    { img: profileImg, p: "Registration Status", route: "" },
    { img: requestImg, p: "Payment Status", route: "" },
    { img: editImg, p: "Uploaded Material", route: "/student/documents" },
  ];

  const uploads = [
    { title: "Faculty Provide QB", label: "QB" },
    { title: "Notes", label: "Notes" },
    { title: "PYQ", label: "PYQ" },
    { title: "News & Events", label: "Events" },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-8">
        {/* section 1 */}
        <section
          id="section1"
          className="w-full bg-white shadow-md rounded-2xl flex flex-wrap justify-center items-center p-4 gap-2 sm:gap-4"
        >
          {features.map((item, index) => (
            <Link
              key={index}
              to={item.route}
              // Added min-w-0 to allow the item to shrink if needed
              className="flex flex-col items-center space-y-2 w-24 cursor-pointer min-w-0"
            >
              <div className="bg-blue-100 rounded-full flex items-center justify-center w-14 h-14">
                <img src={item.img} alt={item.p} className="w-7 h-7" />
              </div>
              {/* Added break-words to wrap long text */}
              <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words">
                {item.p}
              </p>
            </Link>
          ))}
        </section>

        {/* section 2 */}
        <section
          id="section2"
          className="w-full rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4"
        >
          {uploads.map((item, index) => (
            // Added min-w-0 to the grid item for robust shrinking
            <div
              key={index}
              className="bg-white rounded-xl shadow-md min-h-[140px] flex flex-col items-center justify-center p-2 min-w-0"
            >
              <div className="bg-blue-100 rounded-lg w-full h-full flex flex-col items-center justify-center text-center p-2">
                {/* Added break-words to wrap long titles */}
                <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent break-words">
                  {item.title}
                </p>
              </div>
              <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">{item.label}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default SectionRight;