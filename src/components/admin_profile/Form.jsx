import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import cardpic from "../../assets/card.png";

const Form = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate("/dashboard");
    setFormData({ email: "", password: "" });
  };

  return (
    <div
      className="
        absolute md:top-5 md:right-15 w-[70vw] sm:w-[70vw] md:w-[40%]
        rounded-2xl p-4 sm:p-6 overflow-y-auto
        bg-no-repeat bg-cover bg-center
      "
      style={{ backgroundImage: `url(${cardpic})`, maxHeight: "90%" }}
    >
      <h1 className="text-2xl sm:text-2xl md:text-4xl font-roboto font-medium leading-none mb-3">
        LogIn
      </h1>
      <hr className="border-[0.2vh]  border-black mb-2 w-2/3" />
      <h4 className="text-sm sm:text-base md:text-2xl font-montserrat leading-normal mb-3">
        Welcome onboard with us!
      </h4>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-3">
        <label className="font-medium text-sm sm:text-base md:text-lg leading-none">
          Email ID
        </label>
        <input
          type="text"
          name="email"
          placeholder="Enter your username"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />

        <label className="font-medium text-sm sm:text-base md:text-lg mt-2 leading-none">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />

        <button
          type="button"
          className="self-end text-xl sm:text-xl text-black hover:underline mt-1 leading-none"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-lg sm:text-lg md:text-xl py-2.5 md:py-3 leading-none"
        >
          LogIn
        </button>
        <p className="text-lg sm:text-lg md:text-lg leading-none text-center">
                Are you a student? <b className="hover:underline cursor-pointer"           onClick={() => navigate("/student-login")}
>LogIn as a Student</b>
              </p>
        <p className="text-lg sm:text-lg md:text-lg leading-none text-center">
                Are you a Teacher?<b className="hover:underline cursor-pointer"           onClick={() => navigate("/teacher-login")}
>LogIn as a Teacher</b>
              </p>
      </form>
    </div>
  );
};

export default Form;
