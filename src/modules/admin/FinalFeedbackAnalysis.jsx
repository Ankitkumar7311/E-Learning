
import React, { useEffect, useState, useMemo } from "react";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// Register ALL Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

// A reusable star rating component (Read-only version)
const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
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

// --- Category definitions for Radar Chart ---
const CATEGORY_MAP = {
  "Academics": [0, 1, 2, 3, 4], // Questions 1-5
  "Infrastructure": [5, 6, 7, 8, 9], // Questions 6-10
  "Placements": [10, 11, 12, 13, 14], // Questions 11-15
  "Student Life & Support": [15, 16, 17, 18, 19, 20, 21], // Questions 16-22
};

const CATEGORIES = ["Academics", "Infrastructure", "Placements", "Student Life & Support"];

// Assign weights to options
const OPTION_WEIGHTS = {
  "Excellent": 5,
  "Good": 4,
  "Average": 3,
  "Fair": 2,
  "Poor": 1,
};

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
        const res = await fetch(`${API_BASE}/admin/analytics/student-survey`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch final feedback");

        const data = await res.json();
        console.log("🔵 Exit survey data received:", data);

        // Transform backend response to match frontend structure
        const transformedData = {
          totalSubmissions: data.totalResponses,
          averageOverallRating: data.overallRecommendationScore,
          categoryRatings: data.categoryRatings,
          recommendationBreakdown: data.recommendationBreakdown,
          questionBreakdown: [], // Not used in current design but can be populated if needed
          comments: [] // Will be fetched separately if needed
        };

        setFeedbackData(transformedData);
      } catch (err) {
        setError(err.message + " - Showing mock data instead");
        console.error("❌ Error fetching exit survey:", err);
        setFeedbackData(getMockFinalFeedbackData());
      } finally {
        setLoadingData(false);
      }
    };

    fetchFinalFeedback();
  }, [token]);

  // 2. Transform data for the RADAR chart
  const radarChartData = useMemo(() => {
    if (!feedbackData?.categoryRatings) return null;

    const data = [
      feedbackData.categoryRatings.academics || 0,
      feedbackData.categoryRatings.infrastructure || 0,
      feedbackData.categoryRatings.placements || 0,
      feedbackData.categoryRatings.studentLife || 0,
    ];

    return {
      labels: CATEGORIES,
      datasets: [
        {
          label: "Average Score (out of 5)",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
        },
      ],
    };
  }, [feedbackData]);

  // 3. Configure RADAR chart options
  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Overall Category Performance",
      },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(0, 0, 0, 0.1)" },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        pointLabels: {
          font: { size: 12, weight: "bold" },
        },
        ticks: {
          backdropColor: "transparent",
          color: "#4B5563",
          stepSize: 1,
          min: 0,
          max: 5,
        },
      },
    },
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">College Graduation Feedback Analysis</h2>
        </div>

        {loadingData && <div className="text-center text-blue-600">Loading feedback data...</div>}

        {error && <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>}

        {feedbackData && (
          <div className="flex flex-col gap-8 mt-4 border-t border-gray-200 pt-6">
            {/* Key Metrics + Radar Chart */}
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
                  <div className="text-6xl font-bold text-blue-800">{feedbackData.totalSubmissions}</div>
                </div>
              </div>

              {/* Right Column: Radar Chart */}
              <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
                <div className="relative" style={{ height: "400px" }}>
                  {radarChartData && <Radar options={radarChartOptions} data={radarChartData} />}
                </div>
              </div>
            </div>

            {/* Recommendation Breakdown */}
            {feedbackData.recommendationBreakdown && (
              <div className="p-5 rounded-xl bg-white shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Recommendation Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{feedbackData.recommendationBreakdown.promoters}</div>
                    <div className="text-sm text-gray-600">Promoters (4-5 ⭐)</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{feedbackData.recommendationBreakdown.passive}</div>
                    <div className="text-sm text-gray-600">Passive (3 ⭐)</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{feedbackData.recommendationBreakdown.detractors}</div>
                    <div className="text-sm text-gray-600">Detractors (1-2 ⭐)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalFeedbackAnalysis;

// --- MOCK FUNCTION ---
const getMockFinalFeedbackData = () => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const total = rand(150, 400);

  return {
    totalSubmissions: total,
    averageOverallRating: rand(32, 47) / 10,
    categoryRatings: {
      academics: rand(30, 45) / 10,
      infrastructure: rand(30, 45) / 10,
      placements: rand(30, 45) / 10,
      studentLife: rand(30, 45) / 10,
    },
    recommendationBreakdown: {
      promoters: rand(80, 200),
      passive: rand(40, 100),
      detractors: rand(10, 50),
    },
    comments: [
      "The placement cell was excellent, really helped me get my job.",
      "Library resources are great, but the Wi-Fi in the hostel is terrible.",
      "Some faculty are amazing, but others just read from ppts.",
      "Need more support for sports and cultural fests.",
      "Overall a good experience, I would recommend it.",
      "The curriculum for CSE is very outdated. Needs urgent update.",
      "Canteen food is average at best.",
    ]
      .sort(() => 0.5 - Math.random())
      .slice(0, rand(4, 8)),
  };
};
