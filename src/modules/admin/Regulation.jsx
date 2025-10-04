// src/components/RegulationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const RegulationForm = () => {
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();

  const token =
    contextToken || JSON.parse(localStorage.getItem("vidyaSarthiAuth"))?.token;

  const [formData, setFormData] = useState({
    regulation: "",
    branch: "",
    semester: "",
    subjectDto: [{ name: "", subjectCode: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    setFormData((prev) => {
      const newSubjects = prev.subjectDto.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, subjectDto: newSubjects };
    });
  };

  const addSubjectRow = () => {
    setFormData((prev) => ({
      ...prev,
      subjectDto: [...prev.subjectDto, { name: "", subjectCode: "" }],
    }));
  };

  const removeSubjectRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjectDto: prev.subjectDto.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filledSubjects = formData.subjectDto.filter(
      (sub) => sub.name.trim() && sub.subjectCode.trim()
    );

    if (!formData.regulation || !formData.branch || !formData.semester || filledSubjects.length === 0) {
      alert("Please fill in all required fields and at least one subject.");
      return;
    }

    // ✅ ONLY CHANGE: take exactly what admin types, e.g., "R2027"
    const regulationId = formData.regulation;
    const semesterNumber = Number(formData.semester);

    const bodyToSend = {
      name: formData.regulation,
      regulationId: regulationId,
      newSubjects: filledSubjects.map((sub) => ({
        subjectCode: sub.subjectCode,
        name: sub.name,
        semester: semesterNumber,
        regulationId: regulationId,
        branchType: formData.branch,
      })),
    };

    console.log("Submitting body:", bodyToSend);
    console.log("Token being sent:", token);

    try {
      const response = await fetch(
        "http://localhost:8080/VidyaSarthi/addNewRegulation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(bodyToSend),
        }
      );

      const text = await response.text();

      if (response.status === 409) {
        alert("Duplicate entry: This regulation already exists.");
      } else if (response.ok) {
        alert(text || "Regulation added successfully!");
        navigate("/Student-login");
      } else {
        alert(text || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Add Regulation</h2>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 w-full">Regulation :</label>
          <input
            type="text"
            name="regulation"
            value={formData.regulation}
            onChange={handleChange}
            placeholder="Enter Regulation (e.g., R2027)"
            className="w-full sm:flex-1 p-2 rounded-md bg-blue-100"
          />
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 w-full">Branch :</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Enter Branch (e.g., CIVIL)"
            className="w-full sm:flex-1 p-2 rounded-md bg-blue-100"
          />
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 w-full">Semester :</label>
          <input
            type="number"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Enter Semester (e.g., 1)"
            className="w-full sm:flex-1 p-2 rounded-md bg-blue-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Subjects: <span className="text-sm">(Priority Wise)</span>
          </label>

          <div className="flex flex-col gap-2">
            {formData.subjectDto.map((sub, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-gray-50 p-2 rounded"
              >
                <div className="text-sm font-medium">{index + 1}.</div>

                <input
                  type="text"
                  placeholder="Subject Name"
                  value={sub.name}
                  onChange={(e) =>
                    handleSubjectChange(index, "name", e.target.value)
                  }
                  className="w-full sm:flex-1 p-2 rounded-md bg-blue-100"
                />

                <input
                  type="text"
                  placeholder="Subject Code"
                  value={sub.subjectCode}
                  onChange={(e) =>
                    handleSubjectChange(index, "subjectCode", e.target.value)
                  }
                  className="w-full sm:w-48 p-2 rounded-md bg-blue-100"
                />

                <button
                  type="button"
                  onClick={() => removeSubjectRow(index)}
                  className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSubjectRow}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Subject
          </button>
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition block mx-auto"
        >
          Submit Now
        </button>
      </form>
    </div>
  );
};

export default RegulationForm;
