// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import bg from "../assets/Rectangle.png";
// import curveBg from "../assets/Curve.png";
// import card from "../assets/card.png";
// import { useAuth } from "./AuthContext"; // ✅ adjust the path based on your folder structure

// const StudentLogin = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log("Student Login Data:", data);

//     // ✅ set auth with role = "student"
//     login({ role: "student", user: data.email });

//     // ✅ redirect to student dashboard
//     navigate("/student/dashboard");
//   };
//   return (
//     <section
//       className="w-full flex items-center justify-center px-4 bg-cover bg-no-repeat"
//       style={{ backgroundImage: `url(${curveBg})` }}
//     >
//       <div
//         className="relative w-[92vw] sm:w-[88vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px] rounded-3xl shadow-2xl overflow-hidden md:aspect-[16/9] bg-cover bg-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         <div
//           className="w-full md:w-[46%] md:absolute md:top-4 md:bottom-6 md:right-6 rounded-2xl p-6 sm:p-8 md:p-10 bg-cover bg-no-repeat bg-top"
//           style={{ backgroundImage: `url(${card})` }}
//         >
//           <div className="h-full overflow-y-auto pr-2">
//             <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-roboto mb-2">
//               Student LogIn
//             </h1>
//             <hr className="hidden md:block border border-black mb-3 w-2/3" />
//             <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">
//               Welcome onboard with us!
//             </p>

//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col gap-3"
//             >
//               <div>
//                 <label className="block mb-1 text-sm">Institute Email ID</label>
//                 <input
//                   type="email"
//                   placeholder="Enter your username"
//                   className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: "Invalid email format",
//                     },
//                   })}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 text-sm">Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
//                   {...register("password", {
//                     required: "Password is required",
//                   })}
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 className="self-end text-sm sm:text-base text-black hover:underline"
//               >
//                 Forgot Password?
//               </button>

//               <button
//                 type="submit"
//                 className="w-full py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-bold rounded-2xl bg-[#F3B300] hover:bg-yellow-600 transition"
//               >
//                 LogIn as Student
//               </button>
//             </form>

//             <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-base">
//               <p>
//                 Have Admin Access?{" "}
//                 <b
//                   onClick={() => navigate("/login")}
//                   className="cursor-pointer hover:underline"
//                 >
//                   LogIn as an Admin
//                 </b>
//               </p>
//               <p>
//                 Have Teacher Access?{" "}
//                 <b
//                   onClick={() => navigate("/teacher-login")}
//                   className="cursor-pointer hover:underline"
//                 >
//                   LogIn as a Teacher
//                 </b>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StudentLogin;

// 

// import React, { useState } from "react"; 
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import bg from "../assets/Rectangle.png";
// import curveBg from "../assets/Curve.png";
// import card from "../assets/card.png";
// import { useAuth } from "./AuthContext"; 
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

// const StudentLogin = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPassword, setShowPassword] = useState(false); 

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log("Student Login Data:", data);
//     login({ role: "student", user: data.email });
//     navigate("/student/dashboard");
//   };

//   return (
//     <section
//       className="w-full flex items-center justify-center px-4 bg-cover bg-no-repeat"
//       style={{ backgroundImage: `url(${curveBg})` }}
//     >
//       <div
//         className="relative w-[92vw] sm:w-[88vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px] rounded-3xl shadow-2xl overflow-hidden md:aspect-[16/9] bg-cover bg-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         <div
//           className="w-full md:w-[46%] md:absolute md:top-4 md:bottom-6 md:right-6 rounded-2xl p-6 sm:p-8 md:p-10 bg-cover bg-no-repeat bg-top"
//           style={{ backgroundImage: `url(${card})` }}
//         >
//           <div className="h-full overflow-y-auto pr-2">
//             <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-roboto mb-2">
//               Student LogIn
//             </h1>
//             <hr className="hidden md:block border border-black mb-3 w-2/3" />
//             <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">
//               Welcome onboard with us!
//             </p>

//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col gap-3"
//             >
//               <div>
//                 <label className="block mb-1 text-sm">Institute Email ID</label>
//                 <input
//                   type="email"
//                   placeholder="Enter your username"
//                   className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: "Invalid email format",
//                     },
//                   })}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                 )}
//               </div>

//               <div className="relative">
//                 <label className="block mb-1 text-sm">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 pr-10 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
//                   {...register("password", {
//                     required: "Password is required",
//                   })}
//                 />
//                 <span
//                   className="absolute right-3 cursor-pointer text-gray-600"
//                   style={{ top: '55%', transform: 'translateY(-50%)' }} 
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                 </span>
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 className="self-end text-sm sm:text-base text-black hover:underline"
//               >
//                 Forgot Password?
//               </button>

//               <button
//                 type="submit"
//                 className="w-full py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-bold rounded-2xl bg-[#F3B300] hover:bg-yellow-600 transition"
//               >
//                 LogIn as Student
//               </button>
//             </form>

