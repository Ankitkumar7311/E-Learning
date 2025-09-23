import academic from "../assets/academic.png";
import Background from "../modules/admin/Background";
import Form from "./Form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  return (
    <Background>
      <div
        className="relative h-screen w-full rounded-3xl shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${academic})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>

        {/* Text Content */}
        <div className="absolute mt-[10px] ml-[50px] w-full md:w-1/2 p-6 text-white h-full flex flex-col justify-center">
          <h1 className="font-julius font-light text-5xl md:text-6xl lg:text-7xl leading-snug">
            Vidya Sarthi
          </h1>
          <h3 className="font-roboto font-medium text-xl md:text-3xl mt-3">
            Welcome to Vidya Sarthi
          </h3>
          <p className="font-roboto text-sm md:text-lg lg:text-xl mt-3 max-w-xl leading-relaxed">
            A digital bridge between students and teachers, where teachers share
            knowledge and students access notes with ease.
          </p>
        </div>

        {/* Form */}
        <Form />
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
