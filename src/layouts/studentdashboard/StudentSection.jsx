// src/modules/student/StudentSection.jsx

import React, { useState, useEffect } from "react";
import SectionLeft from "./SectionLeft";
import SectionRight from "./SectionRight";

// --- Logic moved up from SectionLeft ---
const API_BASE = "http://localhost:8080/VidyaSarthi";

// Helper to read authentication info from localStorage
const getAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token") || null;
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const u = JSON.parse(userRaw);
      return { studentId: u?.studentId || u?.userId || null, token };
    }
    const vsRaw = localStorage.getItem("vidyaSarthiAuth");
    if (vsRaw) {
      const p = JSON.parse(vsRaw || "{}");
      return { studentId: p?.studentId || null, token: p?.token || token };
    }
    return { studentId: null, token };
  } catch (err) {
    console.error("Auth read error", err);
    return { studentId: null, token: null };
  }
};

const StudentSection = () => {
  // State for student data, loading, and error is now in the parent
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const { studentId: storedStudentId, token } = getAuthFromLocalStorage();
    let active = true;

    const fetchStudent = async () => {
      if (!storedStudentId) {
        setError("Student ID not found in local storage.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/searchByStudentId/${encodeURIComponent(storedStudentId)}`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch student data (${res.status})`);
        }

        const data = await res.json();
        if (active) {
          setStudent(data && Object.keys(data).length > 0 ? data : null);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        if (active) setError("Failed to load student details.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStudent();

    return () => {
      active = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  // Determine the name to display based on the fetching state
  const displayName = loading ? "Loading..." : (student?.name || "Student");

  return (
    <main className="min-h-screen  bg-gray-50">
      {/* Welcome Message Section */}
      <div className="px-4 md:px-10 pt-8 pb-4 flex-shrink-0 bg-yellow-100">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {displayName}! 👋 
        </h1>
        <p className="mt-1 text-gray-600">Let's make today a great learning day.</p>
      </div>
      {/* Your Original Content Section */}
      <section className="h-auto md:h-full bg-white flex flex-col md:flex-row p-6 gap-6 rounded-lg shadow-sm">
        {/* Pass fetched data and state down to child components as props */}
        <SectionLeft student={student} loading={loading} error={error} />
        <SectionRight />
      </section>
    </main>
  );
};

export default StudentSection;