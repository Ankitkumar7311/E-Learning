import uploadImg from "../../assets/10.png";
import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";
import editImg from "../../assets/10.png";
import routes from "../../routing/Router";
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
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-6 md:p-8">
        {/* section 1 */}
        <section
          id="section1"
          className="h-auto sm:h-[120px] w-full bg-white shadow-md rounded-2xl flex flex-wrap sm:flex-nowrap justify-between items-center p-4"
        >
          {features.map((items, index) => (
            <Link
              key={index}
              to={items.route}
              className="flex flex-col items-center space-y-2 w-1/2 sm:w-1/4 cursor-pointer mb-4 sm:mb-0"
            >
              <div className="bg-blue-100 rounded-full flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15">
                <img src={items.img} alt={items.p} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-800 text-center">
                {items.p}
              </p>
            </Link>
          ))}
        </section>

        {/* section 2 */}
        <section
          id="section2"
          className="bg-white w-full rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3"
        >
          {uploads.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md h-28 sm:h-34 w-full flex flex-col items-center justify-center p-3"
            >
              <div className="bg-blue-100 rounded-lg w-full h-full flex flex-col items-center justify-center">
                <p className="text-sm sm:text-[15px] font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent text-center">
                  {item.title}
                </p>
              </div>
              <p className="text-green-600 text-xs sm:text-[13px]">{item.label}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default SectionRight;
