import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import cardpic from "../assets/card.png";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

const Form = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role] = useState("admin"); // keep as admin per your earlier code
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      // NOTE: backend expects { username, password } (see your LoginRequest)
      const res = await fetch("http://localhost:8080/VidyaSarthi/loginAcc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        // try to parse error body if present
        let errBody = {};
        try { errBody = await res.json(); } catch (_) {}
        throw new Error(errBody?.message || `Login failed (${res.status})`);
      }

      const result = await res.json();
      console.log("loginAcc response:", result);

      const token = result?.token || null;         // JWT token from backend
      const dto = result?.dto || {};               // user object (dto)
      // Try common id fields (facultyId for teachers, id/adminId for others)
      const facultyId = dto?.facultyId || dto?.facultyID || dto?.facultyid || null;
      const userId = dto?.id || dto?.userId || dto?.adminId || null;
      const emailFromDto = dto?.email || data.email;
      const nameFromDto = dto?.name || null;

      if (!token) {
        // backend should return token — handle gracefully
        throw new Error("Authentication failed: token not returned.");
      }

      // Build user profile for AuthContext
      const userObject = {
        ...dto,
        email: emailFromDto,
        name: nameFromDto,
        id: userId,
        facultyId: facultyId,
        role: role,
      };

      // Update AuthContext (adjust if your login signature expects other shape)
      try {
        login({
          user: userObject,
          token: token,
          role: role,
          facultyId: facultyId || null,
          adminId: role === "admin" ? userId : null,
        });
      } catch (e) {
        console.warn("AuthContext.login threw an error (check signature):", e);
      }

      // Persist to localStorage (merged under vidyaSarthiAuth for compatibility)
      try {
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
        // also save simple keys if needed elsewhere
        localStorage.setItem("token", token);
        if (userId) localStorage.setItem("userId", userId);
        if (facultyId) localStorage.setItem("facultyId", facultyId);
      } catch (e) {
        console.warn("Could not persist auth to localStorage:", e);
      }

      // Navigate — admin -> /admin/dashboard, teacher -> /teacher/dashboard
      if (role === "admin") {
        navigate("/admin/dashboard", { state: { adminId: userId, email: emailFromDto } });
      } else if (role === "teacher") {
        navigate("/teacher/dashboard", { state: { facultyId, email: emailFromDto } });
      } else {
        navigate("/", { state: { email: emailFromDto } });
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message || "Login failed. Please try again.");
      alert(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
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

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-base md:text-lg py-2 md:py-2.5 mt-3"
        >
          {loading ? "Logging in..." : "LogIn"}
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
