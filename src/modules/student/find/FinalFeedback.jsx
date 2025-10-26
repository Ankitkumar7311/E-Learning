
import React, { useState } from "react";

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

// --- Questions & Options ---
const FEEDBACK_QUESTIONS = [
  // Section 1: Academics
  "1. Quality of curriculum and its relevance to industry trends.",
  "2. Overall quality of teaching and faculty expertise.",
  "3. How updated was the syllabus with new technologies/concepts?",
  "4. Faculty's willingness to provide mentorship and support outside class.",
  "5. Fairness and transparency in the examination and grading system.",

  // Section 2: Infrastructure & Resources
  "6. Availability and quality of lab, library, and workshop facilities.",
  "7. Quality of campus infrastructure (classrooms, canteens, common areas).",
  "8. Reliability and speed of campus Wi-Fi and IT support.",
  "9. Quality and hygiene of hostel facilities (if applicable).",
  "10. Quality and variety of food in the campus canteen/mess.",

  // Section 3: Placements & Career Development
  "11. Effectiveness of the Training & Placement (T&P) cell.",
  "12. Quality of career counseling and guidance provided.",
  "13. Usefulness of workshops, guest lectures, and seminars conducted.",
  "14. Support for internships and industry projects.",
  "15. Strength and usefulness of the college's alumni network.",

  // Section 4: Student Life & Support
  "16. Support for sports and extracurricular activities (e.g., clubs, fests).",
  "17. Efficiency and helpfulness of the college administration and staff.",
  "18. Effectiveness of the grievance redressal / complaint system.",
  "19. Focus on student well-being and mental health support.",
  "20. How well did the college contribute to your personal and professional growth?",
  "21. Overall campus safety and security.",
  "22. Would you recommend this college to a friend or family member?",
];

const FEEDBACK_OPTIONS = ["Excellent", "Good", "Average", "Fair", "Poor"];

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

const FinalFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [additionalComments, setAdditionalComments] = useState("");

  const [feedback, setFeedback] = useState(
    FEEDBACK_QUESTIONS.map((q) => ({ question: q, option: "" }))
  );

  const token = getTokenFromLocalStorage();
  const studentId = getStoredStudentId();

  const resetForm = () => {
    setFeedback(FEEDBACK_QUESTIONS.map((q) => ({ question: q, option: "" })));
    setOverallRating(0);
    setAdditionalComments("");
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

    if (overallRating === 0) {
      alert("Please provide an overall college rating.");
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
      overallRating,
      feedback,
      additionalComments,
    };

    console.log("🔵 DEBUG: Submitting exit survey:", submissionData);

    try {
      const response = await fetch(`${API_BASE}/student/exit-survey`, {
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
        alert("✅ Exit survey submitted successfully! Thank you for your feedback.");
        resetForm();
      } else {
        alert(`⚠️ ${result.message || "Failed to submit survey"}`);
      }
    } catch (err) {
      console.error("❌ DEBUG: Error submitting survey:", err);
      alert("❌ Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">College Graduation Feedback</h2>
        </div>

        <div className="flex flex-col gap-6 mt-4 border-t border-gray-200 pt-6">
          {feedback.map((item, index) => (
            <div key={index} className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <label className="font-semibold w-full text-base mb-4 block text-gray-800">
                {item.question}
              </label>

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
                        className="block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-blue-700"
                      >
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 mt-4">
            <label className="font-semibold w-full text-base mb-3 block text-gray-800">
              Overall College Rating
            </label>
            <div className="flex justify-center sm:justify-start">
              <StarRating rating={overallRating} onRatingChange={setOverallRating} />
            </div>
          </div>

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
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="What did you like most? What can be improved?"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-10 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Final Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalFeedback;
