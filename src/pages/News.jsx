import React, { useState, useEffect } from "react";

// Mock data to simulate API response
const placeholderNews = [
  {
    id: 1,
    type: "News",
    publishDateTime: "2025-10-10T10:00:00Z",
    facultyId: "F101",
    describeEvents: "The annual college tech fest 'Innovate 2025' has been scheduled for November 15th and 16th. All students are encouraged to participate in the various coding and robotics competitions. Registration details will be shared soon.",
  },
  {
    id: 2,
    type: "News",
    publishDateTime: "2025-10-08T14:30:00Z",
    facultyId: "F205",
    describeEvents: "A special seminar on 'Introduction to Quantum Computing' will be held in the main auditorium on October 25th at 2:00 PM. Dr. Arin Sharma, a renowned expert in the field, will be the keynote speaker.",
  },
  {
    id: 3,
    type: "News",
    publishDateTime: "2025-10-05T09:00:00Z",
    facultyId: "F302",
    describeEvents: "The final exams for the 5th semester have been rescheduled. The new timetable is available on the official college portal. Students are advised to check the updated schedule and prepare accordingly.",
  },
  {
    id: 4,
    type: "News",
    publishDateTime: "2025-10-01T11:45:00Z",
    facultyId: "F101",
    describeEvents: "Our college team has won the national robotics competition! A special felicitation ceremony will be held to honor the team's achievement. Congratulations to all the participants!",
  },
  {
    id: 5,
    type: "News",
    publishDateTime: "2025-09-28T16:00:00Z",
    facultyId: "F404",
    describeEvents: "An introductory workshop on 'Web Development with React' is being organized by the CSE department. The workshop will cover fundamental concepts and project-based learning. Limited seats are available.",
  },
  {
    id: 6,
    type: "News",
    publishDateTime: "2025-09-25T12:00:00Z",
    facultyId: "F501",
    describeEvents: "The college library will be closed for maintenance on October 1st and 2nd. Students are requested to return or borrow books before the scheduled closure.",
  }
];

// Utility to format dates nicely
const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
};

// Modal component for viewing full news details
const NewsModal = ({ news, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-6">
    <div className="bg-white max-w-3xl w-full rounded-lg shadow-xl animate-slide-up">
      <div className="flex justify-between items-start p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{news.type || "News"}</h2>
          <p className="text-xs text-gray-500">Published: {formatDateTime(news.publishDateTime)}</p>
          <p className="text-xs text-gray-500">Faculty: {news.facultyId || "—"}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {news.describeEvents || "No description available."}
        </p>
      </div>
      <div className="p-4 border-t flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 font-semibold text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Main News component
const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    // Simulate a loading delay for demonstration purposes
    const timer = setTimeout(() => {
      setNewsList(placeholderNews);
      setLoading(false);
      setError("");
    }, 1000); // 1-second delay

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl max-h-full mx-auto p-4 sm:p-6 bg-white">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Latest News</h1>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 text-sm font-semibold text-gray-700"
        >
          🔄 Refresh
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
      ) : newsList.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-lg shadow text-gray-500">
          No news available.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-blue-100 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    {news.type || "News"}
                  </span>
                  <span className="text-xs text-gray-500">{formatDateTime(news.publishDateTime)}</span>
                </div>
                <p
                  className="text-gray-800 leading-relaxed line-clamp-3"
                  title={news.describeEvents}
                >
                  {news.describeEvents || "No description provided."}
                </p>
              </div>
              <button
                onClick={() => setSelectedNews(news)}
                className="mt-4 px-4 py-2 rounded-md bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
};

export default News;