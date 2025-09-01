import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/Rectangle.png";
import curveBg from "../../assets/Curve.png";
import card from "../../assets/card.png";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({ email: "", password: "" });
    };

  return (
    <section
      className="w-full flex items-center justify-center bg-no-repeat bg-cover px-4"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      <div
        className="
          relative rounded-3xl shadow-xl overflow-hidden
          w-[92vw] sm:w-[88vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px]
          md:aspect-[16/9]
          bg-no-repeat bg-cover bg-center
        "
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div
          className="
            md:absolute md:top-4 md:bottom-6 md:right-6 md:w-[46%]
            w-full rounded-2xl p-10 sm:p-5 bg-transparent
            overflow-hidden
          "
          style={{
            backgroundImage: `url(${card})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right top",
            backgroundSize: "100% 100%",
          }}
        >
          <div className="h-full overflow-y-auto pr-3">
            <h1 className="font-roboto font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-normal">
              Student LogIn
            </h1>

            <hr className="border border-black mb-3 hidden md:block w-2/3" />

            <p className="font-montserrat text-sm sm:text-base md:text-lg text-gray-700 mb-2">
              Welcome onboard with us!
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
              <label>Institute Email ID</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your username"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#D8E7F5] rounded-xl px-5 py-2 outline-none focus:ring-2  focus:ring-blue-400 text-sm sm:text-base"
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              />

              <button type="button" className="self-end text-xl sm:text-lg text-black hover:underline ">
                Forgot Password?
              </button>

              <button
                type="submit"
                className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-sm sm:text-base md:text-lg py-2.5 md:py-3"
              >
                LogIn as Student
              </button>
            </form>
            <p className="text-xs sm:text-sm md:text-base mt-2">
              Have Admin Access?{" "}
              <b className="hover:underline cursor-pointer" onClick={() => navigate("/login")}>
                LogIn as an Admin
              </b>
            </p>
            <p className="text-xs sm:text-sm md:text-base mt-2">
              Have Teacher Access?{" "}
              <b className="hover:underline cursor-pointer" onClick={() => navigate("/teacher-login")}>
                LogIn as a Teacher
              </b>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentLogin;
