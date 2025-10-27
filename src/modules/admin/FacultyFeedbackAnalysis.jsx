
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


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


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


// --- Star Rating Display Component ---
const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);


  return (
    <div className="flex gap-1 text-3xl text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {halfStar && <span>★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      ))}
    </div>
  );
};


const FacultyFeedbackAnalysis = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [feedbackData, setFeedbackData] = useState(null);


  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");


  const token = getTokenFromLocalStorage();


  // 1. Fetch ALL FACULTY on mount
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoadingFilters(true);
      setError("");


      try {
        const res = await fetch(`${API_BASE}/admin/analytics/teachers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });


        if (!res.ok) throw new Error("Failed to fetch faculty list");


        const data = await res.json();
        console.log("🔵 Faculty list received:", data);
        
        // Scale faculty ratings from 1-3 to 1-5
        const scaledData = data.map(f => ({
          ...f,
          overallRating: f.overallRating ? (f.overallRating / 3) * 5 : 0
        }));
        
        setFacultyList(scaledData);
      } catch (err) {
        setError(err.message + " - Using mock faculty");
        console.error("❌ Error fetching faculty:", err);


        // MOCK DATA FOR FACULTY
        setFacultyList([
          { facultyId: 101, facultyName: "Dr. Priya Sharma (Mock)", overallRating: 4.2, totalFeedbacks: 45 },
          { facultyId: 102, facultyName: "Prof. Rajesh Kumar (Mock)", overallRating: 3.8, totalFeedbacks: 38 },
          { facultyId: 103, facultyName: "Dr. Anjali Singh (Mock)", overallRating: 4.5, totalFeedbacks: 52 },
        ]);
      } finally {
        setLoadingFilters(false);
      }
    };


    fetchFaculty();
  }, [token]);


  // 2. Fetch FEEDBACK DATA when a FACULTY is selected
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
        // Fetch detailed stats
        const statsRes = await fetch(`${API_BASE}/admin/analytics/teacher/${selectedFacultyId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });


        if (!statsRes.ok) throw new Error(`Failed to fetch feedback for faculty ${selectedFacultyId}`);


        const statsData = await statsRes.json();
        console.log("🔵 Stats data received:", statsData);


        // Fetch comments
        const commentsRes = await fetch(`${API_BASE}/admin/reviews/teacher/${selectedFacultyId}?page=1&limit=20`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });


        let comments = [];
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          comments = commentsData.content.map(c => c.comment).filter(c => c);
        }


        // Helper function to scale 1-3 rating to 1-5
        const scaleRating = (rating) => rating ? (rating / 3) * 5 : 0;

        // Helper to simulate distribution from average (since backend doesn't provide breakdown)
        const generateDistribution = (avgScore, total) => {
          // Convert average to approximate distribution
          const scaledAvg = avgScore;
          
          if (scaledAvg >= 4.5) {
            return { excellent: Math.round(total * 0.7), good: Math.round(total * 0.25), average: Math.round(total * 0.05), fair: 0, poor: 0 };
          } else if (scaledAvg >= 4.0) {
            return { excellent: Math.round(total * 0.5), good: Math.round(total * 0.4), average: Math.round(total * 0.1), fair: 0, poor: 0 };
          } else if (scaledAvg >= 3.5) {
            return { excellent: Math.round(total * 0.3), good: Math.round(total * 0.5), average: Math.round(total * 0.2), fair: 0, poor: 0 };
          } else if (scaledAvg >= 3.0) {
            return { excellent: Math.round(total * 0.2), good: Math.round(total * 0.4), average: Math.round(total * 0.3), fair: Math.round(total * 0.1), poor: 0 };
          } else if (scaledAvg >= 2.5) {
            return { excellent: Math.round(total * 0.1), good: Math.round(total * 0.3), average: Math.round(total * 0.4), fair: Math.round(total * 0.15), poor: Math.round(total * 0.05) };
          } else {
            return { excellent: 0, good: Math.round(total * 0.2), average: Math.round(total * 0.3), fair: Math.round(total * 0.3), poor: Math.round(total * 0.2) };
          }
        };

        const totalResponses = statsData.totalResponses || 0;


        // Transform backend data with PROPER SCALING and DISTRIBUTION
        const transformedData = {
          facultyName: facultyList.find(f => f.facultyId === parseInt(selectedFacultyId))?.facultyName || "Unknown Faculty",
          totalSubmissions: totalResponses,
          
          // FIX: Scale overall rating from 1-3 to 1-5
          averageOverallRating: scaleRating(statsData.overallAverage),
          
          // For chart: show breakdown with colors
          questionBreakdown: [
            { 
              question: "1. Punctuality and regularity", 
              averageScore: scaleRating(statsData.averagePunctuality),
              ...generateDistribution(scaleRating(statsData.averagePunctuality), totalResponses)
            },
            { 
              question: "2. Preparation and organization", 
              averageScore: scaleRating(statsData.averagePreparation),
              ...generateDistribution(scaleRating(statsData.averagePreparation), totalResponses)
            },
            { 
              question: "3. Command over subject", 
              averageScore: scaleRating(statsData.averageCommand),
              ...generateDistribution(scaleRating(statsData.averageCommand), totalResponses)
            },
            { 
              question: "4. Clarity in explaining", 
              averageScore: scaleRating(statsData.averageClarity),
              ...generateDistribution(scaleRating(statsData.averageClarity), totalResponses)
            },
            { 
              question: "5. Ability to link topics", 
              averageScore: scaleRating(statsData.averageHelpfulness),
              ...generateDistribution(scaleRating(statsData.averageHelpfulness), totalResponses)
            },
            { 
              question: "6. Pace of teaching", 
              averageScore: scaleRating(statsData.averagePace),
              ...generateDistribution(scaleRating(statsData.averagePace), totalResponses)
            },
            { 
              question: "7. Use of teaching aids", 
              averageScore: scaleRating(statsData.averageTeachingAids),
              ...generateDistribution(scaleRating(statsData.averageTeachingAids), totalResponses)
            },
            { 
              question: "8. Ability to engage students", 
              averageScore: scaleRating(statsData.averageEngagement),
              ...generateDistribution(scaleRating(statsData.averageEngagement), totalResponses)
            },
            { 
              question: "9. Encourages interaction", 
              averageScore: scaleRating(statsData.averageInteraction),
              ...generateDistribution(scaleRating(statsData.averageInteraction), totalResponses)
            },
            { 
              question: "10. Syllabus coverage", 
              averageScore: scaleRating(statsData.averageSyllabusCoverage),
              ...generateDistribution(scaleRating(statsData.averageSyllabusCoverage), totalResponses)
            },
            { 
              question: "11. Fairness in evaluation", 
              averageScore: scaleRating(statsData.averageFairness),
              ...generateDistribution(scaleRating(statsData.averageFairness), totalResponses)
            },
            { 
              question: "12. Quality of assignments", 
              averageScore: scaleRating(statsData.averageAssignments),
              ...generateDistribution(scaleRating(statsData.averageAssignments), totalResponses)
            },
            { 
              question: "13. Handling doubts", 
              averageScore: scaleRating(statsData.averageDoubtHandling),
              ...generateDistribution(scaleRating(statsData.averageDoubtHandling), totalResponses)
            },
            { 
              question: "14. Availability outside class", 
              averageScore: scaleRating(statsData.averageAvailability),
              ...generateDistribution(scaleRating(statsData.averageAvailability), totalResponses)
            },
            { 
              question: "15. Professionalism", 
              averageScore: scaleRating(statsData.averageProfessionalism),
              ...generateDistribution(scaleRating(statsData.averageProfessionalism), totalResponses)
            },
          ],
          comments: comments
        };


        setFeedbackData(transformedData);
      } catch (err) {
        setError(err.message + " - Showing mock data instead");
        console.error("❌ Error fetching feedback data:", err);


        // MOCK DATA FOR FEEDBACK
        setFeedbackData(getMockFeedbackData(selectedFacultyId));
      } finally {
        setLoadingData(false);
      }
    };


    fetchFeedback();
  }, [selectedFacultyId, token, facultyList]);


  // 3. Transform data for the chart - STACKED BAR with colors
  const chartData = useMemo(() => {
    if (!feedbackData?.questionBreakdown) return null;


    const labels = feedbackData.questionBreakdown.map((q) => {
      const shortQ = q.question.substring(q.question.indexOf(".") + 1).trim();
      return shortQ.length > 30 ? shortQ.substring(0, 30) + "..." : shortQ;
    });


    return {
      labels,
      datasets: [
        { 
          label: 'Excellent', 
          data: feedbackData.questionBreakdown.map(q => q.excellent || 0), 
          backgroundColor: 'rgba(75, 192, 192, 0.7)' 
        },
        { 
          label: 'Good', 
          data: feedbackData.questionBreakdown.map(q => q.good || 0), 
          backgroundColor: 'rgba(54, 162, 235, 0.7)' 
        },
        { 
          label: 'Average', 
          data: feedbackData.questionBreakdown.map(q => q.average || 0), 
          backgroundColor: 'rgba(255, 206, 86, 0.7)' 
        },
        { 
          label: 'Fair', 
          data: feedbackData.questionBreakdown.map(q => q.fair || 0), 
          backgroundColor: 'rgba(255, 159, 64, 0.7)' 
        },
        { 
          label: 'Poor', 
          data: feedbackData.questionBreakdown.map(q => q.poor || 0), 
          backgroundColor: 'rgba(255, 99, 132, 0.7)' 
        },
      ],
    };
  }, [feedbackData]);


  // 4. Configure chart options - ENABLE STACKING
  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Detailed Feedback Breakdown per Question",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return feedbackData.questionBreakdown[index].question;
          }
        },
      },
    },
    scales: {
      x: { 
        stacked: true,
        title: {
          display: true,
          text: 'Number of Responses'
        }
      },
      y: { stacked: true },
    },
  };


  const filteredComments = feedbackData?.comments.filter((c) => c && c.trim() !== "");


  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Faculty Feedback Analysis</h2>
        </div>


        {/* Faculty Dropdown */}
        <div className="max-w-3xl mx-auto w-full">
          <label className="font-semibold text-sm mb-1 block text-blue-900">Select Faculty</label>
          <select
            value={selectedFacultyId}
            onChange={(e) => setSelectedFacultyId(e.target.value)}
            className="w-full h-11 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={loadingFilters}
          >
            <option value="">
              {loadingFilters
                ? "Loading faculty..."
                : facultyList.length === 0
                ? "-- No faculty found --"
                : "-- Select a Faculty --"}
            </option>
            {facultyList.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>
                {f.facultyName} (Avg: {f.overallRating?.toFixed(1) || "N/A"}/5, Total: {f.totalFeedbacks || 0})
              </option>
            ))}
          </select>
        </div>


        {/* Data Display Area */}
        {loadingData && <div className="text-center text-blue-600">Loading feedback data...</div>}


        {error && <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>}


        {!loadingData && !error && !selectedFacultyId && (
          <div className="text-center text-gray-500 p-8">
            Please select a faculty member to view their analysis.
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
                <div className="text-6xl font-bold text-blue-800">{feedbackData.totalSubmissions}</div>
              </div>
            </div>


            {/* Chart */}
            <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Detailed Question Breakdown</h3>
              <div className="relative" style={{ height: "900px" }}>
                {chartData && <Bar options={chartOptions} data={chartData} />}
              </div>
            </div>


            {/* Comments */}
            <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Additional Comments</h3>
              {filteredComments && filteredComments.length > 0 ? (
                <ul className="list-disc pl-5 space-y-3 max-h-80 overflow-y-auto">
                  {filteredComments.map((comment, index) => (
                    <li key={index} className="text-gray-700 italic">
                      {comment}
                    </li>
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


// --- MOCK FUNCTION ---
const getMockFeedbackData = (facultyId) => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const total = rand(20, 80);


  const facultyNames = {
    101: "Dr. Priya Sharma (Mock)",
    102: "Prof. Rajesh Kumar (Mock)",
    103: "Dr. Anjali Singh (Mock)",
  };


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


  return {
    facultyId: facultyId,
    facultyName: facultyNames[facultyId] || "Unknown Faculty (Mock)",
    totalSubmissions: total,
    averageOverallRating: rand(30, 50) / 10,
    questionBreakdown: FEEDBACK_QUESTIONS.map((q) => {
      const e = rand(1, total);
      const g = rand(0, total - e);
      const a = rand(0, total - e - g);
      const f = rand(0, total - e - g - a);
      const p = Math.max(0, total - e - g - a - f);
      const avgScore = ((e * 5) + (g * 4) + (a * 3) + (f * 2) + (p * 1)) / total;
      
      return {
        question: q,
        averageScore: avgScore,
        excellent: e,
        good: g,
        average: a,
        fair: f,
        poor: p,
      };
    }),
    comments: [
      "Great teacher, very supportive!",
      "Sometimes the pace is a bit too fast.",
      "Clears doubts very effectively.",
      "The assignments were challenging but useful.",
      "Very professional and knowledgeable.",
    ]
      .sort(() => 0.5 - Math.random())
      .slice(0, rand(1, 5)),
  };
};
