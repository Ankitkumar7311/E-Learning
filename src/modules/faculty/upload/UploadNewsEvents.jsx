import { useState } from "react";

const UploadNewsEvents = () => {
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

  const [formData, setFormData] = useState({
    semester: "",
    description: "", // ✅ event description
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted ✅", formData);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8 border">
      <h2 className="text-lg font-semibold mb-6">Complete your Upload:</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* News/Events Type */}
        <div className="flex items-center">
          <label className="w-48 font-medium">Choose News/Events type:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem, idx) => (
              <option key={idx} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Text Area for Event Description */}
        <div className="flex items-start">
          <label className="w-48 font-medium">Enter the Event:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event..."
            rows="4"
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-8 py-2 rounded-md shadow"
          >
            Submit Now
          </button>
        </div>
      </form>

      {/* ✅ Success Popup */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
          🎉 Form submitted successfully!
          <br />
          Type: {formData.semester}
          <br />
          Event: {formData.description}
        </div>
      )}
    </div>
  );
};

export default UploadNewsEvents;
