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
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    navigate("/Student-login");
  };

  // Reusable input component (reduces repetition)
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
            placeholder="Enter your username"
            registerOptions={{
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
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

          {/* OTP (optional validation later) */}
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
