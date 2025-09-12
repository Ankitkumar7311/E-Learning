import uploadImg from "../../assets/10.png";
import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";
import editImg from "../../assets/10.png";
import routes from "../../routing/Router";
import { Link } from "react-router-dom";

let SectionRight = () => {
  const features = [
    { img: uploadImg, p: "Current Semester" , route: "" },
    { img: profileImg, p: "Registration Status" , route: "" },
    { img: requestImg, p: "Payment Status" , route: "" },
    { img: editImg, p: "Uploaded Material" , route: "/student/documents" }
  ];

  const uploads = [
    { title: "Faculty Provide QB", label: "PYQ" },
    { title: "Notes", label: "Notes" },
    { title: "PYQ", label: "QB" },
    { title: "News & Events", label: "Events" },
  ];

  return (
    <>
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
      {/* section 1 */}
      <section
        id="section1"
        className="h-[120px] w-160 bg-white shadow-md rounded-2xl flex justify-between items-center"
      >
        {features.map((items, index) => (
          <Link
    key={index}
    to={items.route} // 👈 navigate to provided route
    className="flex flex-col items-center space-y-2 w-1/4 cursor-pointer"
  >
          <div
            key={index}
            className="flex flex-col items-center space-y-2 w-1/4"
          >
            <div className="bg-blue-100 rounded-full flex items-center justify-center w-15 h-15">
              <img src={items.img} alt={items.p} className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-gray-800">{items.p}</p>
          </div>
        </Link>))}
        
      </section>

      {/* section 2 */}
      <section
        id="section2"
        className=" bg-white w-170  h-80 rounded-xl grid grid-cols-2 justify-start items-center mt-3"
      >
        {uploads.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md h-34 w-75 flex flex-col items-center justify-center pt-2 pr-2 pl-2"
          >
            <div className="bg-blue-100 rounded-lg w-full h-full flex flex-col items-center justify-center">
              <p className="text-[15px] font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent">
                {item.title}
              </p>
            </div>
            <p className="text-green-600 text-[13px]">{item.label}</p>
          </div>
        ))}
      </section>
    </div>
    </>
  );
};

export default SectionRight;
