import React, { useState } from "react";
import { FaUpload, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UploadQB = () => {
  const navigate = useNavigate();

  const semesters = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  const subjects = [
    { code: "MTH102", name: "Maths" },
    { code: "PHY101", name: "Physics" },
    { code: "CHM101", name: "Chemistry" },
    { code: "ENG101", name: "English" },
    { code: "CSE201", name: "Computer Science" },
  ];

  const branches = ["CSE", "ECE", "MECH", "CIVIL"];
  const regulations = ["R18", "R20", "R22"];

  const [formData, setFormData] = useState({
    regulation: "",
    branch: "",
    semester: "",
    subject: "",
    unitFiles: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddUnit = () => {
    setFormData((prev) => ({
      ...prev,
      unitFiles: [...prev.unitFiles, null],
    }));
  };

  const handleUnitFileChange = (index, file) => {
    const updated = [...formData.unitFiles];
    updated[index] = file;
    setFormData({ ...formData, unitFiles: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { regulation, branch, semester, subject, unitFiles } = formData;

    if (!regulation || !branch || !semester || !subject) {
      alert("Please fill all dropdowns!");
      return;
    }

    if (unitFiles.length === 0 || unitFiles.every((file) => !file)) {
      alert("Upload at least one unit file!");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = new FormData();
      body.append("regulation", regulation);
      body.append("branch", branch);
      body.append("semester", semester);
      body.append("subject", subject);

      unitFiles.forEach((file, i) => {
        if (file) body.append(`unitFiles[${i + 1}]`, file);
      });

      const response = await fetch(
        "http://localhost:8080/VidyaSarthi/faculty/uploadQB",
        {
          method: "POST",
          body,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("QB submitted successfully!");
        setSubmitted(true);
        navigate("/Student-login");
      } else {
        alert(result.message || "Submission failed!");
      }

      setFormData({
        regulation: "",
        branch: "",
        semester: "",
        subject: "",
        unitFiles: [],
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error during submission. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8">
      <h2 className="text-xl font-semibold mb-6">Upload QB popup</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Regulation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="sm:w-48 font-medium">Choose Regulation:</label>
          <select
            name="regulation"
            value={formData.regulation}
            onChange={handleChange}
            className="w-full sm:flex-1 p-3 rounded-lg bg-blue-100"
          >
            <option value="">-- Select Regulation --</option>
            {regulations.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="sm:w-48 font-medium">Choose Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full sm:flex-1 p-3 rounded-lg bg-blue-100"
          >
            <option value="">-- Select Branch --</option>
            {branches.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="sm:w-48 font-medium">Choose Semester:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full sm:flex-1 p-3 rounded-lg bg-blue-100"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem, idx) => (
              <option key={idx} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="sm:w-48 font-medium">Choose Subject:</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full sm:flex-1 p-3 rounded-lg bg-blue-100"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((sub) => (
              <option key={sub.code} value={sub.code}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Upload Units */}
        <div>
          <label className="font-medium block mb-2">Upload Units:</label>
          <div className="space-y-4">
            {formData.unitFiles.map((file, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border p-3 rounded-lg shadow-sm"
              >
                <span className="font-medium w-24">Unit-{index + 1}:</span>

                <label
                  className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg shadow ${
                    isSubmitting
                      ? "bg-gray-300"
                      : "bg-yellow-200 hover:bg-yellow-300"
                  }`}
                >
                  <FaUpload className="text-gray-700" />
                  <span className="text-sm">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleUnitFileChange(index, e.target.files[0] || null)
                    }
                    disabled={isSubmitting}
                  />
                </label>

                {file && (
                  <span className="text-xs text-green-600 truncate max-w-[150px]">
                    {file.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Unit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleAddUnit}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
            >
              <FaPlus />
              <span>Add Unit</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-8 py-2 rounded-md shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
          🎉 QB submitted successfully!
        </div>
      )}
    </div>
  );
};

export default UploadQB;
