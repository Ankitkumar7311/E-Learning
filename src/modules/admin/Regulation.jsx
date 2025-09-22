import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegulationAddedpopup from "./popups/RegulationAddedpopup";

const RegulationForm = () => {
  const navigate = useNavigate();

  const regulations = ["R15", "R17", "R19", "R21", "2025"];
  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // fixed 5 empty subjects
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting body:", formData);

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

      const result = await response.json();

      if (response.ok) {
        alert("Account created successfully! You can now login.");
        navigate("/Student-login");
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Server error. Please try again later.");
    }
  };

  const SelectField = ({ label, name, options, value, onChange }) => (
    <div className="mb-3 flex items-center gap-4">
      <label className="w-40">{label} :</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 p-2 rounded-md bg-blue-100"
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

  return (
    <div className="w-full flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-[800px]"
      >
        <h2 className="text-xl font-semibold mb-4">Add Regulation</h2>

        <SelectField
          label="Regulation"
          name="regulation"
          options={regulations}
          value={formData.regulation}
          onChange={handleChange}
        />

        <SelectField
          label="Branch"
          name="branch"
          options={branches}
          value={formData.branch}
          onChange={handleChange}
        />

        <div className="mb-3 flex items-center gap-4">
          <label className="w-40">Semester :</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="flex-1 p-2 rounded-md bg-blue-100"
          >
            <option value="">Choose Semester</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">
            Subjects: <span className="text-sm">(Priority Wise)</span>
          </label>

          <div className="flex flex-col gap-2">
            {formData.subjectDto.map((sub, index) => (
              <div
                key={index}
                className="flex gap-3 items-center bg-gray-50 p-2 rounded"
              >
                <div className="w-6 text-sm">{index + 1}.</div>

                <input
                  type="text"
                  placeholder="Subject Name"
                  value={sub.name}
                  onChange={(e) =>
                    handleSubjectChange(index, "name", e.target.value)
                  }
                  className="flex-1 p-2 rounded-md bg-blue-100"
                />

                <input
                  type="text"
                  placeholder="Subject Code"
                  value={sub.subjectCode}
                  onChange={(e) =>
                    handleSubjectChange(index, "subjectCode", e.target.value)
                  }
                  className="w-48 p-2 rounded-md bg-blue-100"
                />
              </div>
            ))}
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
