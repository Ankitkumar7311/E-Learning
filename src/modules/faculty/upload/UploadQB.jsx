import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

// --- PLACEHOLDER FUNCTION ---
// In a real application, this function would upload the file to a cloud storage
// service (like AWS S3, Firebase Storage, etc.) and return the public URL.
// You MUST replace this with your actual file upload implementation.
const uploadFileAndGetURL = async (file) => {
  console.log(`Simulating upload for ${file.name}...`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return a fake URL for demonstration purposes.
  const fakeUrl = `https://your-storage-service.com/QB/${Date.now()}_${file.name}`;
  console.log(`File ${file.name} uploaded to ${fakeUrl}`);
  return fakeUrl;
};

const UploadQB = () => {
  const semesters = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  // Using arrays of objects for subjects and concepts to hold both name and code/ID
  const subjects = [
    { code: "MTH102", name: "Maths" },
    { code: "PHY101", name: "Physics" },
    { code: "CHM101", name: "Chemistry" },
    { code: "ENG101", name: "English" },
    { code: "CSE201", name: "Computer Science" },
  ];

  const concepts = [
    { id: "DS", name: "Data Structures" },
    { id: "ALGO", name: "Algorithms" },
    { id: "OS", name: "Operating Systems" },
    { id: "NET", name: "Networks" },
  ];

  const [formData, setFormData] = useState({
    semester: "",
    subjects: Array(4).fill(""),
    concepts: Array(concepts.length).fill(""),
    filesForConcepts: Array(concepts.length).fill(null),
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubjectChange = (index, value) => {
    const updated = [...formData.subjects];
    updated[index] = value;
    setFormData({ ...formData, subjects: updated });
  };

  const handleConceptChange = (index, value) => {
    const updated = [...formData.concepts];
    updated[index] = value;
    setFormData({ ...formData, concepts: updated });
  };

  const handleConceptFileChange = (index, file) => {
    const updated = [...formData.filesForConcepts];
    updated[index] = file;
    setFormData({ ...formData, filesForConcepts: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.semester) {
      alert("Please select a semester!");
      return;
    }
    const primarySubjectCode = formData.subjects.find((sub) => sub);
    if (!primarySubjectCode) {
      alert("Select at least one subject!");
      return;
    }
    if (formData.filesForConcepts.every((file) => !file)) {
      alert("Upload at least one file for a unit!");
      return;
    }

    setIsSubmitting(true);
    setSubmitted(false);

    // In a real app, get this from user context, auth state, or local storage.
    const facultyId = "F2016ECE002";

    // Create a list of API call promises for each file to be uploaded.
    const uploadPromises = formData.filesForConcepts
      .map(async (file, index) => {
        // We only proceed if a file and a corresponding concept title exist for this row.
        if (file && formData.concepts[index]) {
          try {
            // Step 1: Upload the file and get its URL.
            // Replace `uploadFileAndGetURL` with your actual file upload logic.
            const fileUrl = await uploadFileAndGetURL(file);

            // Step 2: Prepare the JSON payload for the backend API.
            const payload = {
              subjectCode: primarySubjectCode, // We use the first selected subject for all uploads.
              url: fileUrl,
              facultyId: facultyId,
              title: formData.concepts[index], // Use the concept name as the title
            };

            // Step 3: Make the API call.
            const response = await fetch(
              "http://localhost:8080/VidyaSarthi/faculty/uploadQB",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }
            );

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(
                `API request failed for ${file.name}: ${errorData}`
              );
            }
            
            console.log(`Successfully posted data for ${payload.title}`);
            return await response.json();
          } catch (error) {
            // Log the error and re-throw it to be caught by Promise.all
            console.error(`Failed to process file ${file.name}:`, error);
            throw error;
          }
        }
        return null;
      })
      .filter(Boolean); // Filter out null entries where no file was selected.

    try {
      // Wait for all the API calls to complete.
      await Promise.all(uploadPromises);
      
      console.log("All files submitted successfully! ✅");
      setSubmitted(true);

      // Optional: Reset form on complete success
      setFormData({
        semester: "",
        subjects: Array(4).fill(""),
        concepts: Array(concepts.length).fill(""),
        filesForConcepts: Array(concepts.length).fill(null),
      });
    } catch (error) {
      alert(
        "An error occurred during submission. One or more files could not be uploaded. Please check the console."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[100%] max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
      <h2 className="text-lg font-semibold mb-6">Complete your Upload:</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Semester */}
        <div className="flex items-center">
          <label className="w-48 font-medium">Choose Semester:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="flex-1 p-3 rounded-lg bg-blue-100"
            disabled={isSubmitting}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem, idx) => (
              <option key={idx} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects */}
        <div className="flex items-center">
          <label className="w-48 font-medium">
            Choose Subjects: <span className="text-gray-500 text-xs">(Priority)</span>
          </label>
          <div className="flex gap-3 flex-1">
            {Array(4).fill(0).map((_, index) => (
                <select
                  key={index}
                  value={formData.subjects[index]}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-gray-300 bg-blue-100"
                  disabled={isSubmitting}
                >
                  <option value="">{index + 1}. Choose</option>
                  {subjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ))}
          </div>
        </div>

        {/* Concepts */}
        <div>
          <label className="w-48 font-medium block mb-2">Choose Units:</label>
          <div className="flex flex-col gap-4 flex-1">
            {concepts.map((c, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border p-3 rounded-lg shadow-sm"
              >
                <select
                  value={formData.concepts[index]}
                  onChange={(e) => handleConceptChange(index, e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-gray-300 bg-blue-100"
                  disabled={isSubmitting}
                >
                  <option value="">{index + 1}. Choose Unit</option>
                  {concepts.map((concept) => (
                    <option key={concept.id} value={concept.name}>
                        {concept.name}
                    </option>
                  ))}
                </select>

                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg shadow ${isSubmitting ? 'bg-gray-300' : 'bg-yellow-200 hover:bg-yellow-300'}`}>
                  <FaUpload className="text-gray-700" />
                  <span className="text-sm">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleConceptFileChange(index, e.target.files[0] || null)
                    }
                    disabled={isSubmitting}
                  />
                </label>

                {formData.filesForConcepts[index] && (
                  <span className="text-xs text-green-600 truncate max-w-[150px]">
                    {formData.filesForConcepts[index].name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-8 py-2 rounded-md shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Now"}
          </button>
        </div>
      </form>

      {/* Success Message */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
          🎉 Form submitted successfully!
        </div>
      )}
    </div>
  );
};

export default UploadQB;