import { useState } from "react";
import { useLocation } from "react-router-dom";
import teacher from "../../assets/teacher.jpg";

const UpdateTeach = () => {
  const location = useLocation();
  const { email, facultyId } = location.state || {}; // login se aayega

  const [formData, setFormData] = useState({
    address: "",
    branch: "",
    subject: "",
    designation: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost:8080/VidyaSarthi/updateFaculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, facultyId }), // facultyId bhi jayega
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.text();
      })
      .then(() => {
        setMsg("Profile updated successfully!");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMsg("Error updating profile.");
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-start items-center bg-white shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-md space-y-4"
      >
        <img
          src={teacher}
          alt="Teacher"
          className="h-32 w-32 md:h-36 md:w-36 rounded-xl object-cover shadow-md"
        />

        {/* FacultyId field (readonly) */}
        <input
          className="bg-gray-200 p-2 rounded-xl w-full cursor-not-allowed"
          type="text"
          name="facultyId"
          placeholder="Faculty ID"
          value={facultyId || ""}
          readOnly
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="file"
          placeholder="Upload your profile photo"
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="Enter Email address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="branch"
          placeholder="Enter your branch (e.g. CSE, ECE)"
          value={formData.branch}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="subject"
          placeholder="Enter your subject specialization"
          value={formData.subject}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="designation"
          placeholder="Enter your designation (e.g. Assistant Professor)"
          value={formData.designation}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="password"
          name="password"
          placeholder="Enter your new password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="text-white bg-yellow-500 p-3 rounded-xl w-full hover:bg-yellow-600 transition"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {msg && <p className="text-center mt-2">{msg}</p>}
      </form>
    </div>
  );
};

export default UpdateTeach;     