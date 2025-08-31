import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import
import cardpic from "../../assets/card.png";

const Form = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();   // ✅ hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // ✅ Login hone ke baad dashboard pe bhej do
    navigate("/dashboard");

    setFormData({ email: "", password: "" });
  };

  return (
    <section
      className="absolute top-10 left-145 w-[320px] h-100 pl-6 pr-1 pt-2 bg-cover bg-no-repeat rounded-2xl "
      style={{ backgroundImage: `url(${cardpic})` }}
    >
      <h1 className="text-4xl font-roboto font-medium mb-2">Login</h1>
      <hr className="border-t border-gray-300 mb-2 w-[60%]" />
      <h4 className="text-base font-montserrat mb-3">
        Welcome onboard with us!
      </h4>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="font-medium mb-1">Email ID</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your username"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 w-[92%] "
          />
          <label className="font-medium mb-1 pt-3">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 w-[92%] "
          />

          <button
            type="button"
            className="text-sm text-gray-900 hover:underline pl-[45%]"
          >
            Forgot Password?
          </button>

          {/* ✅ Login pe navigate */}
          <button
            type="submit"
            className="bg-[#F3B300] !rounded-2xl py-2 font-semibold text-lg hover:bg-yellow-600 w-[92%]"
          >
            LogIn
          </button>

          <p className="text-center !text-[18px]/[20px] mt-4">
            Don’t have an account? <b className="block">Signup as a student</b>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Form;
