import React, { useState } from "react";
import ProfileLeft from "../../layouts/facultydashboard/ProfileLeft";
import teacher from "../../assets/teacher.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateTeach = ({ email }) => {
  const [formData, setFormData] = useState({
    address: "",
    branch: "",
    subject: "",
    designation: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost:8080/VidyaSarthi/updateFaculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, facultyId: formData.facultyId }),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
          if (!res.ok) throw new Error(data.message || "Update failed");
        } else {
          data = await res.text();
          if (!res.ok) throw new Error(data || "Update failed");
        }
        return data;
      })
      .then((message) =>
        toast.success(message || "Profile updated successfully")
      )
      .catch((err) => toast.error(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center md:items-start justify-start md:justify-center p-4 md:p-10 gap-6">
      {/* Left card with backend profile */}
      <ProfileLeft email={email} />

      {/* Update Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-start items-center bg-white shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-md space-y-4"
      >
        <img
          src={teacher}
          alt="Teacher"
          className="h-32 w-32 md:h-36 md:w-36 rounded-xl object-cover shadow-md"
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="file"
          placeholder="Upload image"
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="address"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="branch"
          placeholder="Enter branch"
          value={formData.branch}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="subject"
          placeholder="Enter subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="designation"
          placeholder="Enter designation"
          value={formData.designation}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          className="bg-blue-100 p-2 rounded-xl w-full"
          type="password"
          name="password"
          placeholder="Enter password"
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
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdateTeach;
