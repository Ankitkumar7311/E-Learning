import React, { useState } from "react";

const RegulationForm = () => {
  const regulations = ["R15", "R17", "R19", "R21"];
  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const semesters = [
    "1st Sem", "2nd Sem", "3rd Sem", "4th Sem",
    "5th Sem", "6th Sem", "7th Sem", "8th Sem"
  ];
  const subjects = ["A", "B", "C", "D", "E", "F"];
  const subjectOptions = ["Maths", "Physics", "Chemistry", "English"];

  const [formData, setFormData] = useState({
    regulation: "",
    branch: "",
    semester: "",
    subjects: Array(subjects.length).fill(""),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, value) => {
    setFormData((prev) => {
      const newSubjects = [...prev.subjects];
      newSubjects[index] = value;
      return { ...prev, subjects: newSubjects };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Reusable select field
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
          <option key={idx} value={opt}>{opt}</option>
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

        <SelectField
          label="Semester"
          name="semester"
          options={semesters}
          value={formData.semester}
          onChange={handleChange}
        />

        <div className="mb-4">
          <label className="block mb-2">
            Subjects: <span className="text-sm">(Choose Priority Wise)</span>
          </label>
          <div className="flex gap-3 flex-wrap">
            {subjects.map((sub, index) => (
              <select
                key={index}
                value={formData.subjects[index]}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                className="p-2 rounded-md bg-blue-100"
              >
                <option value="">{sub}. Choose</option>
                {subjectOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
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
