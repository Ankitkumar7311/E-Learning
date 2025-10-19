import React, { useState, useEffect } from "react";
// 1. Import Recharts components
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area, // <-- Import Area for gradient fills
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

// 2. Dummy Data Generation (Unchanged)
const getDummyData = (filter) => {
  let labels = [];
  let visitsData = [];
  let activeUsersData = [];
  let notesData = [];
  let qbData = [];
  let pyqData = [];

  if (filter === "day") {
    labels = ["1AM", "4AM", "7AM", "10AM", "1PM", "4PM", "7PM", "10PM"];
    visitsData = [12, 19, 3, 5, 2, 3, 9, 15];
    activeUsersData = [5, 10, 2, 3, 1, 2, 5, 8];
    notesData = [2, 1, 0, 1, 0, 0, 1, 0];
    qbData = [1, 0, 0, 0, 1, 0, 0, 1];
    pyqData = [0, 0, 1, 1, 0, 0, 0, 0];
  } else if (filter === "week") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    visitsData = [110, 130, 90, 120, 80, 100, 150];
    activeUsersData = [40, 50, 35, 60, 30, 45, 70];
    notesData = [10, 12, 5, 8, 3, 7, 10];
    qbData = [5, 2, 3, 4, 1, 5, 6];
    pyqData = [3, 4, 1, 2, 2, 3, 5];
  } else {
    // Default: month
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    visitsData = [500, 450, 600, 550];
    activeUsersData = [200, 180, 250, 230];
    notesData = [50, 40, 60, 55];
    qbData = [30, 25, 40, 35];
    pyqData = [20, 15, 25, 30];
  }

  const combinedData = labels.map((label, index) => ({
    name: label,
    visits: visitsData[index],
    activeUsers: activeUsersData[index],
    notes: notesData[index],
    qb: qbData[index],
    pyq: pyqData[index],
  }));

  const totalUsersData = [
    { name: "Students", value: 1250 },
    { name: "Faculty", value: 150 },
  ];

  return {
    timeData: combinedData,
    pieData: totalUsersData,
  };
};

// 3. Define colors for the Pie chart
const PIE_COLORS = ["#0088FE", "#00C49F"];

// --- Reusable Animated Tooltip ---
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

// 4. The Main Component (with Recharts)
const AdminHome = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [chartData, setChartData] = useState(getDummyData(timeFilter));

  // Update chart data when the filter changes
  useEffect(() => {
    setChartData(getDummyData(timeFilter));
  }, [timeFilter]);

  return (
    <div className="font-sans space-y-6">
      {/* Header and Filter (Unchanged) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Dashboard Analytics
        </h2>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="day">View: Today</option>
          <option value="week">View: This Week</option>
          <option value="month">View: This Month</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: User Visits */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0">User Visits</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData.timeData} 
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                animationDuration={1000} // <-- ADDED ANIMATION
              >
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
                <Legend />
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} dot={false} />
                <Area type="monotone" dataKey="visits" fill="url(#colorVisits)" stroke={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Active Users */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0">Active Users</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData.timeData} 
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                animationDuration={1000} // <-- ADDED ANIMATION
              >
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
                <Legend />
                <Line type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} dot={false} />
                <Area type="monotone" dataKey="activeUsers" fill="url(#colorUsers)" stroke={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Content Uploads (Bar) */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0">Content Uploads</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData.timeData} 
                margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                animationDuration={1000} // <-- ADDED ANIMATION
              >
                <defs>
                  <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.5}/>
                  </linearGradient>
                  <linearGradient id="colorQb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.5}/>
                  </linearGradient>
                  <linearGradient id="colorPyq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="notes" fill="url(#colorNotes)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qb" fill="url(#colorQb)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pyq" fill="url(#colorPyq)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Total Users (Doughnut) */}
        {/* --- MODIFIED FOR BETTER ALIGNMENT --- */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border h-80 flex flex-col">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex-shrink-0 text-center">Total User Distribution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="45%" // <-- Centered in its half
                  cy="50%" // <-- Vertically centered
                  innerRadius={65}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={3}
                  labelLine={false} // <-- Removed connector line
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                >
                  {chartData.pieData.map((entry, index) => (
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
                  verticalAlign="middle" // <-- Align legend vertically
                  layout="vertical"      // <-- In a vertical list
                  align="right"           // <-- Positioned to the right
                  wrapperStyle={{ paddingLeft: '10px' }} // Add padding
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