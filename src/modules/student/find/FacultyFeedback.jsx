// src/modules/student/find/FacultyFeedback.jsx
import React, { useEffect, useState, useMemo } from "react";

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
// --- End Helpers ---

// --- Hardcoded Data ---
const REGULATIONS = ["R22", "R20", "R18"];
const BRANCHES = ["CSE", "CSD", "CSM", "ECE", "EEE", "CIVIL", "MECH"];
const SEMESTERS = [
  "1-1", "1-2", "2-1", "2-2",
  "3-1", "3-2", "4-1", "4-2",
];
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
// --- End Hardcoded Data ---

/**
 * A reusable star rating component with hover effect
 */
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
  const [filters, setFilters] = useState({
    regulation: "",
    branch: "",
    semester: "",
  });
  
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState("");
  
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallRating, setOverallRating] = useState(0); 
  const [additionalComments, setAdditionalComments] = useState("");
  
  const [feedback, setFeedback] = useState(() => 
    FEEDBACK_QUESTIONS.map(q => ({
      question: q,
      option: ""
    }))
  );
  
  const token = getTokenFromLocalStorage();
  
  const allFiltersSelected = useMemo(() => {
    return filters.regulation && filters.branch && filters.semester;
  }, [filters]);

  // Reset function
  const resetForm = () => {
    setFeedback(FEEDBACK_QUESTIONS.map(q => ({
      question: q,
      option: ""
    })));
    setOverallRating(0); 
    setAdditionalComments("");
  };

  // Fetch subjects when all filters are set
  useEffect(() => {
    if (!allFiltersSelected) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }

    let cancelled = false;
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      setErrorSubjects("");
      setSubjects([]);
      setSelectedSubjectId("");
      resetForm();

      const { regulation, branch, semester } = filters;
      const query = `regulation=${regulation}&branch=${branch}&semester=${semester}`;
      
      try {
        const res = await fetch(`${API_BASE}/student/getSubjectsAndFaculty?${query}`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);
        
        const data = await res.json();
        
        let mapped = [];
        if (Array.isArray(data)) {
            mapped = data.map(s => ({
                subjectId: s.subjectId,
                subjectName: s.subjectName,
                facultyId: s.facultyId,
                facultyName: s.facultyName ?? "N/A"
            }));
        }
        
        if (!cancelled) {
          setSubjects(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorSubjects(`API Error: ${err.message}. Using mock data.`);
          // --- MOCK DATA FOR DEMONSTRATION ---
          const mockData = [
            { subjectId: 'CS411', subjectName: 'Database Management', facultyId: 'F101', facultyName: 'Dr. Priya Sharma' },
            { subjectId: 'CS412', subjectName: 'Operating Systems', facultyId: 'F102', facultyName: 'Prof. Rajesh Kumar' },
            { subjectId: 'AI413', subjectName: 'Machine Learning', facultyId: 'F103', facultyName: 'Dr. Anjali Singh' },
          ];
          setSubjects(mockData);
          // --- End Mock Data ---
        }
      } finally {
        if (!cancelled) {
          setLoadingSubjects(false);
        }
      }
    };

    fetchSubjects();
    return () => { cancelled = true; };
  }, [filters, allFiltersSelected, token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFeedbackChange = (index, value) => {
    setFeedback(prev => {
      const newFeedback = [...prev];
      newFeedback[index] = { ...newFeedback[index], option: value };
      return newFeedback;
    });
  };

  const handleSubjectChange = (e) => {
    setSelectedSubjectId(e.target.value);
    resetForm();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (!selectedSubjectId) {
      alert("Please select a subject.");
      setIsSubmitting(false);
      return;
    }

    if (overallRating === 0) {
      alert("Please provide an overall rating.");
      setIsSubmitting(false);
      return;
    }

    const selectedSubject = subjects.find(s => s.subjectId === selectedSubjectId);
    
    for (const item of feedback) {
      if (!item.option) {
        alert(`Please provide an option for: "${item.question}"`);
        setIsSubmitting(false);
        return;
      }
    }
    
    const submissionData = {
      filters,
      subject: selectedSubject,
      overallRating, 
      feedback,
      additionalComments,
    };

    // Simulate API call delay
    setTimeout(() => {
      alert("Feedback submitted (UI only)!\n\n" + JSON.stringify(submissionData, null, 2));
      
      // Reset after successful submission
      setSelectedSubjectId("");
      resetForm();
      setIsSubmitting(false);
    }, 500); 
  };

  return (
    // Removed wrapper div. This component is now the "card" itself.
    // This is better for placing inside a modal.
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
      
      <div className="text-center">
        {/* Responsive title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
          Subject Feedback
        </h2>
        <p className="text-base text-gray-600 mt-2 mb-4">
          Provide detailed feedback for a subject and its faculty.
        </p>
      </div>

      {/* --- 1. Filters (Already Responsive) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border rounded-lg bg-blue-50 border-blue-200">
        {[
          { name: 'regulation', label: 'Regulation', options: REGULATIONS },
          { name: 'branch', label: 'Branch', options: BRANCHES },
          { name: 'semester', label: 'Semester', options: SEMESTERS },
        ].map(filter => (
          <div key={filter.name}>
            <label className="font-semibold text-sm mb-1 block text-blue-900">
              {filter.label}:
            </label>
            <select
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleFilterChange}
              className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              {filter.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* --- 2. Subject Selection --- */}
      {allFiltersSelected && (
        <div className="mb-2">
          <label className="font-semibold w-full text-sm mb-1 block text-gray-700">
            Choose Subject & Faculty:
          </label>
          <div className="w-full">
            <select
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loadingSubjects}
            >
              <option value="">
                {loadingSubjects ? "Loading Subjects..." : (subjects.length > 0 ? "-- Select Subject --" : "-- No Subjects Found --")}
              </option>
              {subjects.map(s => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName} (Faculty: {s.facultyName})
                </option>
              ))}
            </select>
            {errorSubjects && <p className="text-xs text-red-600 mt-1">{errorSubjects}</p>}
          </div>
        </div>
      )}
      
      {/* --- 3. Feedback Form --- */}
      {selectedSubjectId && (
        <div className="flex flex-col gap-6 mt-4 border-t border-gray-200 pt-6">
          {feedback.map((item, index) => (
            <div key={index} className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <label className="font-semibold w-full text-base mb-4 block text-gray-800">
                {item.question}
              </label>
              
              {/* "Pill" Radio Options (Already Responsive) */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                {FEEDBACK_OPTIONS.map(option => {
                  const radioId = `q_${index}_option_${option}`;
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
                        className="block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all
                                peer-checked:border-yellow-600 peer-checked:bg-yellow-600 peer-checked:text-white
                                hover:bg-gray-50 peer-checked:hover:bg-blue-700"
                      >
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* --- Overall Rating --- */}
          <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 mt-4">
            <label className="font-semibold w-full text-base mb-3 block text-gray-800">
              Overall Rating for this Subject & Faculty:
            </label>
            <div className="flex justify-center sm:justify-start">
              <StarRating 
                rating={overallRating}
                onRatingChange={setOverallRating}
              />
            </div>
          </div>

          {/* --- Additional Comments (Optional) --- */}
          <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 mt-4">
            <label htmlFor="additionalComments" className="font-semibold w-full text-base mb-3 block text-gray-800">
              Additional Comments (Optional):
            </label>
            <textarea
              id="additionalComments"
              rows="4"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Share any other thoughts, suggestions, or specific examples..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button (Already Responsive) */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-lg bg-yellow-600 px-10 py-3 text-base font-semibold text-white shadow-md transition-all 
                            hover:bg-blue-700 
                            focus:outline-none focus:ring-4 focus:ring-yellow-400 
                            disabled:bg-gray-400 disabled:cursor-not-allowed"
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