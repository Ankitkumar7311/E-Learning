// src/components/.../UploadNewsEvents.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext"; // keep the same relative path you used
import { useApiClient } from "../../../context/AuthorizedFetch"; // keep same relative path

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

const UploadNewsEvents = () => {
  const auth = useAuth();
  const apiClient = useApiClient();

  const [formData, setFormData] = useState({ semester: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ensure facultyId is present in auth; if not, fetch and update auth context
  useEffect(() => {
    const fetchFacultyIdIfNeeded = async () => {
      const email = auth?.user?.email;
      if (email && !auth?.facultyId) {
        try {
          const res = await apiClient("/getFacultyId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (!res.ok) {
            console.warn("getFacultyId returned non-OK", res.status, await res.text().catch(() => ""));
            return;
          }

          const dto = await res.json();
          const newFacultyId = dto?.facultyId || dto?.facultyID || dto?.facultyid;

          if (newFacultyId) {
            // Call auth.login with a clean object (do NOT spread the whole auth object)
            if (typeof auth.login === "function") {
              auth.login({
                user: auth.user,
                token: auth.token,
                role: auth.role,
                facultyId: newFacultyId,
              });
              console.log("Updated facultyId in auth context:", newFacultyId);
            }
          }
        } catch (err) {
          console.error("Error fetching facultyId:", err);
          setError("Could not retrieve your Faculty ID. Please log in again.");
        }
      }
    };

    fetchFacultyIdIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.email]); // run when email becomes available

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    const facultyId = auth?.facultyId;
    if (!facultyId) {
      setError("❌ Faculty ID is missing. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient("/faculty/uploadNews&Announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization header will be injected automatically by apiClient
        },
        body: JSON.stringify({
          type: "Announcement",
          describeEvents: formData.description,
          facultyId: facultyId,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Server returned ${response.status}`);
      }

      setSubmittedData({
        semester: formData.semester,
        description: formData.description,
      });

      setSubmitted(true);
      setFormData({ semester: "", description: "" });
    } catch (err) {
      console.error("API Error:", err);
      setError("❌ Failed to upload. " + (err.message || "Please check your network."));
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || !formData.description;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 border">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center sm:text-left">
        Upload Announcement
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center sm:text-left">
        Posting as: <strong>{auth?.facultyId || "Loading ID..."}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <label className="sm:w-48 font-medium">Enter the Announcement:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the announcement..."
            rows="4"
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100 w-full"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-6 sm:px-8 py-2 rounded-md shadow ${
              isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Now"}
          </button>
        </div>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

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
