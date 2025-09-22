import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import cardpic from "../assets/card.png";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

const Form = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role] = useState("admin");

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
      className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] 
      bg-white/90 rounded-2xl shadow-lg 
      p-4 sm:p-6 md:p-8 backdrop-blur-sm 
      max-h-[85vh] overflow-y-auto"
      style={{
        backgroundImage: `url(${cardpic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium font-roboto mb-2 sm:mb-3 text-center">
        LogIn
      </h1>
      <hr className="border border-black mb-3 sm:mb-4 w-2/3 mx-auto" />
      <h4 className="text-xs sm:text-base md:text-xl font-montserrat mb-4 sm:mb-5 text-center">
        Welcome onboard with us!
      </h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 sm:gap-3"
      >
        {/* Email */}
        <label className="font-medium text-xs sm:text-sm md:text-lg">
          Email ID
        </label>
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
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <label className="font-medium text-xs sm:text-sm md:text-lg mt-1 sm:mt-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full bg-[#D8E7F5] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 outline-none 
          focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.password.message}
          </p>
        )}

        <button
          type="button"
          className="self-end text-xs sm:text-sm md:text-base text-black hover:underline mt-1"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl 
          w-full font-bold text-sm sm:text-lg md:text-xl py-2 sm:py-2.5 md:py-3"
        >
          LogIn
        </button>

        {/* Links */}
        <p className="text-xs sm:text-sm md:text-lg text-center mt-2">
          Are you a student?{" "}
          <b
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/student-login")}
          >
            LogIn as a Student
          </b>
        </p>
        <p className="text-xs sm:text-sm md:text-lg text-center">
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
