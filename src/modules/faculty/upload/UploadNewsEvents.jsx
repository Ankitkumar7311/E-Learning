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
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/VidyaSarthi/faculty/uploadNews&Announcement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "Announcement",
            describeEvents: formData.description,
            facultyId: "F2007ME011",
          }),
        }
      );

      const raw = await response.text();
      let result;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        result = { message: raw };
      }

      if (!response.ok) {
        const msg =
          (result && (result.message || result.error)) || response.statusText;
        throw new Error(
          msg || "Failed to submit news/event. Please check server status."
        );
      }

      console.log("✅ API Response:", result);

      setSubmittedData({
        semester: formData.semester,
        description: formData.description,
      });

      setSubmitted(true);
      setFormData({ semester: "", description: "" });
    } catch (err) {
      console.error("API Error:", err);
      setError(
        "❌ Failed to upload. " +
          (err.message || "Please check your network connection.")
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || !formData.description;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 border">
      <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center sm:text-left">
        Upload Announcement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Semester */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="sm:w-48 font-medium">Choose Semester:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100 w-full"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem, idx) => (
              <option key={idx} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <label className="sm:w-48 font-medium">Enter the Announcement:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event..."
            rows="4"
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100 w-full"
          ></textarea>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`
              bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-6 sm:px-8 py-2 rounded-md shadow
              ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Submitting..." : "Submit Now"}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Success */}
      {submitted && !error && submittedData && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
          🎉 Announcement submitted successfully!
          <br />
          Semester: {submittedData.semester || "N/A"}
          <br />
          Announcement: {submittedData.description}
        </div>
      )}
    </div>
  );
};

export default UploadNewsEvents;
