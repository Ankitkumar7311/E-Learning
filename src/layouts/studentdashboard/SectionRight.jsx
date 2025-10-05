// src/components/SectionRight.jsx
import { useEffect, useState } from "react";
import uploadImg from "../../assets/10.png";
import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";
import editImg from "../../assets/10.png";
import { Link } from "react-router-dom";

import CustomModal from "../../modules/faculty/common_modal/CustomModal"; // reuse same modal
import FindNotes from "../../modules/student/find/FindNotes";
import FindPYQ from "../../modules/student/find/FindPYQ";
import FindQB from "../../modules/student/find/FindQB";
import AnnouncementsList from "../../modules/student/find/FindNewsEvents";
// 🌟 NEW IMPORT: Import the ComplainsList component 
import ComplainsList from "../../modules/student/find/ComplainsList";
// NOTE: I'm assuming the path "../../modules/student/find/ComplainsList" for this component.
// Adjust the path if your ComplainsList component is located elsewhere.

const API_BASE =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  "http://localhost:8080/VidyaSarthi";

// read studentId & token from localStorage (robust)
const getStoredStudentId = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.studentId) return parsed.studentId;
      if (parsed?.user?.studentId) return parsed.user.studentId;
    }
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.studentId || parsed?.userId || null;
  } catch (e) {
    console.warn("Failed to read studentId from localStorage", e);
    return null;
  }
};
const readToken = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch {
    return localStorage.getItem("token") || null;
  }
};

const IconCheck = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPending = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 6v6l4 2" stroke="#1B2767" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

