import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

const UploadNotes = () => {
  const semesters = [
    "1st Semester (2021 - 22 Autumn)",
    "2nd Semester (2021 - 22 Spring)",
    "3rd Semester (2022 - 23 Autumn)",
    "4th Semester (2022 - 23 Spring)",
    "5th Semester (2022 - 23 Autumn)",
    "6th Semester (2023 - 24 Spring)",
    "7th Semester (2023 - 24 Autumn)",
    "8th Semester (2023 - 24 Spring)",
  ];

  const subjects = ["A", "B", "C", "D"];

  const [formData, setFormData] = useState({
    semester: "",
    subjects: Array(subjects.length).fill(""),
    files: Array(subjects.length).fill(null),
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubjectChange = (index, value) => {
    const updated = [...formData.subjects];
    updated[index] = value;
    setFormData({ ...formData, subjects: updated });
  };

  const handleFileChange = (index, file) => {
    const updated = [...formData.files];
    updated[index] = file;
    setFormData({ ...formData, files: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.semester) {
      alert("Please select a semester!");
      return;
    }

    if (formData.files.every((file) => !file)) {
      alert("Please upload at least one file!");
      return;
    }

    console.log("Form Submitted ✅", formData);
    setSubmitted(true);

    // Reset form
    setFormData({
      semester: "",
      subjects: Array(subjects.length).fill(""),
      files: Array(subjects.length).fill(null),
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8 border">
      <h2 className="text-lg font-semibold mb-6">Complete your Upload:</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Semester */}
        <div className="flex items-center">
          <label className="w-48 font-medium">Choose Semester:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects & Uploads */}
        <div>
          <label className="block font-medium mb-2">
            Choose Subjects:{" "}
            <span className="text-gray-500 text-xs">(Priority Wise)</span>
          </label>

          <div className="flex flex-col gap-4">
            {subjects.map((s, index) => (
              <div
                key={s}
                className="flex items-center gap-3 border p-3 rounded-lg shadow-sm"
              >
                <select
                  value={formData.subjects[index]}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-gray-300 bg-blue-100"
                >
                  <option value="">{s}. Choose</option>
                  <option value="Maths">Maths</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer bg-yellow-200 hover:bg-yellow-300 px-4 py-2 rounded-lg shadow">
                  <FaUpload className="text-gray-700" />
                  <span className="text-sm">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(index, e.target.files[0] || null)
                    }
                  />
                </label>

                {formData.files[index] && (
                  <span className="text-xs text-green-600">
                    {formData.files[index].name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-8 py-2 rounded-md shadow">
            Submit Now
          </button>
        </div>
      </form>

      {/* Success Message */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
          🎉 Form submitted successfully!
        </div>
      )}
    </div>
  );
};

export default UploadNotes;