//             <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-base">
//               <p>
//                 Have Admin Access?{" "}
//                 <b
//                   onClick={() => navigate("/login")}
//                   className="cursor-pointer hover:underline"
//                 >
//                   LogIn as an Admin
//                 </b>
//               </p>
//               <p>
//                 Have Teacher Access?{" "}
//                 <b
//                   onClick={() => navigate("/teacher-login")}
//                   className="cursor-pointer hover:underline"
//                 >
//                   LogIn as a Teacher
//                 </b>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StudentLogin;


// import React, { useState } from "react"; 
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import bg from "../assets/Rectangle.png";
// import curveBg from "../assets/Curve.png";
// import card from "../assets/card.png";
// import { useAuth } from "./AuthContext"; 
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

// const StudentLogin = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPassword, setShowPassword] = useState(false); 

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log("Student Login Data:", data);
//     login({ role: "student", user: data.email });
//     navigate("/student/dashboard");
//   };

//   return (
//     <section
//       className="w-full flex items-center justify-center px-4 bg-cover bg-no-repeat"
//       style={{ backgroundImage: `url(${curveBg})` }}
//     >
//       <div
//         className="relative w-[92vw] sm:w-[88vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px] rounded-3xl shadow-2xl overflow-hidden md:aspect-[16/9] bg-cover bg-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         <div
//           className="w-full md:w-[46%] md:absolute md:top-4 md:bottom-6 md:right-6 rounded-2xl p-6 sm:p-8 md:p-10 bg-cover bg-no-repeat bg-top"
//           style={{ backgroundImage: `url(${card})` }}
//         >
//           <div className="h-full overflow-y-auto pr-2">
//             <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-roboto mb-2">
//               Student LogIn
//             </h1>
//             <hr className="hidden md:block border border-black mb-3 w-2/3" />
//             <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">
//               Welcome onboard with us!
//             </p>

//             <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
//               <div>
//                 <label className="block mb-1 text-sm">Institute Email ID</label>
//                 <input
//                   type="email"
//                   placeholder="Enter your username"
//                   className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: "Invalid email format",
//                     },
//                   })}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                 )}
//               </div>

//               <div className="relative flex items-center">
//                 <label className="block mb-1 text-sm">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 pr-10 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
//                   {...register("password", { required: "Password is required" })}
//                 />
//                 <span
//                   className="absolute right-3 flex items-center h-full cursor-pointer text-gray-600"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                 </span>
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//                 )}
//               </div>

//               <button type="button" className="self-end text-sm sm:text-base text-black hover:underline">
//                 Forgot Password?
//               </button>

//               <button type="submit" className="w-full py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-bold rounded-2xl bg-[#F3B300] hover:bg-yellow-600 transition">
//                 LogIn as Student
//               </button>
//             </form>

//             <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-base">
//               <p>
//                 Have Admin Access?{" "}
//                 <b onClick={() => navigate("/login")} className="cursor-pointer hover:underline">
//                   LogIn as an Admin
//                 </b>
//               </p>
//               <p>
//                 Have Teacher Access?{" "}
//                 <b onClick={() => navigate("/teacher-login")} className="cursor-pointer hover:underline">
//                   LogIn as a Teacher
//                 </b>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StudentLogin;

import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bg from "../assets/Rectangle.png";
import curveBg from "../assets/Curve.png";
import card from "../assets/card.png";
import { useAuth } from "./AuthContext"; 
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Student Login Data:", data);
    login({ role: "student", user: data.email });
    navigate("/student/dashboard");
  };

  return (
    <section
      className="w-full flex items-center justify-center px-4 bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      <div
        className="relative w-[92vw] sm:w-[88vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px] rounded-3xl shadow-2xl overflow-hidden md:aspect-[16/9] bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div
          className="w-full md:w-[46%] md:absolute md:top-4 md:bottom-6 md:right-6 rounded-2xl p-6 sm:p-8 md:p-10 bg-cover bg-no-repeat bg-top"
          style={{ backgroundImage: `url(${card})` }}
        >
          <div className="h-full overflow-y-auto pr-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-roboto mb-2">
              Student LogIn
            </h1>
            <hr className="hidden md:block border border-black mb-3 w-2/3" />
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">
              Welcome onboard with us!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              {/* Email Field */}
              <div>
                <label className="block mb-1 text-sm">Institute Email ID</label>
                <input
                  type="email"
                  placeholder="Enter your username"
                  className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 pr-10 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("password", { required: "Password is required" })}
                  />
                  <span
                    className="absolute right-3 flex items-center h-full cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button type="button" className="self-end text-sm sm:text-base text-black hover:underline">
                Forgot Password?
              </button>

              <button type="submit" className="w-full py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-bold rounded-2xl bg-[#F3B300] hover:bg-yellow-600 transition">
                LogIn as Student
              </button>
            </form>

            <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-base">
              <p>
                Have Admin Access?{" "}
                <b onClick={() => navigate("/login")} className="cursor-pointer hover:underline">
                  LogIn as an Admin
                </b>
              </p>
              <p>
                Have Teacher Access?{" "}
                <b onClick={() => navigate("/teacher-login")} className="cursor-pointer hover:underline">
                  LogIn as a Teacher
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentLogin;
