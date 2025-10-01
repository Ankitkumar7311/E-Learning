import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import academic from "../assets/academic.png"; // background
import cardpic from "../assets/card.png";       // form card
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

const Form = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/VidyaSarthi/loginAcc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.email, password: data.password }),
      });

      if (!res.ok) {
        let errBody = {};
        try { errBody = await res.json(); } catch (_) {}
        throw new Error(errBody?.message || `Login failed (${res.status})`);
      }

      const result = await res.json();
      const token = result?.token || null;
      const dto = result?.dto || {};
      const facultyId = dto?.facultyId || dto?.facultyID || dto?.facultyid || null;
      const userId = dto?.id || dto?.userId || dto?.adminId || null;
      const emailFromDto = dto?.email || data.email;
      const nameFromDto = dto?.name || null;

      if (!token) throw new Error("Authentication failed: token not returned.");

      const userObject = {
        ...dto,
        email: emailFromDto,
        name: nameFromDto,
        id: userId,
        facultyId: facultyId,
        role: role,
      };

      login({
        user: userObject,
        token: token,
        role: role,
        facultyId: facultyId || null,
        adminId: role === "admin" ? userId : null,
      });

      // Persist to localStorage
      const key = "vidyaSarthiAuth";
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      const merged = {
        ...existing,
        user: userObject,
        token,
        facultyId: facultyId || existing.facultyId || null,
        adminId: role === "admin" ? userId || existing.adminId : existing.adminId,
      };
      localStorage.setItem(key, JSON.stringify(merged));
      localStorage.setItem("userEmail", emailFromDto);
      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (facultyId) localStorage.setItem("facultyId", facultyId);

      if (role === "admin") navigate("/admin/dashboard", { state: { adminId: userId, email: emailFromDto } });
      else if (role === "teacher") navigate("/teacher/dashboard", { state: { facultyId, email: emailFromDto } });
      else navigate("/", { state: { email: emailFromDto } });

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
      alert(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${academic})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Form card shifted 100px to the right */}
      <div
        className="relative z-10 w-full max-w-md sm:max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl pt-6 px-4 sm:p-5 md:p-6 bg-white bg-opacity-80 shadow-lg ml-[650px]"
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
          <label className="font-medium text-sm md:text-base">Email ID</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full bg-[#D8E7F5] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

          <label className="font-medium text-sm md:text-base">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full bg-[#D8E7F5] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

          <button type="button" className="self-end text-xs md:text-sm text-black hover:underline">
            Forgot Password?
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-base md:text-lg py-2 md:py-2.5 mt-3"
          >
            {loading ? "Logging in..." : "LogIn"}
          </button>

          <div className="mt-3 space-y-1">
            <p className="text-xs md:text-base text-center">
              Are you a Student?{" "}
              <b className="hover:underline cursor-pointer" onClick={() => navigate("/student-login")}>
                LogIn as a Student
              </b>
            </p>
            <p className="text-xs md:text-base text-center">
              Are you a Teacher?{" "}
              <b className="hover:underline cursor-pointer" onClick={() => navigate("/teacher-login")}>
                LogIn as a Teacher
              </b>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
