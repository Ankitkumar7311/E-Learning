import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bg from "../assets/Rectangle.png";
import curveBg from "../assets/Curve.png";
import card from "../assets/card.png";
import { useAuth } from "./AuthContext";

/**
 * TeacherLogin
 * - Logs in via /VidyaSarthi/loginAcc
 * - If facultyId not present in login response, calls /VidyaSarthi/getFacultyId (POST { email })
 * - Persists facultyId into auth.login(...) and localStorage (vidyaSarthiAuth)
 *
 * NOTE: Update base URLs if you use a different host/production URL.
 */
const TeacherLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      // 1) Primary login call
      const response = await fetch("http://localhost:8080/VidyaSarthi/loginAcc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.email, password: data.password }),
      });

      if (!response.ok) {
        let errorBody = {};
        try { errorBody = await response.json(); } catch (_) {}
        const message =
          errorBody?.message ||
          `Login failed with status ${response.status}. Please check your credentials or server status.`;
        throw new Error(message);
      }

      const result = await response.json();

      // 2) Extract useful fields from login response
      const profile = result?.dto || {};
      const backendEmail = profile?.email || result?.email || data.email;
      let facultyId = profile?.facultyId || profile?.facultyID || result?.facultyId || null;
      const token = result?.token || null;

      // 3) If API didn't return facultyId in login response, call getFacultyId endpoint
      if (!facultyId && backendEmail) {
        try {
          const res2 = await fetch("http://localhost:8080/VidyaSarthi/getFacultyId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: backendEmail }),
          });

          if (res2.ok) {
            const dto = await res2.json();
            // EmailDto shape: { email, facultyId }
            facultyId = dto?.facultyId || dto?.facultyID || dto?.facultyid || facultyId;
          } else {
            // Non-fatal: log for debugging, do not block login
            console.warn("getFacultyId returned non-OK status:", res2.status, await res2.text().catch(()=>""));
          }
        } catch (e) {
          console.warn("Failed to call /getFacultyId:", e);
        }
      }

      // 4) Only proceed if login result indicates success (adjust if your backend uses different flag)
      if (result?.success || result?.token || profile) {
        // Build a robust user object for auth context
        const userObject = {
          email: backendEmail,
          id: profile?.id || result?.id || null,
          name: profile?.name || result?.name || null,
          role: "teacher",
          facultyId: facultyId || null,
          ...profile, // include any other fields from dto
        };

        // 5) Call login from auth context - include facultyId in both user and top-level
        try {
          login({
            user: userObject,
            token: token,
            role: "teacher",
            facultyId: facultyId || null,
          });
        } catch (e) {
          console.warn("Auth login threw an error (check AuthContext signature):", e);
          // If your AuthContext expects a different shape, adjust this call accordingly.
        }

        // 6) Persist into localStorage under vidyaSarthiAuth for backward compatibility
        try {
          const key = "vidyaSarthiAuth";
          const existing = JSON.parse(localStorage.getItem(key) || "{}");
          const merged = {
            ...existing,
            user: userObject,
            token: token || existing.token,
            facultyId: facultyId || existing.facultyId || null,
          };
          localStorage.setItem(key, JSON.stringify(merged));
          // Also keep a simple userEmail key in case other code expects it
          localStorage.setItem("userEmail", backendEmail);
        } catch (e) {
          console.warn("Could not persist auth to localStorage:", e);
        }

        // 7) Navigate to dashboard and pass facultyId via location state if desired
        navigate("/teacher/dashboard", { state: { email: backendEmail, facultyId: facultyId || null } });
      } else {
        const msg = result?.message || "Authentication failed. Invalid username or password.";
        throw new Error(msg);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-cover px-4"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      <div
        className="relative rounded-3xl shadow-xl overflow-hidden
        w-full sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-w-[1120px]
        min-h-[90vh] md:min-h-fit
        md:aspect-[16/9] bg-no-repeat bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div
          className="md:absolute md:top-4 md:bottom-6 md:right-6 md:w-[46%]
          w-full rounded-2xl p-8 sm:p-6 bg-transparent overflow-hidden
          flex items-center justify-center"
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {/* Email */}
              <label htmlFor="email" className="font-medium text-sm sm:text-base md:text-lg leading-tight">
                Institute Email ID
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                aria-invalid={errors.email ? "true" : "false"}
                className="w-full bg-[#D8E7F5] rounded-xl px-5 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              {/* Password */}
              <label htmlFor="password" className="font-medium text-sm sm:text-base md:text-lg mt-2 leading-tight">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                aria-invalid={errors.password ? "true" : "false"}
                className="w-full bg-[#D8E7F5] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

              {/* Forgot Password */}
              <button
                type="button"
                className="self-end text-xs sm:text-sm md:text-base text-black hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>

              {/* Error */}
              {error && <p role="alert" className="text-red-500 text-sm mt-1">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#F3B300] hover:bg-yellow-600 transition rounded-2xl w-full font-bold text-sm sm:text-base md:text-lg py-2.5 md:py-3 mt-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                aria-busy={loading}
              >
                {loading ? "Logging in..." : "LogIn as Teacher"}
              </button>
            </form>

            {/* Extra links */}
            <div className="mt-6 space-y-2 text-center">
              <p className="text-xs sm:text-sm md:text-base">
                Have Admin Access?{" "}
                <b className="hover:underline cursor-pointer" onClick={() => navigate("/login")}>
                  LogIn as an Admin
                </b>
              </p>
              <p className="text-xs sm:text-sm md:text-base">
                Have Student Access?{" "}
                <b className="hover:underline cursor-pointer" onClick={() => navigate("/student-login")}>
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
