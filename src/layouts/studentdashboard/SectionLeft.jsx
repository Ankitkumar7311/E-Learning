import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- START: SVG Icon Components ---
const IconEdit = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"></path></svg>
);
const IconUserCircle = ({ className = "w-20 h-20" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
);
const IconIdCard = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3c0 .35.07.69.18 1H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM9 4h6a1 1 0 0 1 1 1 1 1 0 0 1-1 1H9a1 1 0 0 1-1-1 1 1 0 0 1 1-1zm6 11h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z"/></svg>
);
const IconEmail = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM4 6h16v2H4V6zm16 12H4v-8h16v8z"/></svg>
);
const IconPhone = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.92 19.82c-.38.08-.76.18-1.15.18-3.12 0-6.1-1.25-8.29-3.43S4 10.39 4 7.27c0-.39.1-.77.18-1.15L5.5 8.16l1.23-1.23L4.69 4.88C3.82 5.92 3.27 7.21 3.27 8.5c0 4.14 2.58 7.85 6.25 9.24.4.15.82.26 1.25.26 1.29 0 2.58-.55 3.62-1.42l-2.04-2.04-1.23 1.23zM19.82 17.92l1.23-1.23-2.04-2.04c-.95.87-2.24 1.42-3.62 1.42-.43 0-.85-.11-1.25-.26C11.15 14.42 8.58 10.71 8.58 6.5c0-1.29.55-2.58 1.42-3.62L8 8.16 6.84 5.5l2.04-1.32C9.92 3.82 10.96 3 12.23 3c3.12 0 6.1 1.25 8.29 3.43S24 12.61 24 15.73c0 .39-.1.77-.18 1.15z"/></svg>
);
// --- END: SVG Icon Components ---

const defaultProfileImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYTBiYiI+PHBhdGggZD0iTTEyIDJDNi44OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuMzMgMC00LjMyLTEuMDYtNS42OC0yLjc4LjIzLS44MS45NC0xLjQ1IDEuODctMS44MSAxLjA1LS40MiAyLjIzLS42NiAzLjQxLS42Ni44MyAwIDEuNjIuMTUgMi4zMy40My43OC4yOCAxLjQyLjc0IDEuODQgMS4zMy4zOC41My41NyAxLjE1LjU3IDEuNzggMCAuNDYtLjEgLjg5LS4yOSAxLjI5LS4xOS40LS40My43NC0uNzIgMS4wMi0uMjkuMjgtLjYzLjUtMSAuNjZzLS43NS4yNC0xLjE0LjI0eiIvPjwvc3ZnPg==";


const API_BASE = "http://localhost:8080/VidyaSarthi";

const getAuthFromLocalStorage = () => {
    // This function remains the same
    try {
        const token = localStorage.getItem("token") || null;
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            try {
                const u = JSON.parse(userRaw);
                return { studentId: u?.studentId || u?.userId || null, token };
            } catch { /* ignore parse error */ }
        }
        const vsRaw = localStorage.getItem("vidyaSarthiAuth");
        if (vsRaw) {
            try {
                const p = JSON.parse(vsRaw || "{}");
                return { studentId: p?.studentId || null, token: p?.token || token };
            } catch { /* ignore parse error */ }
        }
        return { studentId: null, token };
    } catch (err) {
        console.error("Auth read error", err);
        return { studentId: null, token: null };
    }
};

