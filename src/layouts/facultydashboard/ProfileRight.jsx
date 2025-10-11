import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import UploadQB from "../../modules/faculty/upload/UploadQB";
import UploadPYQ from "../../modules/faculty/upload/UploadPYQ";
import UploadNotes from "../../modules/faculty/upload/UploadNotes";
import UploadNewsEvents from "../../modules/faculty/upload/UploadNewsEvents";
import CustomModal from "../../modules/faculty/common_modal/CustomModal";

import requestImg from "../../assets/Star.png";

// ICONS
import { FileQuestion, NotebookPen, FileStack, Megaphone, ArrowRight } from 'lucide-react';

// SVGs
const EditIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#1461FF]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 17.03a1.875 1.875 0 01-.703.18L4.512 18.232a.75.75 0 01-.861-.861l1.026-5.328a1.875 1.875 0 01.18-.703l8.604-8.604z" />
  </svg>
);

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

// Helpers: resilient localStorage reading
const getAuthFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      return { facultyId: parsed?.facultyId || null, token: parsed?.token || null };
    }
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
    return { facultyId: null, token: null };
  } catch (e) {
    console.error('Error reading auth from localStorage', e);
    return { facultyId: null, token: null };
  }
};

const ProfileRight = () => {
  const [modalContent, setModalContent] = useState(null);
  const [totalModules, setTotalModules] = useState('...');
  const [profileStatus, setProfileStatus] = useState(null);
  const [requestCount, setRequestCount] = useState(null); // null = loading

  const navigate = useNavigate();
  const { facultyId, token } = getAuthFromLocalStorage();

  useEffect(() => {
    if (!facultyId || !token) {
      console.warn('Faculty ID or token missing in ProfileRight');
      setTotalModules('N/A');
      setProfileStatus(false);
      setRequestCount(0);
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    
    const fetchTotalModules = async () => {
      try {
        const res = await fetch(`${API_BASE}/totalModule/${encodeURIComponent(facultyId)}`, { headers });
        if (!res.ok) { setTotalModules('0'); return; }
        const count = await res.json();
        setTotalModules(String(count ?? 0));
      } catch (err) { setTotalModules('0'); }
    };
    
    const fetchProfileStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/checkStatus/${encodeURIComponent(facultyId)}`, { headers });
        if (!res.ok) { setProfileStatus(false); return; }
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const json = await res.json();
          setProfileStatus(json === true || json.completed === true || json.profileCompleted === true || json.status === 'COMPLETED' || (typeof json.message === 'string' && json.message.includes('Profile Completed')));
        } else {
          const text = await res.text();
          setProfileStatus(String(text).toLowerCase().includes('profile completed') || String(text).toLowerCase().includes('completed'));
        }
      } catch (err) { setProfileStatus(false); }
    };

    const fetchRequestCount = async () => {
      try {
        // IMPORTANT: Please verify this is the correct API endpoint for getting the request count
        const res = await fetch(`${API_BASE}/getRequestCount/${encodeURIComponent(facultyId)}`, { headers });
        if (!res.ok) {
          setRequestCount(0);
          return;
        }
        const data = await res.json();
        setRequestCount(data.count ?? data ?? 0);
      } catch (err) {
        console.error('Error fetching request count:', err);
        setRequestCount(0);
      }
    };

    fetchTotalModules();
    fetchProfileStatus();
    fetchRequestCount();

  }, [facultyId, token]);

  const features = [
    { label: "Uploaded Module", content: totalModules, type: 'count', onClick: () => navigate('#', { state: { facultyId } }) },
    { label: "Profile Status", content: profileStatus, type: 'status-check', onClick: () => navigate('#') },
    { img: requestImg, label: "Requests", path: "/teacher/request-report", type: 'image' },
    { label: "Edit Material", path: "/teacher/edit-material", type: 'edit-icon' },
  ];

  const uploads = [
    { title: "Upload PYQ", tag: "Past Year Questions", component: <UploadPYQ />, icon: <FileQuestion />, color: "bg-amber-100 text-amber-700", hoverColor: "hover:border-amber-300 hover:bg-amber-50" },
    { title: "Upload Notes", tag: "Study Material & PDFs", component: <UploadNotes />, icon: <NotebookPen />, color: "bg-blue-100 text-blue-700", hoverColor: "hover:border-blue-300 hover:bg-blue-50" },
    { title: "Upload QB", tag: "Question Banks", component: <UploadQB />, icon: <FileStack />, color: "bg-teal-100 text-teal-700", hoverColor: "hover:border-teal-300 hover:bg-teal-50" },
    { title: "Upload News & Events", tag: "Announcements", component: <UploadNewsEvents />, icon: <Megaphone />, color: "bg-purple-100 text-purple-700", hoverColor: "hover:border-purple-300 hover:bg-purple-50" },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Dashboard Overview</h2>
        
        <section className="bg-white shadow-md rounded-2xl p-4 grid grid-cols-2 gap-4 md:flex md:h-32 md:justify-around md:items-center">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 cursor-pointer" onClick={() => { if (typeof item.onClick === 'function') { item.onClick(); } else if (item.path) { navigate(item.path); } }}>
              <div className="relative bg-blue-100 rounded-full flex items-center justify-center w-14 h-14">
                {item.type === 'count' ? <span className="text-xl font-semibold" style={{ color: '#1461FF' }}>{item.content}</span> :
                 item.type === 'status-check' ? (item.content === null ? <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" /> : item.content ? <CompletedBadge /> : <IncompleteBadge />) :
                 item.type === 'edit-icon' ? <EditIconSVG /> : <img src={item.img} alt={item.label} className="w-7 h-7" />}

                {item.label === "Requests" && requestCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
                    {requestCount > 9 ? '9+' : requestCount}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
              </div>
            </div>
          ))}
        </section>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 px-2">Quick Actions</h2>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {uploads.map((item, index) => (
            <div
              key={index}
              className={`group relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 cursor-pointer ${item.hoverColor}`}
              onClick={() => setModalContent(item.component)}
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${item.color}`}>
                {React.cloneElement(item.icon, { className: "w-7 h-7" })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{item.title}</p>
                <p className="text-sm text-gray-500 truncate">{item.tag}</p>
              </div>
              <div className="text-gray-300 transform transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
                <ArrowRight className="w-6 h-6" />
              </div>
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