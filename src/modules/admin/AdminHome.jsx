import React, { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../../auth/AuthContext";
// Import icons
import { FaUsers, FaBoxOpen, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

// --- Configuration and Helpers ---
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080/VidyaSarthi';

const readToken = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    console.warn("readToken error:", e);
    return localStorage.getItem("token") || null;
  }
};

const PIE_COLORS = ["#0088FE", "#00C49F"]; // Students, Faculty

// --- Reusable UI Components ---

/**
 * A custom tooltip for all charts.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-md border border-gray-200">
        <p className="font-semibold text-gray-800 text-sm">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * A loading spinner overlay for charts.
 */
const ChartLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-lg">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * An error message overlay for charts.
 */
const ChartError = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/80 backdrop-blur-sm z-10 p-4 rounded-lg">
    <p className="text-red-700 font-semibold mb-2">Data Error</p>
    <p className="text-red-600 text-sm text-center">{message || "Failed to load data."}</p>
  </div>
);

/**
 * NEW: Attractive StatCard with icon and hover effects
 */
const StatCard = ({ title, value, loading, error, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200 
                  flex items-center space-x-4
                  transition-all duration-300 ease-in-out
                  hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
    
    {/* Icon Wrapper */}
    <div className="flex-shrink-0">
      <div className="w-14 h-14 flex items-center justify-center rounded-full text-2xl
                      bg-blue-100 text-blue-600">
        {icon}
      </div>
    </div>
    
    {/* Text Content */}
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-500 uppercase truncate">{title}</h3>
      {loading && (
        <div className="h-8 mt-1 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      )}
      {error && !loading && (
        <div className="text-red-500 text-sm mt-1">Error</div>
      )}
      {!loading && !error && (
        <p className="text-3xl font-bold text-gray-800 truncate">{value}</p>
      )}
    </div>
  </div>
);


// --- Main AdminHome Component ---
const AdminHome = () => {
  const { token: contextToken } = useAuth() || {};
  const token = contextToken || readToken();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [analyticsData, setAnalyticsData] = useState({
    userDistribution: { facultyCount: 0, studentCount: 0 },
    contentUploads: { totalUploads: 0, uploadsByType: {} },
    totalUsers: 0,
    totalMaterials: 0,
    timeData: [],
  });

  const fetchAnalyticsData = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log(`Dashboard Analytics Fetched Data:`, data);
      setAnalyticsData({ ...data, timeData: data.timeData || [] });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // --- Data Transformation for Charts ---
  const timeChartData = analyticsData.timeData;
  const pieData = [
    { name: "Students", value: analyticsData.userDistribution.studentCount || 0 },
    { name: "Faculty", value: analyticsData.userDistribution.facultyCount || 0 },
  ];
  const barChartData = [
    {
      name: 'Uploads',
      notes: analyticsData.contentUploads.uploadsByType?.NOTES || 0,
      qb: analyticsData.contentUploads.uploadsByType?.QUESTION_BANK || 0,
      pyq: analyticsData.contentUploads.uploadsByType?.PREVIOUS_YEAR_QUESTION || 0,
    }
  ];

  return (
    <div className="font-sans space-y-6 p-4 md:p-6">
      {/* --- Header: Title --- */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Welcome back, here's an overview of your platform's activity.
        </p>
      </div>
      
      {/* --- Stat Cards Grid (UPDATED) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Users" 
          value={analyticsData.totalUsers} 
          loading={loading}
          error={error}
          icon={<FaUsers />}
        />
        <StatCard 
          title="Total Materials" 
          value={analyticsData.totalMaterials} 
          loading={loading} 
          error={error}
          icon={<FaBoxOpen />}
        />
        <StatCard 
          title="Students" 
          value={analyticsData.userDistribution.studentCount} 
          loading={loading} 
          error={error}
          icon={<FaUserGraduate />}
        />
        <StatCard 
          title="Faculty" 
          value={analyticsData.userDistribution.facultyCount} 
          loading={loading} 
          error={error}
          icon={<FaChalkboardTeacher />}
        />
      </div>

      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: User Visits */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col relative">
          {loading && <ChartLoader />}
          {error && !loading && <ChartError message={error} />}
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0">User Visits</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  name="Visits"
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  activeDot={{ r: 8 }} 
                  dot={false} 
                />
                <Area type="monotone" dataKey="visits" fill="url(#colorVisits)" stroke={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Active Users */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col relative">
          {loading && <ChartLoader />}
          {error && !loading && <ChartError message={error} />}
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0">Active Users</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  name="Active Users"
                  stroke="#10b981" 
                  strokeWidth={3} 
                  activeDot={{ r: 8 }} 
                  dot={false} 
                />
                <Area type="monotone" dataKey="activeUsers" fill="url(#colorUsers)" stroke={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Content Uploads */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col relative">
          {loading && <ChartLoader />}
          {error && !loading && <ChartError message={error} />}
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0">Content Uploads</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="notes" fill="#ef4444" name="Notes" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qb" fill="#f59e0b" name="Question Banks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pyq" fill="#8b5cf6" name="PYQs" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Total User Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col relative">
          {loading && <ChartLoader />}
          {error && !loading && <ChartError message={error} />}
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0 text-center">User Distribution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.filter(d => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="45%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={3}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PIE_COLORS[index % PIE_COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="middle"
                  layout="vertical"
                  align="right"
                  wrapperStyle={{ paddingLeft: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;