const SectionLeft = () => {
    const navigate = useNavigate();
    const { studentId: storedStudentId, token } = getAuthFromLocalStorage();

    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Data fetching logic remains the same
        let active = true;
        const fetchStudent = async () => {
            setLoading(true);
            setError("");
            if (!storedStudentId) {
                setError("Student ID not found in local storage.");
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${API_BASE}/searchByStudentId/${encodeURIComponent(storedStudentId)}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
                const data = await res.json();
                if (active) {
                    if (!data || Object.keys(data).length === 0) {
                        setStudent(null);
                    } else {
                        setStudent(data);
                        // Process imageData
                        const img = data.imageData;
                        if (img && typeof img === "string") {
                            setImageSrc(img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`);
                        } else if (img && Array.isArray(img)) {
                            const blob = new Blob([new Uint8Array(img)]);
                            const reader = new FileReader();
                            reader.onload = () => { if (active) setImageSrc(reader.result); };
                            reader.readAsDataURL(blob);
                        } else {
                            setImageSrc(null);
                        }
                    }
                }
            } catch (err) {
                if (active) setError("Failed to load student details.");
                console.error("Error fetching student:", err);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchStudent();
        return () => { active = false; };
    }, [storedStudentId, token]);

    const handleEdit = () => {
        navigate("/update-profile-student", { state: { studentId: student?.studentId } });
    };

    // --- RENDER STATES ---

    if (loading) {
        return <ProfileCardSkeleton />;
    }

    if (error || !student) {
        return <ErrorCard error={error} navigate={navigate} />;
    }
    
    return <ProfileCard student={student} imageSrc={imageSrc} handleEdit={handleEdit} />;
};

// --- START: UI Components for different states ---

const ProfileCardShell = ({ children, className = "" }) => (
    // CHANGE: Removed lg:h-[500px] to allow height to be automatic
    <div className={`w-full max-w-md mx-auto lg:w-[400px] ${className}`}>
        <div className="bg-white rounded-2xl shadow-xl w-full h-full flex flex-col overflow-hidden transition-all duration-300">
            {children}
        </div>
    </div>
);

const ProfileCardSkeleton = () => (
    <ProfileCardShell>
        <div className="p-6 animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="flex justify-center -mt-16">
                <div className="w-28 h-28 bg-gray-300 rounded-full border-4 border-white"></div>
            </div>
            <div className="space-y-3 mt-6">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
            </div>
            <div className="mt-8 space-y-4">
                <div className="h-5 bg-gray-200 rounded-md w-full"></div>
                <div className="h-5 bg-gray-200 rounded-md w-full"></div>
                <div className="h-5 bg-gray-200 rounded-md w-5/6"></div>
                <div className="h-5 bg-gray-200 rounded-md w-4/6"></div>
            </div>
            <div className="mt-auto pt-8">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    </ProfileCardShell>
);

const ErrorCard = ({ error, navigate }) => (
    <ProfileCardShell>
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <IconUserCircle className="w-24 h-24 text-gray-300 mb-4" />
            <h4 className="font-bold text-gray-800 text-xl">Profile Not Found</h4>
            <p className="text-gray-500 text-sm mt-2 mb-8">{error || "No student details are available."}</p>
            <button
                onClick={() => navigate("/update-profile-student")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-400/50 transform hover:-translate-y-1"
            >
                <IconEdit /> Create Profile
            </button>
        </div>
    </ProfileCardShell>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-indigo-500 mt-0.5">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm md:text-base text-gray-800 break-words">{value || "N/A"}</p>
        </div>
    </div>
);

const ProfileCard = ({ student, imageSrc, handleEdit }) => {
    const { name, studentId, branch, year, phone, email, regulation } = student;
    const displayName = name || studentId || "Student";

    return (
        <ProfileCardShell>
            {/* --- Header Section --- */}
            <div className="relative">
                <div className="h-28  rounded-t-2xl "></div>
                <div className="absolute top-14 left-1/2 -translate-x-1/2">
                    <img
                        src={imageSrc || defaultProfileImage}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => { e.currentTarget.src = defaultProfileImage; }}
                    />
                </div>
            </div>

            {/* --- Info Section --- */}
            {/* CHANGE: Removed overflow-y-auto to prevent scrollbar */}
            <div className="flex-grow pt-20 p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900">{displayName}</h3>
                <p className="text-sm text-gray-500">{branch || "Branch not specified"} - {year || "N/A"}</p>

                <div className="border-t border-gray-200 my-5"></div>

                <div className="text-left space-y-4">
                    <DetailItem icon={<IconIdCard />} label="Roll Number / Regulation" value={`${studentId || "N/A"} / ${regulation || "N/A"}`} />
                    <DetailItem icon={<IconEmail />} label="Email Address" value={email} />
                    <DetailItem icon={<IconPhone />} label="Phone Number" value={phone} />
                </div>
            </div>

            {/* --- Footer Button --- */}
            <div className="p-6 mt-auto border-t border-gray-100">
                <button
                    onClick={handleEdit}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:-translate-y-1"
                >
                    <IconEdit /> Edit Profile
                </button>
            </div>
        </ProfileCardShell>
    );
};

export default SectionLeft;