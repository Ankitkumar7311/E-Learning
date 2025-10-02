// StudentLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bg from "../assets/Rectangle.png";
import curveBg from "../assets/Curve.png";
import card from "../assets/card.png";
import { useAuth } from "../auth/AuthContext";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (!token) throw new Error("Authentication failed: token not returned.");

      // try common fields for student dto
      const studentId = dto?.studentId || dto?.studentID || dto?.studentid || null;
      const userId = dto?.id || dto?.userId || dto?.studentId || null;
      const emailFromDto = dto?.email || data.email;
      const nameFromDto = dto?.name || dto?.fullName || null;

      const userObject = {
        ...dto,
        email: emailFromDto,
        name: nameFromDto,
        id: userId,
        studentId: studentId,
        role: "student",
      };

      // Use the same login shape your Admin uses
      await login({
        user: userObject,
        token,
        role: "student",
        facultyId: null,
        adminId: null,
      });

      // Persist same keys as admin flow so ApiClient and other code find them
      const key = "vidyaSarthiAuth";
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      const merged = {
        ...existing,
        user: userObject,
        token,
        role: "student",
        studentId: studentId || existing.studentId || null,
      };
      localStorage.setItem(key, JSON.stringify(merged));
      // also keep token/social keys for backward compatibility
      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (studentId) localStorage.setItem("studentId", studentId);
      localStorage.setItem("userEmail", emailFromDto);

      // navigate to student dashboard
      navigate("/student/dashboard", { state: { studentId: studentId || userId, email: emailFromDto } });

    } catch (err) {
      console.error("Student login error:", err);
      setError(err.message || "Login failed");
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-cover px-2 sm:px-4" style={{ backgroundImage: `url(${curveBg})` }}>
      <div className="relative rounded-3xl shadow-xl overflow-hidden w-[95vw] sm:w-[88vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px] md:aspect-[16/9] bg-no-repeat bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="md:absolute md:top-4 md:bottom-6 md:right-6 md:w-[46%] w-full rounded-2xl p-6 sm:p-8 md:p-10 bg-transparent overflow-hidden" style={{ backgroundImage: `url(${card})`, backgroundRepeat: "no-repeat", backgroundPosition: "right top", backgroundSize: "100% 100%" }}>
          <div className="h-full overflow-y-auto pr-1 sm:pr-3">
            <h1 className="font-roboto font-semibold text-3xl text-center">Student LogIn</h1>
            <p className="font-montserrat text-sm text-gray-700 mb-4 text-center">Welcome onboard with us!</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <label className="font-medium">Institute Email ID</label>
              <input type="text" placeholder="Enter your username" className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none" {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

              <label className="font-medium">Password</label>
              <input type="password" placeholder="Enter your password" className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none" {...register("password", { required: "Password required" })} />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={loading} className="bg-[#F3B300] rounded-2xl w-full font-bold py-2 mt-2">{loading ? "Logging in..." : "LogIn as Student"}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentLogin;
