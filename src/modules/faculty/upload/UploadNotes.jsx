import React, { useState } from "react";
import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";

const UploadNotes = () => {
  // --- Data for Dropdowns ---
  const regulations = ["R22", "R20", "R18", "R16"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const branches = [
    "Computer Science and Engineering (CSE)",
    "Electronics and Communication Engineering (ECE)",
    "Mechanical Engineering (MECH)",
  ];
  const subjects = [
    "Engineering Mathematics-I",
    "Applied Physics",
    "Programming for Problem Solving",
  ];
  // --- End of Data ---

  const createInitialUnits = () =>
    Array.from({ length: 5 }, (_, i) => ({
      name: `Unit ${i + 1}`,
      file: null,
    }));

  const initialFormData = {
    regulation: "",
    semester: "",
    branch: "",
    subject: "",
    units: createInitialUnits(),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  // --- Handlers remain the same ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (index, file) => {
    const updatedUnits = [...formData.units];
    updatedUnits[index].file = file;
    setFormData((prev) => ({ ...prev, units: updatedUnits }));
  };

  const addUnit = () => {
    setFormData((prev) => ({
      ...prev,
      units: [
        ...prev.units,
        { name: `Unit ${prev.units.length + 1}`, file: null },
      ],
    }));
  };

  const removeUnit = (indexToRemove) => {
    setFormData((prev) => {
      const filteredUnits = prev.units.filter((_, index) => index !== indexToRemove);
      const updatedUnits = filteredUnits.map((unit, index) => ({
        ...unit,
        name: `Unit ${index + 1}`,
      }));
      return { ...prev, units: updatedUnits };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.regulation || !formData.semester || !formData.branch || !formData.subject) {
      alert("Please fill in all the selection fields!");
      return;
    }
    if (formData.units.every((unit) => !unit.file)) {
      alert("Please upload notes for at least one unit!");
      return;
    }
    console.log("Form Submitted ✅", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData(initialFormData);
  };

  // --- Reusable Component for Selection Dropdowns ---
  const SelectInput = ({ name, label, value, onChange, options, placeholder }) => (
    <div className="flex flex-col">
      <label className="font-medium mb-2">{label}:</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-gray-300 bg-blue-100"
      >
        <option value="">-- {placeholder} --</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  // --- Reusable Component for the Selection Panel ---
  const SelectionPanel = () => (
    <div className="flex flex-col gap-6">
      <SelectInput
        name="regulation" label="Choose Regulation" value={formData.regulation}
        onChange={handleChange} options={regulations} placeholder="Select Regulation"
      />
      <SelectInput
        name="semester" label="Choose Semester" value={formData.semester}
        onChange={handleChange} options={semesters} placeholder="Select Semester"
      />
      <SelectInput
        name="branch" label="Choose Branch" value={formData.branch}
        onChange={handleChange} options={branches} placeholder="Select Branch"
      />
      <SelectInput
        name="subject" label="Choose Subject" value={formData.subject}
        onChange={handleChange} options={subjects} placeholder="Select Subject"
      />
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl p-4 md:p-8">
      <h2 className="text-lg font-semibold mb-6">Complete your Upload:</h2>

      <form onSubmit={handleSubmit}>
        <div className="transition-all duration-500 ease-in-out">
          {/* --- STAGE 1: Centered Layout --- */}
          {!formData.subject && (
            <div className="flex justify-center items-center py-10">
              <div className="w-full md:w-1/2 p-4 md:p-6 border rounded-lg shadow-lg bg-gray-50">
                <SelectionPanel />
              </div>
            </div>
          )}

          {/* --- STAGE 2: Side-by-Side Layout --- */}
          {formData.subject && (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side */}
              <div className="w-full md:w-2/5 p-4 border rounded-lg shadow-sm">
                <SelectionPanel />
              </div>

              {/* Right Side */}
              <div className="w-full md:w-3/5 p-4 border rounded-lg shadow-sm">
                <label className="block font-medium mb-4">
                  Upload Notes for <span className="text-blue-600">{formData.subject}</span>:
                </label>
                <div className="flex flex-col gap-4">
                  {formData.units.map((unit, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 border p-3 rounded-lg bg-gray-50">
                      <span className="font-medium w-full md:w-20">{unit.name}:</span>
                      
                      {/* --- RESPONSIVE CHANGE: New container for buttons --- */}
                      <div className="flex items-center gap-3 w-full md:flex-1">
                        <label className="flex-1 flex items-center gap-2 cursor-pointer bg-yellow-200 hover:bg-yellow-300 px-4 py-2 rounded-lg shadow justify-center md:justify-start">
                          <FaUpload className="text-gray-700" />
                          <span className="text-sm">{unit.file ? "Change File" : "Upload"}</span>
                          <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e.target.files[0] || null)} />
                        </label>
                        
                        {formData.units.length > 1 && (
                            <button type="button" onClick={() => removeUnit(index)} className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full shadow transition-colors" aria-label="Remove Unit">
                              <FaTrash size={12} />
                            </button>
                        )}
                      </div>
                      
                      {unit.file && (
                        <span className="text-xs text-green-600 truncate w-full text-center md:flex-1 md:text-left">
                          {unit.file.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-start mt-4">
                  <button type="button" onClick={addUnit} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow text-sm">
                    <FaPlus size={12} /> Add Extra Unit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- BOTTOM: Submit Button --- */}
        {formData.subject && (
          <div className="flex justify-center pt-8">
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-8 py-3 rounded-md shadow w-full md:w-auto">
              Submit Now
            </button>
          </div>
        )}
      </form>

      {/* --- Success Message --- */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
          🎉 Form submitted successfully!
        </div>
      )}
    </div>
  );
};

export default UploadNotes;