import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// --- Register Chart.js components ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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

// --- Star Rating Component ---
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


const FacultyFeedbackAnalysis = () => {
  // New states for branch filtering
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  
  const [feedbackData, setFeedbackData] = useState(null);
  
  // Split loading state for better UX
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  
  const token = getTokenFromLocalStorage();

  // 1. Fetch ALL BRANCHES on mount
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingFilters(true);
      setError("");
      try {
        // --- NEW ASSUMED API ENDPOINT ---
        const res = await fetch(`${API_BASE}/admin/getAllBranches`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch branches");
        const data = await res.json(); // Expecting: ["CSE", "CSD", "ECE"]
        setBranches(data);
      } catch (err) {
        setError(err.message + " (Using mock branches)");
        // --- MOCK DATA FOR BRANCHES ---
        setBranches(["CSE", "CSD", "ECE", "MECH"]);
        // --- END MOCK DATA ---
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchBranches();
  }, [token]);

  // 2. Fetch FACULTY when a BRANCH is selected
  useEffect(() => {
    if (!selectedBranch) {
      setFacultyList([]);
      setSelectedFacultyId("");
      setFeedbackData(null);
      return;
    }

    const fetchFaculty = async () => {
      setLoadingFilters(true);
      setError("");
      setFacultyList([]);
      setSelectedFacultyId("");
      setFeedbackData(null);
      try {
        // --- MODIFIED API ENDPOINT ---
        const res = await fetch(`${API_BASE}/admin/getFacultyByBranch?branch=${selectedBranch}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Failed to fetch faculty for ${selectedBranch}`);
        const data = await res.json();
        setFacultyList(data);
      } catch (err) {
        setError(err.message + " (Using mock faculty)");
        // --- MOCK DATA FOR FACULTY ---
        if (selectedBranch === "CSE") {
          setFacultyList([
            { facultyId: "F101", facultyName: "Dr. Priya Sharma (Mock)" },
            { facultyId: "F102", facultyName: "Prof. Rajesh Kumar (Mock)" },
          ]);
        } else if (selectedBranch === "CSD") {
          setFacultyList([
            { facultyId: "F103", facultyName: "Dr. Anjali Singh (Mock)" },
          ]);
        } else {
          setFacultyList([]); // No mock data for other branches
        }
        // --- END MOCK DATA ---
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFaculty();
  }, [selectedBranch, token]);

  // 3. Fetch FEEDBACK DATA when a FACULTY is selected
  useEffect(() => {
    if (!selectedFacultyId) {
      setFeedbackData(null);
      return;
    }

    const fetchFeedback = async () => {
      setLoadingData(true);
      setError("");
      setFeedbackData(null);
      try {
        // --- This endpoint is the same as before ---
        const res = await fetch(`${API_BASE}/admin/getFacultyFeedback?facultyId=${selectedFacultyId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
           throw new Error(`Failed to fetch feedback for faculty ${selectedFacultyId}`);
        }
        const data = await res.json();
        setFeedbackData(data);
      } catch (err) {
        setError(err.message + " (Showing mock data instead)");
        // --- MOCK DATA FOR FEEDBACK ---
        setFeedbackData(getMockFeedbackData(selectedFacultyId));
        // --- End Mock Data ---
      } finally {
        setLoadingData(false);
      }
    };
    fetchFeedback();
  }, [selectedFacultyId, token]);

  // 4. Transform data for the chart (no changes here)
  const chartData = useMemo(() => {
    if (!feedbackData?.questionBreakdown) return null;
    const labels = feedbackData.questionBreakdown.map(q => {
        const shortQ = q.question.substring(q.question.indexOf('.') + 1).trim();
        return shortQ.length > 30 ? shortQ.substring(0, 30) + '...' : shortQ;
    });
    return {
      labels,
      datasets: [
        { label: 'Good', data: feedbackData.questionBreakdown.map(q => q.good), backgroundColor: 'rgba(75, 192, 192, 0.7)' },
        { label: 'Average', data: feedbackData.questionBreakdown.map(q => q.average), backgroundColor: 'rgba(255, 206, 86, 0.7)' },
        { label: 'Not Good', data: feedbackData.questionBreakdown.map(q => q.notGood), backgroundColor: 'rgba(255, 99, 132, 0.7)' },
      ],
    };
  }, [feedbackData]);

  // 5. Configure chart options (no changes here)
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Feedback Breakdown per Question' },
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
  
  const filteredComments = feedbackData?.comments.filter(c => c && c.trim() !== "") || [];

  return (
    <div className=" min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white  p-6 sm:p-8 flex flex-col gap-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Faculty Feedback Analysis</h2>
        </div>
        
        {/* --- New Filter Layout --- */}
        <div className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Branch Dropdown */}
          <div>
            <label className="font-semibold text-sm mb-1 block text-blue-900">
              Select Branch:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loadingFilters}
            >
              <option value="">
                {loadingFilters ? "Loading branches..." : "-- Select a Branch --"}
              </option>
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Faculty Dropdown */}
          <div>
            <label className="font-semibold text-sm mb-1 block text-blue-900">
              Select Faculty:
            </label>
            <select
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={!selectedBranch || loadingFilters} // Disabled until branch is selected
            >
              <option value="">
                {!selectedBranch 
                  ? "-- Select a branch first --"
                  : loadingFilters
                  ? "Loading faculty..."
                  : facultyList.length === 0
                  ? "-- No faculty found --"
                  : "-- Select a Faculty --"
                }
              </option>
              {facultyList.map(f => (
                <option key={f.facultyId} value={f.facultyId}>{f.facultyName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Data Display Area --- */}
        {loadingData && <div className="text-center text-blue-600">Loading feedback data...</div>}
        {error && <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>}
        
        {!loadingData && !error && !selectedFacultyId && (
          <div className="text-center text-gray-500 p-8">
            Please select a branch and faculty member to view their analysis.
          </div>
        )}

        {feedbackData && (
          <div className="flex flex-col gap-8 mt-4 border-t border-gray-200 pt-6">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">Overall Average Rating</div>
                <div className="text-4xl font-bold text-blue-800 mb-2">
                  {feedbackData.averageOverallRating.toFixed(1)} / 5
                </div>
                <div className="flex justify-center">
                   <StarRatingDisplay rating={feedbackData.averageOverallRating} />
                </div>
              </div>
              <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100 text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Submissions Analyzed</div>
                <div className="text-6xl font-bold text-blue-800">
                  {feedbackData.totalSubmissions}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Question Breakdown</h3>
              <div className="relative" style={{ height: '600px' }}>
                {chartData && <Bar options={chartOptions} data={chartData} />}
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

export default FacultyFeedbackAnalysis;

// --- Questions from FacultyFeedback.jsx (for reference) ---
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

// --- MOCK FUNCTION (Updated to use the real questions) ---
const getMockFeedbackData = (facultyId) => {
  
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const total = rand(20, 80);
  
  const facultyNames = {
      "F101": "Dr. Priya Sharma (Mock)",
      "F102": "Prof. Rajesh Kumar (Mock)",
      "F103": "Dr. Anjali Singh (Mock)"
  };

  return {
    facultyId: facultyId,
    facultyName: facultyNames[facultyId] || "Unknown Faculty (Mock)",
    totalSubmissions: total,
    averageOverallRating: rand(30, 48) / 10,
    questionBreakdown: FEEDBACK_QUESTIONS.map(q => {
      const g = rand(1, total);
      const a = rand(0, total - g);
      const n = Math.max(0, total - g - a);
      return { question: q, good: g, average: a, notGood: n };
    }),
    comments: [
      "Great teacher, very supportive!",
      "Sometimes the pace is a bit too fast.",
      "",
      "Clears doubts very effectively.",
      "The assignments were challenging but useful.",
      "Very professional and knowledgeable."
    ].sort(() => 0.5 - Math.random()).slice(0, rand(1, 5))
  };
};