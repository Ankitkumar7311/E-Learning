import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bg from "../assets/Rectangle.png";
import curveBg from "../assets/Curve.png";
import card from "../assets/card.png";
import { useAuth } from "./AuthContext";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      className="w-full flex items-center justify-center px-4 py-8 bg-cover bg-no-repeat min-h-screen"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      {/* Wrapper with 2 columns on md+ */}
      <div className="relative w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden mx-auto grid grid-cols-1 md:grid-cols-2">
        
        {/* Left side background image (hidden on small screens) */}
        <div
          className="hidden md:block bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>

        {/* Right side form */}
        <div
          className="w-full p-6 sm:p-8 md:p-10 bg-cover bg-no-repeat bg-top flex items-center"
          style={{ backgroundImage: `url(${card})` }}
        >
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-roboto mb-2">
              Student LogIn
            </h1>
            <hr className="hidden md:block border border-black mb-3 w-2/3" />
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">
              Welcome onboard with us!
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              {/* Email */}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <button
                type="button"
                className="self-end text-sm sm:text-base text-black hover:underline"
              >
                Forgot Password?
              </button>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-bold rounded-2xl bg-[#F3B300] hover:bg-yellow-600 transition"
              >
                LogIn as Student
              </button>
            </form>

            {/* Links */}
            <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-base">
              <p>
                Have Admin Access?{" "}
                <b
                  onClick={() => navigate("/login")}
                  className="cursor-pointer hover:underline"
                >
                  LogIn as an Admin
                </b>
              </p>
              <p>
                Have Teacher Access?{" "}
                <b
                  onClick={() => navigate("/teacher-login")}
                  className="cursor-pointer hover:underline"
                >
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
