import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Submit handler
 const onSubmit = async (data) => {
  try {
    const response = await fetch("http://localhost:8080/VidyaSarthi/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // send all form data
    });

    const result = await response.json();

    if (response.ok) {
      alert("Account created successfully! You can now login.");
      // Reset form after success
      navigate("/Student-login");
    } else {
      alert(result.message || "Something went wrong!");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("Server error. Please try again later.");
  }
};

  
  // Reusable input component
  const InputField = ({ id, label, type = "text", registerOptions, ...rest }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent transition-colors duration-200"
        {...register(id, registerOptions)}
        {...rest}
      />
      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">SignUp</h1>
          <hr className="border-t-2 border-gray-300 w-12" />
          <p className="text-sm text-gray-500 mt-2">Welcome onboard with us!</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <InputField
            id="name"
            label="Name"
            placeholder="Enter your full name"
            registerOptions={{
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            }}
          />

          {/* Student ID */}
          <InputField
            id="studentId"
            label="Student ID"
            placeholder="Enter your Student ID"
            registerOptions={{
              required: "Student ID is required",
              minLength: { value: 4, message: "Student ID must be at least 4 characters" },
            }}
          />

          {/* Email */}
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            registerOptions={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            }}
          />

          {/* Branch */}
          <InputField
            id="branch"
            label="Branch"
            placeholder="Enter your branch (e.g., CSE)"
            registerOptions={{
              required: "Branch is required",
            }}
          />

          {/* Year */}
          <InputField
            id="year"
            label="Year"
            placeholder="Enter your year (e.g., 2026)"
            registerOptions={{
              required: "Year is required",
              pattern: {
                value: /^[0-9]{4}$/,
                message: "Year must be a 4-digit number",
              },
            }}
          />

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent transition-colors duration-200"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
                    message:
                      "Password must include uppercase, lowercase, and a special character",
                  },
                })}
              />
              <button
                type="button"
                className="mt-1 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md 
                           hover:bg-yellow-400 transition-colors duration-200 flex-shrink-0"
              >
                Generate OTP
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* OTP */}
          <InputField
            id="otp"
            label="OTP"
            placeholder="Enter your OTP"
            registerOptions={{}}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-md 
                         hover:bg-yellow-400 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
