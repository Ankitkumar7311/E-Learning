import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, FileStack, FileQuestion, NotebookPen } from 'lucide-react';

import requestImg from "../../assets/Star.png";
import CustomModal from "../../modules/faculty/common_modal/CustomModal";
import FindNotes from "../../modules/student/find/FindNotes";
import FindPYQ from "../../modules/student/find/FindPYQ";
import FindQB from "../../modules/student/find/FindQB";
import AnnouncementsList from "../../modules/student/find/FindNewsEvents";
import ComplainsList from "../../modules/student/find/ComplainsList";

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

const CompletedBadge = ({ className = "" }) => (
  <div className={`rounded-full w-12 h-12 flex items-center justify-center shadow-sm ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#10B981" />
      <path d="M7.5 12.5l2.5 2.5L16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const IncompleteBadge = ({ className = "" }) => (
  <div className={`rounded-full w-12 h-12 flex items-center justify-center shadow-sm ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#F59E0B" />
      <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

let SectionRight = () => {
  const [modalContent, setModalContent] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [loadingSemester, setLoadingSemester] = useState(false);
  const [semesterError, setSemesterError] = useState("");
  const [profileStatusLoading, setProfileStatusLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(null);
  const [profileStatusError, setProfileStatusError] = useState("");
  const [materialCount, setMaterialCount] = useState(null);
  const [loadingMaterialCount, setLoadingMaterialCount] = useState(false);
  const [materialCountError, setMaterialCountError] = useState("");

  const studentId = getStoredStudentId();
  const token = readToken();

  const onFeatureClick = (p) => {
    if (p === "Registered Complains") {
      setModalContent(<ComplainsList />);
    }
  };

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
        if (!res.ok) throw new Error(`Status ${res.status}`);
        
        const text = await res.text();
        const sem = parseInt(text.trim(), 10);

        if (!cancelled) {
          if (Number.isNaN(sem)) {
            setSemesterError("Not available");
            setCurrentSemester(null);
          } else {
            setCurrentSemester(sem);
            setSemesterError("");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load current semester:", err);
          setSemesterError("Failed to load");
          setCurrentSemester(null);
        }
      } finally {
        if (!cancelled) setLoadingSemester(false);
      }
    };
    fetchSemester();
    return () => { cancelled = true; };
  }, [studentId, token]);

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
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const text = (await res.text()).trim();
      setProfileComplete(/profile\s*completed/i.test(text));
    } catch (err) {
      console.error("Failed to check profile status:", err);
      setProfileStatusError("Failed to check");
      setProfileComplete(null);
    } finally {
      setProfileStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStatus();
  }, [studentId, token]);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      setLoadingMaterialCount(true);
      setMaterialCountError("");
      try {
        const url = `${API_BASE}/student/getTotalMaterial`;
        const res = await fetch(url, { method: "GET", headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const text = await res.text();
        const cnt = parseInt(text.trim(), 10);
        
        if (!cancelled) {
          if (Number.isNaN(cnt)) {
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
    { key: "semester", p: "Current Semester" },
    { key: "profile", p: "Profile Status" },
    { key: "complains", p: "Registered Complains" },
    { key: "materials", p: "Uploaded Material" },
  ];

  const uploads = [
    { title: "Question Bank", tag: "Find Question Banks", component: <FindQB />, icon: <FileStack className="w-7 h-7" />, color: "bg-teal-100 text-teal-700", hoverColor: "hover:border-teal-300 hover:bg-teal-50" },
    { title: "Notes", tag: "Find Study Notes & PDFs", component: <FindNotes />, icon: <NotebookPen className="w-7 h-7" />, color: "bg-blue-100 text-blue-700", hoverColor: "hover:border-blue-300 hover:bg-blue-50" },
    { title: "PYQ", tag: "Find Past Year Questions", component: <FindPYQ />, icon: <FileQuestion className="w-7 h-7" />, color: "bg-amber-100 text-amber-700", hoverColor: "hover:border-amber-300 hover:bg-amber-50" },
    { title: "News & Events", tag: "Announcements & News", component: <AnnouncementsList />, icon: <Megaphone className="w-7 h-7" />, color: "bg-purple-100 text-purple-700", hoverColor: "hover:border-purple-300 hover:bg-purple-50" },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Dashboard Overview</h2>
        
        <section id="section1" className="w-full bg-white shadow-md rounded-2xl grid grid-cols-2 gap-4 md:flex md:h-32 md:justify-around md:items-center p-4">
          {features.map((item) => {
            const content = (
              <>
                {item.key === "semester" && (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-14 h-14 bg-blue-100">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center">
                        {loadingSemester ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                        ) : semesterError ? (
                          <div className="text-xs text-red-600">—</div>
                        ) : (
                          <div className="text-2xl font-extrabold bg-gradient-to-b from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent">
                            {currentSemester ?? "—"}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words mt-1">{item.p}</p>
                  </div>
                )}

                {item.key === "profile" && (
                  <div className="flex flex-col items-center cursor-pointer">
                    <div className={`rounded-full flex items-center justify-center w-14 h-14 bg-white/20`}>
                      {profileStatusLoading ? (
                        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                      ) : profileComplete ? (
                        <CompletedBadge className="bg-white" />
                      ) : (
                        <IncompleteBadge className="bg-white" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words mt-1">Profile Status</p>
                    <div className="text-[11px] mt-1 h-4">
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

                {item.key === "complains" && (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-14 h-14 bg-purple-100">
                      <img src={requestImg} alt={item.p} className="w-7 h-7" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 text-center break-words mt-1">{item.p}</p>
                  </div>
                )}

                {item.key === "materials" && (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-14 h-14 bg-green-100">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center">
                        {loadingMaterialCount ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500" />
                        ) : materialCountError ? (
                          <div className="text-xs text-red-600">—</div>
                        ) : (
                          <div className="text-2xl font-extrabold bg-gradient-to-b from-[#10B981] to-[#047857] bg-clip-text text-transparent">
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

            const commonClasses = "flex flex-col items-center space-y-2 cursor-pointer min-w-0";
            
            const clickHandler = item.key === 'complains' ? () => onFeatureClick(item.p) : item.key === 'profile' ? fetchProfileStatus : undefined;

            return (
              <div key={item.key} className={commonClasses} onClick={clickHandler}>
                {content}
              </div>
            );
          })}
        </section>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 px-2">Quick Actions</h2>

        <section id="section2" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {uploads.map((item, index) => (
            <div
              key={index}
              className={`group relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 cursor-pointer ${item.hoverColor}`}
              onClick={() => setModalContent(item.component)}
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{item.title}</p>
                <p className="text-sm text-gray-500 truncate">{item.tag}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <CustomModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent}
      </CustomModal>
    </>
  );
};

export default SectionRight;