let SectionRight = () => {
  const [modalContent, setModalContent] = useState(null);

  // current semester
  const [currentSemester, setCurrentSemester] = useState(null);
  const [loadingSemester, setLoadingSemester] = useState(false);
  const [semesterError, setSemesterError] = useState("");

  // profile status
  const [profileStatusLoading, setProfileStatusLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(null);
  const [profileStatusError, setProfileStatusError] = useState("");

  // uploaded materials count
  const [materialCount, setMaterialCount] = useState(null);
  const [loadingMaterialCount, setLoadingMaterialCount] = useState(false);
  const [materialCountError, setMaterialCountError] = useState("");

  const studentId = getStoredStudentId();
  const token = readToken();

  // 🌟 ADDED HELPER FUNCTION 🌟
  // helper to open complains modal when clicking the Registered Complains tile
  const onFeatureClick = (p) => {
    if (p === "Registered Complains") {
      setModalContent(<ComplainsList />);
    }
    // If you later need to handle other tiles here, add them with an else if.
  };
  // -----------------------------

  // fetch current semester (same logic as before)
  useEffect(() => {
    let cancelled = false;
    const fetchSemester = async () => {
      if (!studentId) {
        setSemesterError("No student ID");
        return;
      }
      setLoadingSemester(true);
      setSemesterError("");
      try {
        const url = `${API_BASE}/student/getCurrentSemester/${encodeURIComponent(studentId)}`;
        const res = await fetch(url, { method: "GET", headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Status ${res.status}`);
        }

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        let sem = null;
        if (contentType.includes("application/json")) {
          const j = await res.json();
          if (typeof j === "number") sem = j;
          else if (typeof j === "string" && /^\d+$/.test(j)) sem = Number(j);
          else if (j && (j.semester || j.currentSemester || j.data)) {
            sem = j.semester ?? j.currentSemester ?? j.data ?? null;
            if (typeof sem === "string" && /^\d+$/.test(sem)) sem = Number(sem);
          }
        } else {
          const text = await res.text();
          const trimmed = text.trim();
          if (/^\d+$/.test(trimmed)) sem = Number(trimmed);
        }

        if (!cancelled) {
          if (sem === null || sem === undefined || Number.isNaN(Number(sem))) {
            setSemesterError("No semester available");
            setCurrentSemester(null);
          } else {
            setCurrentSemester(Number(sem));
            setSemesterError("");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load current semester:", err);
          setSemesterError("Failed to load semester");
          setCurrentSemester(null);
        }
      } finally {
        if (!cancelled) setLoadingSemester(false);
      }
    };

    fetchSemester();
    return () => {
      cancelled = true;
    };
  }, [studentId, token]);

  // fetch profile status
  const fetchProfileStatus = async () => {
    if (!studentId) {
      setProfileStatusError("No student ID");
      setProfileComplete(null);
      return;
    }
    setProfileStatusLoading(true);
    setProfileStatusError("");
    try {
      const url = `${API_BASE}/student/checkStatus/${encodeURIComponent(studentId)}`;
      const res = await fetch(url, { method: "GET", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Status ${res.status}`);
      }
      const text = (await res.text()).trim();
      if (/^profile\s*completed$/i.test(text)) {
        setProfileComplete(true);
      } else if (/^profile\s*incomplete$/i.test(text)) {
        setProfileComplete(false);
      } else {
        try {
          const maybeJson = JSON.parse(text);
          if (typeof maybeJson === "boolean") setProfileComplete(maybeJson);
          else if (typeof maybeJson === "string") setProfileComplete(/^profile\s*completed$/i.test(maybeJson));
          else if (maybeJson && (maybeJson.profileComplete === true || maybeJson.complete === true || (typeof maybeJson.status === "string" && /COMPLETE/i.test(maybeJson.status)))) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }
        } catch {
          setProfileComplete(false);
        }
      }
    } catch (err) {
      console.error("Failed to check profile status:", err);
      setProfileStatusError("Failed to check profile status");
      setProfileComplete(null);
    } finally {
      setProfileStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, token]);

  // fetch total material count
  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      setLoadingMaterialCount(true);
      setMaterialCountError("");
      try {
        const url = `${API_BASE}/student/getTotalMaterial`;
        const res = await fetch(url, { method: "GET", headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Status ${res.status}`);
        }

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        let cnt = null;
        if (contentType.includes("application/json")) {
          const j = await res.json();
          // if server returns { count: 4 } or number or string
          if (typeof j === "number") cnt = j;
          else if (typeof j === "string" && /^\d+$/.test(j)) cnt = Number(j);
          else if (j && (j.count || j.total || j.data)) {
            const v = j.count ?? j.total ?? j.data;
            if (typeof v === "number") cnt = v;
            else if (typeof v === "string" && /^\d+$/.test(v)) cnt = Number(v);
          }
        } else {
          const text = await res.text();
          const trimmed = text.trim();
          if (/^\d+$/.test(trimmed)) cnt = Number(trimmed);
        }

        if (!cancelled) {
          if (cnt === null || cnt === undefined || Number.isNaN(cnt)) {
            setMaterialCountError("N/A");
            setMaterialCount(null);
          } else {
            setMaterialCount(cnt);
            setMaterialCountError("");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load material count:", err);
          setMaterialCountError("Failed to load");
          setMaterialCount(null);
        }
      } finally {
        if (!cancelled) setLoadingMaterialCount(false);
      }
    };

    fetchCount();
    return () => { cancelled = true; };
  }, [studentId, token]);

  const features = [
    { key: "semester", p: "Current Semester", route: "" },
    { key: "profile", p: "Profile Status", route: "" },
    { key: "complains", p: "Registered Complains", route: "" },
    { key: "materials", p: "Uploaded Material", route: "/student/documents" },
    // 🌟 ADDED Registered Complains feature 🌟

  ];

  const uploads = [
    { title: "Faculty Provide QB", label: "QB", component: <FindQB /> },
    { title: "Notes", label: "Notes", component: <FindNotes /> },
    { title: "PYQ", label: "PYQ", component: <FindPYQ /> },
    { title: "News & Events", label: "Events", component: <AnnouncementsList /> },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-8">
        {/* section 1 */}
        <section id="section1" className="w-full bg-white shadow-md rounded-2xl flex flex-wrap justify-center items-center p-4 gap-2 sm:gap-4">
          {features.map((item, idx) => {
            // choose wrapper: Link for route tiles, plain div for others
            const content = (
              <>
                {/* Semester tile */}
                {item.key === "semester" && (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-14 h-14 bg-blue-100">
                      <div style={{ width: 56, height: 56, borderRadius: 9999 }} className="flex items-center justify-center">
                        {loadingSemester ? (
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                        ) : semesterError ? (
                          <div className="text-xs text-red-600">—</div>
                        ) : (
                          <div
                            className="text-center font-extrabold"
                            style={{
                              fontSize: 22,
                              lineHeight: 1,
                              color: "#1461FF",
                              background: "linear-gradient(180deg,#1461FF 0%, #1B2767 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {currentSemester ?? "—"}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words mt-1">{item.p}</p>
                  </div>
                )}

                {/* Profile status tile */}
                {item.key === "profile" && (
                  <div className="flex flex-col items-center cursor-pointer" onClick={fetchProfileStatus}>
                    <div className="rounded-full flex items-center justify-center w-14 h-14 bg-blue-100">
                      <div style={{ width: 40, height: 40, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: profileComplete ? "#F59E0B" : "#F3F4F6", boxShadow: profileComplete ? "0 2px 6px rgba(245,158,11,0.3)" : "none" }}>
                        {profileStatusLoading ? (
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : profileComplete ? (
                          <IconCheck className="h-5 w-5" />
                        ) : (
                          <IconPending className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words mt-1">Profile Status</p>
                    <div className="text-[11px] mt-1">
                      {profileStatusLoading ? (
                        <span className="text-gray-500">Checking...</span>
                      ) : profileComplete === true ? (
                        <span className="text-green-600">Complete</span>
                      ) : profileComplete === false ? (
                        <span className="text-yellow-600">Incomplete</span>
                      ) : (
                        <span className="text-red-500">{profileStatusError || "Unknown"}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment or other default tiles (including Complains) */}
                {(item.key === "payment" || item.key === "complains") && (
                  <>
                    <div className="bg-blue-100 rounded-full flex items-center justify-center w-14 h-14">
                      <img src={requestImg} alt={item.p} className="w-7 h-7" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words">{item.p}</p>
                  </>
                )}

                {/* Uploaded Material tile (shows count) */}
                {item.key === "materials" && (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-14 h-14 bg-blue-100">
                      <div style={{ width: 56, height: 56, borderRadius: 9999 }} className="flex items-center justify-center">
                        {loadingMaterialCount ? (
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                        ) : materialCountError ? (
                          <div className="text-xs text-red-600">—</div>
                        ) : (
                          <div
                            className="text-center font-extrabold"
                            style={{
                              fontSize: 22,
                              lineHeight: 1,
                              color: "#1461FF",
                              background: "linear-gradient(180deg,#1461FF 0%, #1B2767 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {typeof materialCount === "number" ? materialCount : "—"}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words mt-1">{item.p}</p>
                  </div>
                )}
              </>
            );

            // Determine the appropriate wrapper and click handler
            const wrapperProps = {};
            if (item.route) {
              // Tile that navigates (e.g., Uploaded Material)
              return (
                <Link key={item.key} to={item.route} className="flex flex-col items-center space-y-2 w-24 cursor-pointer min-w-0">
                  {content}
                </Link>
              );
            } else if (item.key === "complains") {
              // Tile that opens the modal (Registered Complains)
              wrapperProps.onClick = () => onFeatureClick(item.p);
            } else if (item.key === "profile") {
              // Profile tile already has an onClick inside its content logic
            }

            // Default div container (used for semester, profile, payment, complains)
            return (
              <div key={item.key} className="flex flex-col items-center space-y-2 w-24 cursor-pointer min-w-0" {...wrapperProps}>
                {content}
              </div>
            );
          })}
        </section>

        {/* section 2 */}
        <section id="section2" className="w-full rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
          {uploads.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md min-h-[140px] flex flex-col items-center justify-center p-2 min-w-0 cursor-pointer hover:shadow-lg transition"
              onClick={() => setModalContent(item.component)}
            >
              <div className="bg-blue-100 rounded-lg w-full h-full flex flex-col items-center justify-center text-center p-2">
                <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent break-words">
                  {item.title}
                </p>
              </div>
              <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">{item.label}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Reusable Modal */}
      <CustomModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent}
      </CustomModal>
    </>
  );
};

export default SectionRight;