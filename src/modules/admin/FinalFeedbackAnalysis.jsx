import React, { useEffect, useState, useMemo } from "react";
// --- IMPORT NEW CHART TYPE ---
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  // --- ADDED FOR RADAR CHART ---
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// --- Register ALL Chart.js components ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  // --- ADDED FOR RADAR CHART ---
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

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

/**
 * A reusable star rating component (Read-only version)
 */
const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex gap-1 text-3xl text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
      {halfStar && <span>☆</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
    </div>
  );
};

// --- Category definitions for Radar Chart ---
const CATEGORY_MAP = {
  'Academics': [0, 1, 2, 3, 4], // Questions 1-5
  'Infrastructure': [5, 6, 7, 8, 9], // Questions 6-10
  'Placements': [10, 11, 12, 13, 14], // Questions 11-15
  'Student Life & Support': [15, 16, 17, 18, 19, 20, 21] // Questions 16-22
};
const CATEGORIES = ['Academics', 'Infrastructure', 'Placements', 'Student Life & Support'];
// Assign weights to options
const OPTION_WEIGHTS = { 'Excellent': 5, 'Good': 4, 'Average': 3, 'Fair': 2, 'Poor': 1 };


const FinalFeedbackAnalysis = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  
  const token = getTokenFromLocalStorage();

  // 1. Fetch aggregated final feedback on mount
  useEffect(() => {
    const fetchFinalFeedback = async () => {
      setLoadingData(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/admin/getFinalFeedbackAnalysis`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
           throw new Error(`Failed to fetch final feedback`);
        }
        const data = await res.json();
        setFeedbackData(data);
      } catch (err) {
        setError(err.message + " (Showing mock data instead)");
        setFeedbackData(getMockFinalFeedbackData());
      } finally {
        setLoadingData(false);
      }
    };
    fetchFinalFeedback();
  }, [token]);

  // 2. Transform data for the BAR chart
  const barChartData = useMemo(() => {
    if (!feedbackData?.questionBreakdown) return null;
    const labels = feedbackData.questionBreakdown.map(q => {
        const shortQ = q.question.substring(q.question.indexOf('.') + 1).trim();
        return shortQ.length > 35 ? shortQ.substring(0, 35) + '...' : shortQ;
    });
    return {
      labels,
      datasets: [
        { label: 'Excellent', data: feedbackData.questionBreakdown.map(q => q.excellent), backgroundColor: 'rgba(75, 192, 192, 0.7)' },
        { label: 'Good', data: feedbackData.questionBreakdown.map(q => q.good), backgroundColor: 'rgba(54, 162, 235, 0.7)' },
        { label: 'Average', data: feedbackData.questionBreakdown.map(q => q.average), backgroundColor: 'rgba(255, 206, 86, 0.7)' },
        { label: 'Fair', data: feedbackData.questionBreakdown.map(q => q.fair), backgroundColor: 'rgba(255, 159, 64, 0.7)' },
        { label: 'Poor', data: feedbackData.questionBreakdown.map(q => q.poor), backgroundColor: 'rgba(255, 99, 132, 0.7)' },
      ],
    };
  }, [feedbackData]);

  // --- 3. NEW: Transform data for the RADAR chart ---
  const radarChartData = useMemo(() => {
    if (!feedbackData?.questionBreakdown) return null;

    const categoryScores = {
      'Academics': { totalScore: 0, count: 0 },
      'Infrastructure': { totalScore: 0, count: 0 },
      'Placements': { totalScore: 0, count: 0 },
      'Student Life & Support': { totalScore: 0, count: 0 },
    };

    // Calculate total weighted score for each question
    feedbackData.questionBreakdown.forEach((question, index) => {
      let qTotalScore = 0;
      let qTotalResponses = 0;
      
      qTotalScore += (question.excellent || 0) * OPTION_WEIGHTS.Excellent;
      qTotalScore += (question.good || 0) * OPTION_WEIGHTS.Good;
      qTotalScore += (question.average || 0) * OPTION_WEIGHTS.Average;
      qTotalScore += (question.fair || 0) * OPTION_WEIGHTS.Fair;
      qTotalScore += (question.poor || 0) * OPTION_WEIGHTS.Poor;

      qTotalResponses = (question.excellent || 0) + (question.good || 0) + (question.average || 0) + (question.fair || 0) + (question.poor || 0);

      const qAverage = qTotalResponses > 0 ? (qTotalScore / qTotalResponses) : 0;

      // Find which category this question belongs to
      for (const category of CATEGORIES) {
        if (CATEGORY_MAP[category].includes(index)) {
          categoryScores[category].totalScore += qAverage;
          categoryScores[category].count += 1;
          break;
        }
      }
    });

    // Calculate the average for each category
    const data = CATEGORIES.map(category => {
      const { totalScore, count } = categoryScores[category];
      return count > 0 ? (totalScore / count).toFixed(2) : 0;
    });

    return {
      labels: CATEGORIES,
      datasets: [
        {
          label: 'Average Score (out of 5)',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
        },
      ],
    };
  }, [feedbackData]);

  // 4. Configure chart options
  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Detailed Feedback Breakdown per Question' },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return feedbackData.questionBreakdown[index].question;
          }
        }
      }
    },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  // --- 5. NEW: Configure RADAR chart options ---
  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Overall Category Performance' }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        pointLabels: {
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#4B5563',
          stepSize: 1, // Show lines for 1, 2, 3, 4, 5
        },
        min: 0,
        max: 5, // Scale from 0 to 5
      },
    },
  };
  
  const filteredComments = feedbackData?.comments.filter(c => c && c.trim() !== "") || [];

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white  p-6 sm:p-8 flex flex-col gap-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">College Graduation Feedback Analysis</h2>
        </div>
        
        {loadingData && <div className="text-center text-blue-600">Loading feedback data...</div>}
        {error && <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>}
        
        {feedbackData && (
          <div className="flex flex-col gap-8 mt-4 border-t border-gray-200 pt-6">
            
            {/* --- MODIFIED: Key Metrics & Radar Chart --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Key Metrics */}
              <div className="flex flex-col gap-6">
                <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 text-center h-full flex flex-col justify-center">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Overall College Rating</div>
                  <div className="text-4xl font-bold text-blue-800 mb-2">
                    {feedbackData.averageOverallRating.toFixed(1)} / 5
                  </div>
                  <div className="flex justify-center">
                    <StarRatingDisplay rating={feedbackData.averageOverallRating} />
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 text-center h-full flex flex-col justify-center">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Total Submissions Analyzed</div>
                  <div className="text-6xl font-bold text-blue-800">
                    {feedbackData.totalSubmissions}
                  </div>
                </div>
              </div>

              {/* Right Column: Radar Chart */}
              <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
                <div className="relative" style={{ height: '400px' }}>
                  {radarChartData && <Radar options={radarChartOptions} data={radarChartData} />}
                </div>
              </div>
            </div>

            {/* Detailed Bar Chart */}
            <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Detailed Question Breakdown</h3>
              <div className="relative" style={{ height: '900px' }}>
                {barChartData && <Bar options={barChartOptions} data={barChartData} />}
              </div>
            </div>

            {/* Comments */}
            <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Additional Comments</h3>
              {filteredComments.length > 0 ? (
                <ul className="list-disc pl-5 space-y-3 max-h-80 overflow-y-auto">
                  {filteredComments.map((comment, index) => (
                    <li key={index} className="text-gray-700 italic">"{comment}"</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No additional comments were submitted.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default FinalFeedbackAnalysis;

// --- Questions from FinalFeedback.jsx (for mock data) ---
const FEEDBACK_QUESTIONS = [
 "1. Quality of curriculum and its relevance to industry trends.",
  "2. Overall quality of teaching and faculty expertise.",
  "3. How updated was the syllabus with new technologies/concepts?",
  "4. Faculty's willingness to provide mentorship and support outside class.",
  "5. Fairness and transparency in the examination and grading system.",
  "6. Availability and quality of lab, library, and workshop facilities.",
  "7. Quality of campus infrastructure (classrooms, canteens, common areas).",
  "8. Reliability and speed of campus Wi-Fi and IT support.",
  "9. Quality and hygiene of hostel facilities (if applicable).",
  "10. Quality and variety of food in the campus canteen/mess.",
  "11. Effectiveness of the Training & Placement (T&P) cell.",
  "12. Quality of career counseling and guidance provided.",
  "13. Usefulness of workshops, guest lectures, and seminars conducted.",
  "14. Support for internships and industry projects.",
  "15. Strength and usefulness of the college's alumni network.",
  "16. Support for sports and extracurricular activities (e.g., clubs, fests).",
  "17. Efficiency and helpfulness of the college administration and staff.",
  "18. Effectiveness of the grievance redressal (complaint) system.",
  "19. Focus on student well-being and mental health support.",
  "20. How well did the college contribute to your personal and professional growth?",
  "21. Overall campus safety and security.",
  "22. Would you recommend this college to a friend or family member?",
];

// --- MOCK FUNCTION (No changes, but now supports both charts) ---
const getMockFinalFeedbackData = () => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const total = rand(150, 400); 
  
  return {
    totalSubmissions: total,
    averageOverallRating: rand(32, 47) / 10,
    questionBreakdown: FEEDBACK_QUESTIONS.map(q => {
      const e = rand(1, total);
      const g = rand(0, total - e);
      const a = rand(0, total - e - g);
      const f = rand(0, total - e - g - a);
      const p = Math.max(0, total - e - g - a - f);
      return { question: q, excellent: e, good: g, average: a, fair: f, poor: p };
    }),
    comments: [
      "The placement cell was excellent, really helped me get my job.",
      "Library resources are great, but the Wi-Fi in the hostel is terrible.",
      "",
      "Some faculty are amazing, but others just read from ppts.",
      "Need more support for sports and cultural fests.",
      "Overall a good experience, I would recommend it.",
      "The curriculum for CSE is very outdated. Needs urgent update.",
      "Canteen food is average at best."
    ].sort(() => 0.5 - Math.random()).slice(0, rand(4, 8))
  };
};