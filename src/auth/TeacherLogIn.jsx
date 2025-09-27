// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import bg from "../assets/Rectangle.png";
// import curveBg from "../assets/Curve.png";
// import card from "../assets/card.png";
// import { useAuth } from "./AuthContext";

// const TeacherLogin = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [error, setError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     setError("");

//     fetch("http://localhost:8080/VidyaSarthi/faculty/getFacultyEmail", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: data.email, password: data.password }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           if (res.status === 404) throw new Error("Email not found in database");
//           else throw new Error("Failed to login. Status: " + res.status);
//         }
//         return res.json();
//       })
//       .then((profile) => {
//         // profile se facultyId bhi lena
//         login({
//           role: "teacher",
//           user: profile.email,
//           facultyId: profile.facultyId,
//         });

//         // facultyId ko dashboard me bhejna
//         navigate("/teacher/dashboard", {
//           state: { email: profile.email, facultyId: profile.facultyId },
//         });
//       })
//       .catch((err) => setError(err.message));
//   };

//   return (
//     <section
//       className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-cover px-4"
//       style={{ backgroundImage: `url(${curveBg})` }}
//     >
//       <div
//         className="relative rounded-3xl shadow-xl overflow-hidden
//         w-full sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px]
//         min-h-[90vh] md:min-h-fit
//         md:aspect-[16/9] bg-no-repeat bg-cover bg-center flex items-center justify-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         <div
//           className="md:absolute md:top-4 md:bottom-6 md:right-6 md:w-[46%]
//           w-full rounded-2xl p-8 sm:p-6 bg-transparent overflow-hidden
//           flex items-center justify-center"
//           style={{
//             backgroundImage: `url(${card})`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "right top",
//             backgroundSize: "100% 100%",
//           }}
//         >
//           <div className="w-full max-w-md">
//             <h1 className="font-roboto font-semibold text-2xl sm:text-3xl md:text-4xl leading-normal text-center">
//               Teacher LogIn
//             </h1>
//             <hr className="border border-black mb-3 hidden md:block w-2/3 mx-auto" />
//             <p className="font-montserrat text-sm sm:text-base md:text-lg text-gray-700 mb-6 text-center">
//               Welcome onboard with us!
//             </p>

//             {/* Form */}
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col gap-3"
//             >
//               {/* Email */}
//               <label className="font-medium text-sm sm:text-base md:text-lg leading-tight">
//                 Institute Email ID
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full bg-[#D8E7F5] rounded-xl px-5 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\S+@\S+$/i,
//                     message: "Invalid email format",
//                   },
//                 })}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm">{errors.email.message}</p>
//               )}

//               {/* Password */}
//               <label className="font-medium text-sm sm:text-base md:text-lg mt-2 leading-tight">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
//                 {...register("password", { required: "Password is required" })}
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-sm">{errors.password.message}</p>
//               )}

//               {/* Forgot Password */}
//               <button
//                 type="button"
//                 className="self-end text-xs sm:text-sm md:text-base text-black hover:underline"
//               >
//                 Forgot Password?
//               </button>

//               {/* Error */}
//               {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-sm sm:text-base md:text-lg py-2.5 md:py-3 mt-2"
//               >
//                 LogIn as Teacher
//               </button>
//             </form>

//             {/* Extra links */}
//             <div className="mt-6 space-y-2 text-center">
//               <p className="text-xs sm:text-sm md:text-base">
//                 Have Admin Access?{" "}
//                 <b
//                   className="hover:underline cursor-pointer"
//                   onClick={() => navigate("/login")}
//                 >
//                   LogIn as an Admin
//                 </b>
//               </p>
//               <p className="text-xs sm:text-sm md:text-base">
//                 Have Student Access?{" "}
//                 <b
//                   className="hover:underline cursor-pointer"
//                   onClick={() => navigate("/student-login")}
//                 >
//                   LogIn as a Student
//                 </b>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TeacherLogin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bg from "../assets/Rectangle.png";
import curveBg from "../assets/Curve.png";
import card from "../assets/card.png";
import { useAuth } from "./AuthContext";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setError("");

    fetch("http://localhost:8080/VidyaSarthi/faculty/getFacultyEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Email not found in database");
          else throw new Error("Failed to login. Status: " + res.status);
        }
        return res.json();
      })
      .then((profile) => {
        login({
          role: "teacher",
          user: profile.email,
          facultyId: profile.facultyId,
        });

        navigate("/teacher/dashboard", {
          state: { email: profile.email, facultyId: profile.facultyId },
        });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-cover px-4"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      <div
        className="relative rounded-3xl shadow-xl overflow-hidden
        w-full sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px]
        min-h-[90vh] bg-no-repeat bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div
          className="md:absolute md:top-4 md:bottom-6 md:right-6 md:w-[46%]
          w-full rounded-2xl p-8 sm:p-6 bg-transparent flex items-center justify-center"
          style={{
            backgroundImage: `url(${card})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right top",
            backgroundSize: "100% 100%",
          }}
        >
          <div className="w-full max-w-md">
            <h1 className="font-roboto font-semibold text-2xl sm:text-3xl md:text-4xl leading-normal text-center">
              Teacher LogIn
            </h1>
            <hr className="border border-black mb-3 hidden md:block w-2/3 mx-auto" />
            <p className="font-montserrat text-sm sm:text-base md:text-lg text-gray-700 mb-6 text-center">
              Welcome onboard with us!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <label className="font-medium text-sm sm:text-base md:text-lg leading-tight">
                Institute Email ID
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#D8E7F5] rounded-xl px-5 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
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

              <label className="font-medium text-sm sm:text-base md:text-lg mt-2 leading-tight">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}

              <button
                type="button"
                className="self-end text-xs sm:text-sm md:text-base text-black hover:underline"
              >
                Forgot Password?
              </button>

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button
                type="submit"
                className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-sm sm:text-base md:text-lg py-2.5 md:py-3 mt-2"
              >
                LogIn as Teacher
              </button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              <p className="text-xs sm:text-sm md:text-base">
                Have Admin Access?{" "}
                <b
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  LogIn as an Admin
                </b>
              </p>
              <p className="text-xs sm:text-sm md:text-base">
                Have Student Access?{" "}
                <b
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate("/student-login")}
                >
                  LogIn as a Student
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherLogin;