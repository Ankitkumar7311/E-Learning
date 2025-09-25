import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegulationAddedpopup from "./popups/RegulationAddedpopup";

const RegulationForm = () => {
  const navigate = useNavigate();

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const defaultSubjects = Array.from({ length: 5 }, () => ({
    name: "",
    subjectCode: "",
  }));

  const [formData, setFormData] = useState({
    regulation: "",
    branch: "",
    semester: "",
    subjectDto: defaultSubjects,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    setFormData((prev) => {
      const newSubjects = prev.subjectDto.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, subjectDto: newSubjects };
    });
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjectDto: [...prev.subjectDto, { name: "", subjectCode: "" }],
    }));
  };

  const removeSubject = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      subjectDto: prev.subjectDto.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting body:", formData);

    const isFormValid =
      formData.regulation &&
      formData.branch &&
      formData.semester &&
      formData.subjectDto.every(
        (sub) => sub.name.trim() && sub.subjectCode.trim()
      );

    if (!isFormValid) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/VidyaSarthi/addRegulation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
      console.error("Error during signup:", error);
      alert("Server error. Please try again later.");
    }
  };

  const SelectField = ({ label, name, options, value, onChange }) => (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="sm:w-40 w-full">{label} :</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full sm:flex-1 p-2 rounded-md bg-blue-100"
      >
        <option value="">Choose {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
  
  const InputField = ({ label, name, value, onChange, placeholder }) => (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="sm:w-40 w-full">{label} :</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full sm:flex-1 p-2 rounded-md bg-blue-100"
      />
    </div>
  );

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Add Regulation</h2>

        <InputField
          label="Regulation"
          name="regulation"
          placeholder="Enter Regulation"
          value={formData.regulation}
          onChange={handleChange}
        />

        <InputField
          label="Branch"
          name="branch"
          placeholder="Enter Branch"
          value={formData.branch}
          onChange={handleChange}
        />

        <SelectField
          label="Semester"
          name="semester"
          options={semesters}
          value={formData.semester}
          onChange={handleChange}
        />

        <div>
          <label className="block font-medium mb-2">
            Subjects: <span className="text-sm">(Priority Wise)</span>
          </label>

          <div className="flex flex-col gap-2">
            {formData.subjectDto.map((sub, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gray-50 p-2 rounded"
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
                
                {formData.subjectDto.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="bg-blue-400 text-black font-bold h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-400 transition"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-2">
            {/* ✅ This button now has an SVG icon */}
            <button
              type="button"
              onClick={addSubject}
              className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add Subject</span>
            </button>
          </div>
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