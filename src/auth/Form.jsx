

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
      className="w-full max-w-md sm:max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl pt-6 px-4 sm:p-5 md:p-6 bg-white bg-opacity-80 shadow-lg"
      style={{
        backgroundImage: `url(${cardpic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-xl md:text-3xl font-medium font-roboto mb-2 text-center">
        LogIn
      </h1>
      <hr className="border border-black mb-2 w-2/3 mx-auto" />
      <h4 className="text-xs md:text-lg font-montserrat mb-5 text-center">
        Welcome onboard with us!
      </h4>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Email Field */}
        <label className="font-medium text-sm md:text-base">Email ID</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full bg-[#D8E7F5] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 outline-none 
          focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
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

        {/* Password Field */}
        <label className="font-medium text-sm md:text-base">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full bg-[#D8E7F5] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 outline-none 
          focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <button
          type="button"
          className="self-end text-xs md:text-sm text-black hover:underline"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-base md:text-lg py-2 md:py-2.5 mt-3"
        >
          LogIn
        </button>

        {/* Student / Teacher Links */}
        <div className="mt-3 space-y-1">
          <p className="text-xs md:text-base text-center">
            Are you a Student?{" "}
            <b
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/student-login")}
            >
              LogIn as a Student
            </b>
          </p>
          <p className="text-xs md:text-base text-center">
            Are you a Teacher?{" "}
            <b
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/teacher-login")}
            >
              LogIn as a Teacher
            </b>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Form;
