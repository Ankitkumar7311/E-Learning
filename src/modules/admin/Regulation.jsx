import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegulationForm = () => {
  const navigate = useNavigate();

  // helper lists (you can change / fetch these later)
  const regulations = ["R15", "R17", "R19", "R21", "R2025", "R2027"];
  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const emptySubject = () => ({
    subjectCode: "",
    name: "",
    semester: "",
    // regulationId and branchType will be injected at submit time from top-level fields
  });

  const [formData, setFormData] = useState({
    regulationName: "", // example: "Regulation 2027"
    regulationId: "", // example: "R2027"
    branch: "", // used as default branchType for subjects (can be overridden per-subject)
    subjects: [emptySubject()],
  });

  // top-level changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // per-subject change
  const handleSubjectChange = (index, field, value) => {
    setFormData((prev) => {
      const newSubjects = prev.subjects.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, subjects: newSubjects };
    });
  };

  const addSubject = () =>
    setFormData((prev) => ({ ...prev, subjects: [...prev.subjects, emptySubject()] }));

  const removeSubject = (index) =>
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));

  // submit - construct payload exactly as backend expects
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation:
    if (!formData.regulationName.trim() || !formData.regulationId.trim()) {
      alert("Please enter Regulation Name and Regulation ID.");
      return;
    }
    if (!formData.subjects.length) {
      alert("Add at least one subject.");
      return;
    }
    const subjectsValid = formData.subjects.every(
      (s) => s.name?.trim() && s.subjectCode?.trim() && s.semester !== ""
    );
    if (!subjectsValid) {
      alert("Please fill subject name, subject code and semester for all subjects.");
      return;
    }

    // Build payload matching NewRegulationDto JSON shape:
    const payload = {
      name: formData.regulationName,
      regulationId: formData.regulationId,
      // newSubjects: array of subjects - backend expects fields like subjectCode, name, semester, regulationId, branchType
      newSubjects: formData.subjects.map((s) => ({
        subjectCode: s.subjectCode,
        name: s.name,
        semester: Number(s.semester),
        regulationId: formData.regulationId,
        branchType: s.branchType || formData.branch || "", // prefer per-subject, fallback to top-level branch
      })),
    };

    console.log("Sending payload to /addNewRegulation:", payload);

    try {
      const res = await fetch("http://localhost:8080/VidyaSarthi/addNewRegulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (res.status === 409) {
        alert("Duplicate entry: This regulation already exists.");
      } else if (res.ok) {
        alert(text || "Regulation added successfully!");
        navigate("/Student-login");
      } else {
        // show backend message if any
        alert(text || `Error: ${res.status}`);
      }
    } catch (err) {
      console.error("Network / server error:", err);
      alert("Server error. Check backend or CORS. See console for details.");
    }
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-2">Add Regulation (New)</h2>
        <p className="text-sm text-gray-600">I'll assemble the payload your backend wants. 🎯</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium mb-2">Regulation Name</label>
            <input
              name="regulationName"
              value={formData.regulationName}
              onChange={handleChange}
              placeholder="e.g. Regulation 2027"
              className="p-2 rounded-md bg-blue-50"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2">Regulation ID</label>
            {/* datalist helps pick an existing regulation or type new */}
            <input
              name="regulationId"
              list="reg-list"
              value={formData.regulationId}
              onChange={handleChange}
              placeholder="e.g. R2027"
              className="p-2 rounded-md bg-blue-50"
            />
            <datalist id="reg-list">
              {regulations.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2">Default Branch (optional)</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="p-2 rounded-md bg-blue-50"
            >
              <option value="">Choose branch (used as branchType for subjects)</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, subjects: [emptySubject()] }));
              }}
              className="ml-auto bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Reset Subjects
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Subjects (Priority wise) — add one or more
          </label>

          <div className="flex flex-col gap-3">
            {formData.subjects.map((sub, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded flex flex-col sm:flex-row gap-3 items-start">
                <div className="text-sm font-semibold w-6">{i + 1}.</div>

                <input
                  placeholder="Subject Name"
                  value={sub.name}
                  onChange={(e) => handleSubjectChange(i, "name", e.target.value)}
                  className="p-2 rounded-md bg-blue-50 sm:flex-1"
                />

                <input
                  placeholder="Subject Code"
                  value={sub.subjectCode}
                  onChange={(e) => handleSubjectChange(i, "subjectCode", e.target.value)}
                  className="p-2 rounded-md bg-blue-50 sm:w-56"
                />

                <select
                  value={sub.semester}
                  onChange={(e) => handleSubjectChange(i, "semester", e.target.value)}
                  className="p-2 rounded-md bg-blue-50 sm:w-40"
                >
                  <option value="">Semester</option>
                  {semesters.map((s) => (
                    <option value={s} key={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  value={sub.branchType || formData.branch}
                  onChange={(e) => handleSubjectChange(i, "branchType", e.target.value)}
                  className="p-2 rounded-md bg-blue-50 sm:w-40"
                >
                  <option value="">Branch (branchType)</option>
                  {branches.map((b) => (
                    <option value={b} key={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeSubject(i)}
                    disabled={formData.subjects.length === 1}
                    className="px-3 py-1 rounded bg-red-400 text-white disabled:opacity-40"
                  >
                    Remove
                  </button>

                  <button
                    type="button"
                    onClick={addSubject}
                    className="px-3 py-1 rounded bg-green-500 text-white"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
          >
            Submit Regulation
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegulationForm;
