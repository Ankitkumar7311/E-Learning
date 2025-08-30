// components/upload/UploadPYQ.jsx
import React, { useState } from "react"; // <-- IMPORTANT

const UploadPYQ = () => {
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
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubjectChange = (index, value) => {
    const updated = [...formData.subjects];
    updated[index] = value;
    setFormData({ ...formData, subjects: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted ✅", formData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8 border">
      <h2 className="text-lg font-semibold mb-6">Complete your Upload:</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex items-center">
          <label className="w-48 font-medium">
            Choose Subjects:{" "}
            <span className="text-gray-500 text-xs">(Choose Priority Wise)</span>
          </label>
          <div className="flex gap-3 flex-1">
            {subjects.map((s, index) => (
              <select
                key={s}
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
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-8 py-2 rounded-md shadow"
          >
            Submit Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPYQ;
