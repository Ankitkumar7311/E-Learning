import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import UploadQB from "../../modules/faculty/upload/UploadQB";
import UploadPYQ from "../../modules/faculty/upload/UploadPYQ";
import UploadNotes from "../../modules/faculty/upload/UploadNotes";
import UploadNewsEvents from "../../modules/faculty/upload/UploadNewsEvents";
import RequestReport from "../../modules/admin/RequestReport";
import CustomModal from "../../modules/faculty/common_modal/CustomModal";
import EditMaterial from "../../modules/admin/EditMaterial";

import profileImg from "../../assets/Group.png";
import requestImg from "../../assets/Star.png";

// Helper function to get auth details
const getAuthDetails = () => {
    try {
        const stored = JSON.parse(localStorage.getItem('vidyaSarthiAuth') || '{}');
        return {
            facultyId: stored?.facultyId || null,
            token: stored?.token || null,
        };
    } catch (e) {
        return { facultyId: null, token: null };
    }
};

const API_BASE = 'http://localhost:8080/VidyaSarthi/faculty'; // Base URL for the faculty APIs

// --- SVG Icons for Profile Status ---
const CheckIconSVG = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-7 h-7 text-white"
    >
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-7.5 14.25a.75.75 0 01-1.344-.108L4.173 13.913a.75.75 0 01.108-1.344l5.807-3.693 4.298-5.385a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);

const CrossIconSVG = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={3} 
        stroke="currentColor" 
        className="w-7 h-7 text-white"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// SVG ICON for Edit Material (Reusing from last update)
const EditIconSVG = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-7 h-7 text-[#1461FF]"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 17.03a1.875 1.875 0 01-.703.18L4.512 18.232a.75.75 0 01-.861-.861l1.026-5.328a1.875 1.875 0 01.18-.703l8.604-8.604z" />
    </svg>
);
// ------------------------------------

const ProfileRight = () => {
    const [modalContent, setModalContent] = useState(null);
    const [totalModules, setTotalModules] = useState('...'); 
    const [profileStatus, setProfileStatus] = useState(null); // NEW: State for profile status (true/false)
    const { facultyId, token } = getAuthDetails();
    let navigate = useNavigate();

    // --- Fetch Profile Status and Total Modules ---
    useEffect(() => {
        if (!facultyId || !token) {
            console.error("Faculty ID or Token missing.");
            setTotalModules('N/A');
            setProfileStatus(false); // Assume incomplete if details are missing
            return;
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // 1. Fetch Total Modules
        const fetchTotalModules = async () => {
            try {
                const response = await fetch(`${API_BASE}/totalModule/${facultyId}`, { headers });
                if (response.ok) {
                    const count = await response.json();
                    setTotalModules(String(count));
                } else {
                    setTotalModules('0');
                }
            } catch (error) {
                console.error("Error fetching total modules:", error);
                setTotalModules('0');
            }
        };

        // 2. Fetch Profile Status
        const fetchProfileStatus = async () => {
            try {
                const response = await fetch(`${API_BASE}/checkStatus/${facultyId}`, { headers });
                if (response.ok) {
                    const resultText = await response.text();
                    // Check if the response body matches the success message from your API
                    setProfileStatus(resultText.includes("Profile Completed"));
                } else {
                    setProfileStatus(false);
                }
            } catch (error) {
                console.error("Error fetching profile status:", error);
                setProfileStatus(false);
            }
        };

        fetchTotalModules();
        fetchProfileStatus();
    }, [facultyId, token]);
    // ------------------------------------------

    const features = [
        { 
            label: "Uploaded Module",
            content: totalModules, 
            type: 'count' 
        },
        {
            label: "Profile Status",
            content: profileStatus, // Pass status to the content field
            type: 'status-check' // New type for status icon rendering
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
        {
            title: "Upload News & Events",
            tag: "Events",
            component: <UploadNewsEvents />,
        },
    ];

    return (
        <>
            <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
                {/* Features Section */}
                <section className="h-32 bg-white shadow-md rounded-2xl flex justify-between items-center px-6">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center space-y-2 w-1/4 cursor-pointer"
                            onClick={() => {
                                if (item.path) navigate(item.path);
                            }}
                        >
                            <div className="bg-blue-100 rounded-full flex items-center justify-center w-14 h-14">
                                
                                {item.type === 'count' ? (
                                    // Uploaded Module Count
                                    <span className="text-xl font-semibold" style={{ color: '#1461FF' }}>
                                        {item.content}
                                    </span>
                                ) : item.type === 'status-check' ? (
                                    // Profile Status Icon
                                    <div className={`rounded-full w-10 h-10 flex items-center justify-center ${item.content ? 'bg-orange-500' : 'bg-red-500'}`}>
                                        {item.content ? <CheckIconSVG /> : <CrossIconSVG />}
                                    </div>
                                ) : item.type === 'edit-icon' ? (
                                    // Edit Material Icon
                                    <EditIconSVG />
                                ) : (
                                    // Other Image Icons
                                    <img src={item.img} alt={item.label} className="w-7 h-7" />
                                )}
                            </div>
                            <p className="text-sm font-medium text-gray-800">{item.label}</p>
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

            {/* Reusable Modal */}
            <CustomModal
                isOpen={!!modalContent}
                onClose={() => setModalContent(null)}
            >
                {modalContent}
            </CustomModal>
            <Outlet />
        </>
    );
};

export default ProfileRight;