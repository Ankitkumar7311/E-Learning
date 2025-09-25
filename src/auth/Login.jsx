import academic from "../assets/academic.png";
import Background from "../modules/admin/Background";
import Form from "./Form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  return (
    <Background>
      <div
        className="relative w-full min-h-screen flex flex-col lg:flex-row shadow-2xl bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${academic})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 p-4 sm:p-6 md:p-12 gap-6 items-center">
          {/* Text Content */}
          <div className="flex flex-col justify-center text-white text-center md:text-left px-3 sm:px-6">
            <h1 className="font-julius font-light text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-snug">
              College Guide
            </h1>
            <h3 className="font-roboto font-medium text-base sm:text-lg md:text-3xl mt-2 sm:mt-3">
              Welcome to College Guide
            </h3>
            <p className="font-roboto text-xs sm:text-sm md:text-lg lg:text-xl mt-2 sm:mt-3 max-w-xl mx-auto md:mx-0 leading-relaxed">
              A digital bridge between students and teachers, where teachers
              share knowledge and students access notes with ease.
            </p>
          </div>

          {/* Form Section */}
          <div className="relative z-10 flex-1 flex justify-center items-center px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-10">
            <Form />
          </div>
        </div> {/* ✅ closed the content wrapper */}
      </div>
    </Background>
  );
};

export default Login;

// 

// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Form = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState("");

//   return (
//     <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Login</h2>

//       <div className="mb-4 relative">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <span
//           className="absolute right-3 top-3 text-gray-600 cursor-pointer"
//           onClick={() => setShowPassword(!showPassword)}
//         >
//           {showPassword ? <FaEyeSlash /> : <FaEye />}
//         </span>
//       </div>

//       <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
//         Login
//       </button>
//     </div>
//   );
// };

// export default Form;
