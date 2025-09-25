import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegulationAddedpopup from "./popups/RegulationAddedpopup";

const RegulationForm = () => {
  const navigate = useNavigate();

  const regulations = ["R15", "R17", "R19", "R21", "2025"];
  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting body:", formData);

    // ✅ Client-side validation
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

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Add Regulation</h2>

        <div className="mb-3 flex items-center gap-4">
  <label className="w-40">Regulation :</label>
  <input
    type="text"
    name="regulation"
    value={formData.regulation}
    onChange={handleChange}
    placeholder="Enter Regulation"
    className="flex-1 p-2 rounded-md bg-blue-100"
  />
</div>

<div className="mb-3 flex items-center gap-4">
  <label className="w-40">Branch :</label>
  <input
    type="text"
    name="branch"
    value={formData.branch}
    onChange={handleChange}
    placeholder="Enter Branch"
    className="flex-1 p-2 rounded-md bg-blue-100"
  />
</div>


        {/* <SelectField
          label="Regulation"
          name="regulation"
          options={regulations}
          value={formData.regulation}
          onChange={handleChange}
        /> */}

        {/* <div className="flex flex-col"> */}



  {/* <label className="w-40">Regulation</label>
  <input
    type="text"
    name="regulation"
    value={formData.regulation}
    onChange={handleChange}
    placeholder="Enter Regulation"
    className="p-2 rounded-md bg-blue-100 border border-gray-300"
  /> <br /> */}
{/* </div> */}



        {/* <SelectField
          label="Branch"
          name="branch"
          options={branches}
          value={formData.branch}
          onChange={handleChange}
        /> */}

        {/* <div className="mb-3 flex items-center gap-4"> */}


  {/* <label className="w-40">Branch :</label>
  <input
    type="text"
    name="branch"
    value={formData.branch}
    onChange={handleChange}
    placeholder="Enter Branch"
    className="flex-1 p-2 rounded-md bg-blue-100"
  /> */}
{/* </div> */}


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
