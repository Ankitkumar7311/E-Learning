

import React, { useEffect, useState, useMemo, useCallback } from "react";

// --- API and LocalStorage Helpers ---
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

const getTokenFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem('token') || null;
  } catch (e) {
    console.error('Error reading token from localStorage', e);
    return null;
  }
};

const getStoredStudentId = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const p = JSON.parse(vs || "{}");
      if (p?.studentId) return p.studentId;
      if (p?.user?.studentId) return p.user.studentId;
    }
    const u = localStorage.getItem("user");
    if (u) {
      const p = JSON.parse(u || "{}");
      return p?.studentId || p?.userId || null;
    }
    return null;
  } catch (e) {
    console.warn("getStoredStudentId:", e);
    return null;
  }
};

// --- Hardcoded Data ---
const BRANCHES = ["CSE", "CSD", "CSM", "ECE", "EEE", "CIVIL", "MECH"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const FEEDBACK_QUESTIONS = [
  "1. Punctuality and regularity in attending classes.",
  "2. Preparation and organization for the class.",
  "3. Command over the subject and depth of knowledge.",
  "4. Clarity in explaining concepts and use of examples.",
  "5. Ability to link topics and provide a clear overview.",
  "6. Pace of teaching (Too fast / Just right / Too slow).",
  "7. Use of teaching aids (e.g., presentations, board, videos).",
  "8. Ability to engage students and maintain interest.",
  "9. Encourages questions, interaction, and discussion.",
  "10. Completion and coverage of the syllabus on time.",
  "11. Fairness and transparency in internal evaluation.",
  "12. Quality of assignments/tutorials given.",
  "13. Handling of student queries and doubts.",
  "14. Availability and accessibility to students outside class hours.",
  "15. Overall attitude and professionalism towards students.",
];

const FEEDBACK_OPTIONS = ["Good", "Average", "Not Good"];

// --- Star Rating Component ---
const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-3xl transition-colors duration-150 ${
            star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const FacultyFeedback = () => {
  // --- State for Regulations ---
  const [regulations, setRegulations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [errorRegs, setErrorRegs] = useState("");

  // --- State for Filters ---
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // --- State for Subjects ---
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState("");

  // --- State for Selected Subject ---
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State for Feedback Form ---
  const [overallRating, setOverallRating] = useState(0);
  const [additionalComments, setAdditionalComments] = useState("");
  const [feedback, setFeedback] = useState(
    FEEDBACK_QUESTIONS.map((q) => ({ question: q, option: "" }))
  );

  const token = getTokenFromLocalStorage();
  const studentId = getStoredStudentId();

  // Check if all filters are selected
  const allFiltersSelected = useMemo(() => {
    return selectedRegulation && selectedBranch && selectedSemester;
  }, [selectedRegulation, selectedBranch, selectedSemester]);

  // --- 1. Load Regulations on Mount ---
  useEffect(() => {
    let cancelled = false;
    
    const fetchRegs = async () => {
      setLoadingRegs(true);
      setErrorRegs("");
      
      try {
        const res = await fetch(`${API_BASE}/student/getRegulationList`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (!res.ok) throw new Error(`Failed to load regulations (${res.status})`);
        
        const data = await res.json();
        console.log("🔵 DEBUG: Regulations received:", data);
        
        let mapped = [];
        
        if (Array.isArray(data)) {
          mapped = data.map(r => ({
            regulationId: r.regulationId ?? r.id ?? String(r),
            display: r.name ?? r.display ?? String(r),
            raw: r
          }));
        } else if (data && data.regulations) {
          mapped = Object.values(data.regulations).map((r, idx) => ({
            regulationId: r.regulationId ?? r.id ?? String(idx),
            display: r.name ?? r.display ?? String(r),
            raw: r
          }));
        } else {
          mapped = Object.keys(data || {}).map(k => ({ 
            regulationId: k, 
            display: String(data[k]) 
          }));
        }
        
        if (!cancelled) {
          setRegulations(mapped);
          console.log("✅ DEBUG: Regulations mapped:", mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorRegs(err.message || "Network error while loading regulations");
          console.error("❌ DEBUG: Error fetching regulations:", err);
        }
      } finally {
        if (!cancelled) setLoadingRegs(false);
      }
    };

    fetchRegs();
    return () => { cancelled = true; };
  }, [token]);

  // --- 2. Fetch Subjects with Faculty when all filters are selected ---
  useEffect(() => {
    if (!allFiltersSelected) {
      setSubjects([]);
      setSelectedSubjectCode("");
      return;
    }

    let cancelled = false;

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      setErrorSubjects("");
      setSubjects([]);
      setSelectedSubjectCode("");

      try {
        const dto = {
          regulationId: selectedRegulation.regulationId ?? selectedRegulation,
          branch: selectedBranch,
          semester: Number(selectedSemester)
        };

        console.log("🔵 DEBUG: Fetching subjects with faculty:", dto);

        const res = await fetch(`${API_BASE}/student/getSubjectsWithFaculty`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(dto)
        });

        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);

        const result = await res.json();
        console.log("🔵 DEBUG: Subjects with faculty response:", result);

        let mappedSubjects = [];

        if (Array.isArray(result)) {
          mappedSubjects = result.map(s => ({
            subjectCode: s.subjectCode,
            subjectName: s.subjectName,
            facultyId: s.facultyId,
            facultyIdString: s.facultyIdString,
            facultyName: s.facultyName || "N/A",
            facultyEmail: s.facultyEmail,
            facultyDesignation: s.facultyDesignation
          }));
        }

        if (!cancelled) {
          setSubjects(mappedSubjects);
          console.log("✅ DEBUG: Subjects mapped:", mappedSubjects);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorSubjects(err.message || "Network error fetching subjects");
          console.error("❌ DEBUG: Error fetching subjects:", err);
          
          // MOCK DATA FOR DEMONSTRATION
          const mockData = [
            {
              subjectCode: "CS411",
              subjectName: "Database Management",
              facultyId: 101,
              facultyName: "Dr. Priya Sharma",
            },
            {
              subjectCode: "CS412",
              subjectName: "Operating Systems",
              facultyId: 102,
              facultyName: "Prof. Rajesh Kumar",
            },
            {
              subjectCode: "AI413",
              subjectName: "Machine Learning",
              facultyId: 103,
              facultyName: "Dr. Anjali Singh",
            },
          ];
          setSubjects(mockData);
        }
      } finally {
        if (!cancelled) setLoadingSubjects(false);
      }
    };

    fetchSubjects();
    return () => { cancelled = true; };
  }, [selectedRegulation, selectedBranch, selectedSemester, allFiltersSelected, token]);

  // --- Reset function ---
  const resetForm = () => {
    setFeedback(FEEDBACK_QUESTIONS.map((q) => ({ question: q, option: "" })));
    setOverallRating(0);
    setAdditionalComments("");
  };

  // --- Handlers ---
  const handleRegChange = useCallback((e) => {
    const id = e.target.value;
    const sel = regulations.find(r => String(r.regulationId) === String(id)) || null;
    console.log("🔵 DEBUG: Regulation selected:", sel);
    setSelectedRegulation(sel);
    setSelectedBranch("");
    setSelectedSemester("");
    setSelectedSubjectCode("");
    setSubjects([]);
  }, [regulations]);

  const handleBranchChange = useCallback((e) => {
    console.log("🔵 DEBUG: Branch selected:", e.target.value);
    setSelectedBranch(e.target.value);
    setSelectedSemester("");
    setSelectedSubjectCode("");
    setSubjects([]);
  }, []);

  const handleSemesterChange = useCallback((e) => {
    console.log("🔵 DEBUG: Semester selected:", e.target.value);
    setSelectedSemester(e.target.value);
    setSelectedSubjectCode("");
    setSubjects([]);
  }, []);

  const handleSubjectChange = (e) => {
    console.log("🔵 DEBUG: Subject selected:", e.target.value);
    setSelectedSubjectCode(e.target.value);
    resetForm();
  };

  const handleFeedbackChange = (index, value) => {
    setFeedback((prev) => {
      const newFeedback = [...prev];
      newFeedback[index] = { ...newFeedback[index], option: value };
      return newFeedback;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!studentId) {
      alert("❌ Student ID not found. Please login again.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedSubjectCode) {
      alert("Please select a subject.");
      setIsSubmitting(false);
      return;
    }

    if (overallRating === 0) {
      alert("Please provide an overall rating.");
      setIsSubmitting(false);
      return;
    }

    const selectedSubject = subjects.find((s) => s.subjectCode === selectedSubjectCode);

    if (!selectedSubject) {
      alert("Selected subject not found.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedSubject.facultyId) {
      alert("No faculty assigned to this subject. Cannot submit feedback.");
      setIsSubmitting(false);
      return;
    }

    for (const item of feedback) {
      if (!item.option) {
        alert(`Please provide an option for: "${item.question}"`);
        setIsSubmitting(false);
        return;
      }
    }

    const submissionData = {
      studentId: String(studentId),
      courseId: selectedSubjectCode,
      facultyId: selectedSubject.facultyId,
      regulation: selectedRegulation.regulationId ?? selectedRegulation.display,
      branch: selectedBranch,
      semester: String(selectedSemester),
      overallRating,
      feedback,
      additionalComments,
    };

    console.log("🔵 DEBUG: Submitting feedback:", submissionData);

    try {
      const response = await fetch(`${API_BASE}/student/feedback/teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      console.log("🔵 DEBUG: Backend response:", result);

      if (result.success) {
        alert("✅ Feedback submitted successfully!");
        setSelectedSubjectCode("");
        resetForm();
      } else {
        alert(`⚠️ ${result.message || "Failed to submit feedback"}`);
      }
    } catch (err) {
      console.error("❌ DEBUG: Error submitting feedback:", err);
      alert("❌ Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">Subject Feedback</h2>
        <p className="text-base text-gray-600 mt-2 mb-4">
          Provide detailed feedback for a subject and its faculty.
        </p>
      </div>

      {/* 1. Regulation Selection */}
      <div className="mb-4">
        <label className="font-semibold text-sm mb-1 block text-blue-900">
          Choose Regulation
        </label>
        <select
          value={selectedRegulation?.regulationId || ""}
          onChange={handleRegChange}
          className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">
            {loadingRegs ? "Loading Regulations..." : "-- Select Regulation --"}
          </option>
          {regulations.map(r => (
            <option key={r.regulationId} value={r.regulationId}>
              {r.display}
            </option>
          ))}
        </select>
        {errorRegs && <p className="text-xs text-red-600 mt-1">{errorRegs}</p>}
      </div>

      {/* 2. Branch & Semester Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-sm mb-1 block text-blue-900">
            Branch
          </label>
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={!selectedRegulation}
          >
            <option value="">
              {selectedRegulation ? "-- Select Branch --" : "Select regulation first"}
            </option>
            {BRANCHES.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-sm mb-1 block text-blue-900">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={handleSemesterChange}
            className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={!selectedRegulation || !selectedBranch}
          >
            <option value="">
              {selectedRegulation && selectedBranch ? "-- Select Semester --" : "Select branch first"}
            </option>
            {SEMESTERS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Subject Selection */}
      {allFiltersSelected && (
        <div className="mb-2">
          <label className="font-semibold w-full text-sm mb-1 block text-gray-700">
            Choose Subject & Faculty
          </label>
          <div className="w-full">
            <select
              value={selectedSubjectCode}
              onChange={handleSubjectChange}
              className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loadingSubjects}
            >
              <option value="">
                {loadingSubjects
                  ? "Loading Subjects..."
                  : subjects.length === 0
                  ? "-- No Subjects Found --"
                  : "-- Select Subject --"}
              </option>
              {subjects.map((s) => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectName} - Faculty: {s.facultyName}
                </option>
              ))}
            </select>
            {errorSubjects && <p className="text-xs text-red-600 mt-1">{errorSubjects}</p>}
          </div>
        </div>
      )}

      {/* 4. Feedback Form */}
      {selectedSubjectCode && (
        <div className="flex flex-col gap-6 mt-4 border-t border-gray-200 pt-6">
          {feedback.map((item, index) => (
            <div key={index} className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <label className="font-semibold w-full text-base mb-4 block text-gray-800">
                {item.question}
              </label>

              {/* Pill Radio Options */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                {FEEDBACK_OPTIONS.map((option) => {
                  const radioId = `q${index}_${option.replace(/\s/g, "")}`;
                  return (
                    <div key={option}>
                      <input
                        type="radio"
                        id={radioId}
                        name={`question_${index}_option`}
                        value={option}
                        checked={item.option === option}
                        onChange={(e) => handleFeedbackChange(index, e.target.value)}
                        className="peer appearance-none"
                      />
                      <label
                        htmlFor={radioId}
                        className="block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all peer-checked:border-yellow-600 peer-checked:bg-yellow-600 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-blue-700"
                      >
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Overall Rating */}
          <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 mt-4">
            <label className="font-semibold w-full text-base mb-3 block text-gray-800">
              Overall Rating for this Subject & Faculty
            </label>
            <div className="flex justify-center sm:justify-start">
              <StarRating rating={overallRating} onRatingChange={setOverallRating} />
            </div>
          </div>

          {/* Additional Comments */}
          <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 mt-4">
            <label
              htmlFor="additionalComments"
              className="font-semibold w-full text-base mb-3 block text-gray-800"
            >
              Additional Comments (Optional)
            </label>
            <textarea
              id="additionalComments"
              rows="4"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Share any other thoughts, suggestions, or specific examples..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-lg bg-yellow-600 px-10 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyFeedback;
