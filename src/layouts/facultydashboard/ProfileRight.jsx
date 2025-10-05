import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import UploadQB from "../../modules/faculty/upload/UploadQB";
import UploadPYQ from "../../modules/faculty/upload/UploadPYQ";
import UploadNotes from "../../modules/faculty/upload/UploadNotes";
import UploadNewsEvents from "../../modules/faculty/upload/UploadNewsEvents";
import CustomModal from "../../modules/faculty/common_modal/CustomModal";

import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";

// SVGs (kept same as your original for other icons)
const CheckIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-7.5 14.25a.75.75 0 01-1.344-.108L4.173 13.913a.75.75 0 01.108-1.344l5.807-3.693 4.298-5.385a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
);
const CrossIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const EditIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#1461FF]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 17.03a1.875 1.875 0 01-.703.18L4.512 18.232a.75.75 0 01-.861-.861l1.026-5.328a1.875 1.875 0 01.18-.703l8.604-8.604z" />
  </svg>
);

// NEW: nicer completed/incomplete badges (bigger, distinct, accessible)
const CompletedBadge = ({ className = "" }) => (
  <div className={`rounded-full w-12 h-12 flex items-center justify-center shadow-sm ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#10B981" /> {/* green circle */}
      <path d="M7.5 12.5l2.5 2.5L16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const IncompleteBadge = ({ className = "" }) => (
  <div className={`rounded-full w-12 h-12 flex items-center justify-center shadow-sm ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#EF4444" /> {/* red circle */}
      <path d="M8 12h8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v1.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// API base
const API_BASE = 'http://localhost:8080/VidyaSarthi/faculty';

// Helpers: resilient localStorage reading (supports both vidyaSarthiAuth and user/token keys)
const getAuthFromLocalStorage = () => {
  try {
    // prefer vidyaSarthiAuth if present
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      return { facultyId: parsed?.facultyId || null, token: parsed?.token || null };
    }

    // fallback to previously used keys
    const userRaw = localStorage.getItem('user');
    const token = localStorage.getItem('token') || null;
    if (userRaw) {
      try {
        const parsedUser = JSON.parse(userRaw);
        return { facultyId: parsedUser?.facultyId || parsedUser?.userId || null, token };
      } catch {
        return { facultyId: null, token };
      }
    }

    // nothing found
    return { facultyId: null, token: null };
  } catch (e) {
    console.error('Error reading auth from localStorage', e);
    return { facultyId: null, token: null };
  }
};

const ProfileRight = () => {
  const [modalContent, setModalContent] = useState(null);
  const [totalModules, setTotalModules] = useState('...');
  const [profileStatus, setProfileStatus] = useState(null); // boolean: true = completed
  const navigate = useNavigate();

  const { facultyId, token } = getAuthFromLocalStorage();

  useEffect(() => {
    if (!facultyId || !token) {
      console.warn('Faculty ID or token missing in ProfileRight');
      setTotalModules('N/A');
      setProfileStatus(false);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 1) total modules
    const fetchTotalModules = async () => {
      try {
        const res = await fetch(`${API_BASE}/totalModule/${encodeURIComponent(facultyId)}`, { headers });
        if (!res.ok) {
          console.warn('totalModule responded with', res.status);
          setTotalModules('0');
          return;
        }
        const count = await res.json();
        setTotalModules(String(count ?? 0));
      } catch (err) {
        console.error('Error fetching totalModule:', err);
        setTotalModules('0');
      }
    };

    // 2) profile status
    const fetchProfileStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/checkStatus/${encodeURIComponent(facultyId)}`, { headers });
        if (!res.ok) {
          setProfileStatus(false);
          return;
        }

        // Attempt JSON first (some APIs return {"completed": true} or boolean)
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const json = await res.json();
          // possible shapes: true / { completed: true } / { status: 'Profile Completed' }
          if (json === true) {
            setProfileStatus(true);
            return;
          }
          if (json === false) {
            setProfileStatus(false);
            return;
          }
          if (typeof json === 'object') {
            if (json.completed === true || json.profileCompleted === true || json.status === 'COMPLETED' || (typeof json.message === 'string' && json.message.includes('Profile Completed'))) {
              setProfileStatus(true);
              return;
            }
            setProfileStatus(false);
            return;
          }
        }

        // If not JSON, read as text and infer
        const text = await res.text();
        setProfileStatus(String(text).toLowerCase().includes('profile completed') || String(text).toLowerCase().includes('completed'));
      } catch (err) {
        console.error('Error fetching profile status:', err);
        setProfileStatus(false);
      }
    };

    fetchTotalModules();
    fetchProfileStatus();
  }, [facultyId, token]);

  const features = [
    {
      label: "Uploaded Module",
      content: totalModules,
      type: 'count',
      // clicking goes to edit-material list; we pass facultyId so edit page can use it if needed
      onClick: () => navigate('/teacher/edit-material', { state: { facultyId } })
    },
    {
      label: "Profile Status",
      content: profileStatus, // boolean
      type: 'status-check',
      onClick: () => navigate('/teacher/profile') // adjust route if your app uses a different path for profile edit/view
    },
    {
      img: requestImg,
      label: "Request/Report",
      path: "/teacher/request-report",
      type: 'image'
    },
    {
      label: "Edit Material",
      path: "/teacher/edit-material",
      type: 'edit-icon'
    },
  ];

  const uploads = [
    { title: "Upload PYQ", tag: "PYQ", component: <UploadPYQ /> },
    { title: "Upload Notes", tag: "Notes", component: <UploadNotes /> },
    { title: "Upload QB", tag: "QB", component: <UploadQB /> },
    { title: "Upload News & Events", tag: "Events", component: <UploadNewsEvents /> },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* Features */}
        <section className="h-32 bg-white shadow-md rounded-2xl flex justify-between items-center px-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 w-1/4 cursor-pointer"
              onClick={() => {
                if (typeof item.onClick === 'function') return item.onClick();
                if (item.path) return navigate(item.path);
              }}
            >
              <div className="bg-blue-100 rounded-full flex items-center justify-center w-14 h-14">
                {item.type === 'count' ? (
                  <span className="text-xl font-semibold" style={{ color: '#1461FF' }}>
                    {item.content}
                  </span>
                ) : item.type === 'status-check' ? (
                  // NEW: show nicer badges for status (completed vs incomplete)
                  item.content ? (
                    <CompletedBadge />
                  ) : (
                    <IncompleteBadge />
                  )
                ) : item.type === 'edit-icon' ? (
                  <EditIconSVG />
                ) : (
                  <img src={item.img} alt={item.label} className="w-7 h-7" />
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                {/* hint removed as requested */}
              </div>
            </div>
          ))}
        </section>

        {/* Upload Section */}
        <section className="grid grid-cols-2 gap-4 mt-5">
          {uploads.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center py-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setModalContent(item.component)}
            >
              <div className="bg-blue-100 rounded-lg w-full h-20 flex flex-col items-center justify-center">
                <p className="text-[15px] font-bold bg-gradient-to-r from-[#1461FF] to-[#1B2767] bg-clip-text text-transparent">
                  {item.title}
                </p>
              </div>
              <p className="text-green-600 text-[13px] mt-2">{item.tag}</p>
            </div>
          ))}
        </section>
      </div>

      <CustomModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent}
      </CustomModal>

      <Outlet />
    </>
  );
};

export default ProfileRight;
