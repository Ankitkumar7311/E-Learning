// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import cardpic from "../assets/card.png";
// import { useAuth } from "../auth/AuthContext";
// import { useState } from "react";
// const Form = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [role] = useState("admin"); // default is admin

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log("Admin Login Data:", data);

//     // ✅ set auth with role = "admin"
//     login({ role: "admin", user: data.email });

//     // ✅ redirect to admin dashboard
//     navigate("/admin/dashboard");
//   };

//   return (
//     <div
//       className="absolute mt-[85px] md:top-15 md:right-15 w-[70vw] sm:w-[70vw] md:w-[40%] rounded-2xl pt-10 sm:p-4 overflow-y-auto bg-no-repeat bg-cover bg-center"
//       style={{ backgroundImage: `url(${cardpic})`, maxHeight: "90%" }}
//     >
//       <h1 className="text-2xl md:text-4xl font-medium font-roboto mb-3">
//         LogIn
//       </h1>
//       <hr className="border border-black mb-2 w-2/3" />
//       <h4 className="text-sm md:text-2xl font-montserrat mb-3">
//         Welcome onboard with us!
//       </h4>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
//         {/* Email Field */}
//         <label className="font-medium text-sm md:text-lg">Email ID</label>
//         <input
//           type="text"
//           placeholder="Enter your username"
//           className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^\S+@\S+$/i,
//               message: "Invalid email format",
//             },
//           })}
//         />
//         {errors.email && (
//           <p className="text-red-500 text-sm">{errors.email.message}</p>
//         )}

//         {/* Password Field */}
//         <label className="font-medium text-sm md:text-lg mt-2">Password</label>
//         <input
//           type="password"
//           placeholder="Enter your password"
//           className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
//           {...register("password", { required: "Password is required" })}
//         />
//         {errors.password && (
//           <p className="text-red-500 text-sm">{errors.password.message}</p>
//         )}

//         <button
//           type="button"
//           className="self-end text-sm md:text-base text-black hover:underline mt-1"
//         >
//           Forgot Password?
//         </button>

//         <button
//           type="submit"
//           className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-lg md:text-xl py-2.5 md:py-3"
//         >
//           LogIn
//         </button>

//         <p className="text-base md:text-lg text-center mt-2">
//           Are you a student?{" "}
//           <b
//             className="hover:underline cursor-pointer"
//             onClick={() => navigate("/student-login")}
//           >
//             LogIn as a Student
//           </b>
//         </p>
//         <p className="text-base md:text-lg text-center">
//           Are you a Teacher?{" "}
//           <b
//             className="hover:underline cursor-pointer"
//             onClick={() => navigate("/teacher-login")}
//           >
//             LogIn as a Teacher
//           </b>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Form;

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import cardpic from "../assets/card.png";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // <-- import icons

const Form = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role] = useState("admin"); 
  const [showPassword, setShowPassword] = useState(false); // <-- toggle state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Admin Login Data:", data);
    login({ role: "admin", user: data.email });
    navigate("/admin/dashboard");
  };

  return (
    <div
      className="absolute mt-[85px] md:top-15 md:right-15 w-[70vw] sm:w-[70vw] md:w-[40%] rounded-2xl pt-10 sm:p-4 overflow-y-auto bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${cardpic})`, maxHeight: "90%" }}
    >
      <h1 className="text-2xl md:text-4xl font-medium font-roboto mb-3">
        LogIn
      </h1>
      <hr className="border border-black mb-2 w-2/3" />
      <h4 className="text-sm md:text-2xl font-montserrat mb-3">
        Welcome onboard with us!
      </h4>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Email Field */}
        <label className="font-medium text-sm md:text-lg">Email ID</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Password Field with Eye Icon */}
        <label className="font-medium text-sm md:text-lg mt-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // <-- toggle type
            placeholder="Enter your password"
            className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            {...register("password", { required: "Password is required" })}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button
          type="button"
          className="self-end text-sm md:text-base text-black hover:underline mt-1"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-lg md:text-xl py-2.5 md:py-3"
        >
          LogIn
        </button>

        <p className="text-base md:text-lg text-center mt-2">
          Are you a student?{" "}
          <b
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/student-login")}
          >
            LogIn as a Student
          </b>
        </p>
        <p className="text-base md:text-lg text-center">
          Are you a Teacher?{" "}
          <b
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/teacher-login")}
          >
            LogIn as a Teacher
          </b>
        </p>
      </form>
    </div>
  );
};

export default Form;
