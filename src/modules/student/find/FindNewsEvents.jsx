import React, { useEffect, useMemo, useState } from "react";

// --- START: SVG Icon Components for a Cleaner UI ---
const IconRefresh = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696a8.25 8.25 0 00-11.664 0l-3.181 3.183" /></svg>
);
const IconX = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
// --- END: Icon Components ---

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/VidyaSarthi';

// Helper functions (readToken, formatDateTime) remain the same
const readToken = () => {
    try {
        const vs = localStorage.getItem("vidyaSarthiAuth");
        if (vs) {
            const parsed = JSON.parse(vs || "{}");
            if (parsed?.token) return parsed.token;
        }
        return localStorage.getItem("token") || null;
    } catch (e) {
        return localStorage.getItem("token") || null;
    }
};

const formatDateTime = (iso) => {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
        return iso;
    }
};

const defaultPageSizes = [5, 10, 20];

// --- START: Refactored UI Sub-components ---

// A more attractive card to display each announcement
const AnnouncementCard = ({ announcement, onView }) => (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    announcement.type?.toLowerCase() === 'notice' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                    {announcement.type || "Announcement"}
                </span>
                <span className="text-xs text-gray-500">
                    Faculty: {announcement.facultyId || "N/A"}
                </span>
            </div>
            <p className="text-gray-800 leading-relaxed line-clamp-2" title={announcement.describeEvents}>
                {announcement.describeEvents || "No description provided."}
            </p>
        </div>
        <div className="w-full sm:w-auto flex flex-col items-start sm:items-end flex-shrink-0 mt-2 sm:mt-0 sm:ml-4">
            <span className="text-xs text-gray-500 mb-2">{formatDateTime(announcement.publishDateTime)}</span>
            <button
                onClick={() => onView(announcement)}
                className="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition-colors"
            >
                View Details
            </button>
        </div>
    </div>
);

// A modal with a cleaner design
const ViewModal = ({ announcement, onClose }) => (
    // MODIFIED: Added overflow-y-auto to the backdrop to allow page scrolling for very long content
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 py-8 overflow-y-auto animate-fade-in">
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden transform animate-slide-up">
            <header className="flex items-start justify-between p-4 border-b">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.type || "Announcement"}</h3>
                    <div className="text-xs text-gray-500">Published: {formatDateTime(announcement.publishDateTime)}</div>
                    <div className="text-xs text-gray-500">Faculty: {announcement.facultyId || "—"}</div>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><IconX className="w-6 h-6 text-gray-600" /></button>
            </header>
            {/* MODIFIED: Removed max-h-[60vh] and overflow-y-auto to let the content define the height */}
            <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Description</h4>
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{announcement.describeEvents || "—"}</div>
            </div>
            <footer className="p-4 bg-gray-50 border-t flex justify-end">
                <button onClick={onClose} className="px-4 py-2 rounded-md border bg-white hover:bg-gray-100 font-semibold text-gray-700">Close</button>
            </footer>
        </div>
    </div>
);

// --- END: Refactored UI Sub-components ---


const AnnouncementsList = () => {
    // All state and logic hooks (useState, useMemo, useEffect) remain the same
    const token = readToken();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [textFilter, setTextFilter] = useState("");
    const [startFilter, setStartFilter] = useState("");
    const [endFilter, setEndFilter] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [openAnnouncement, setOpenAnnouncement] = useState(null);
    const [sortNewestFirst, setSortNewestFirst] = useState(true);

    const fetchAnnouncements = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/student/getAnnouncement`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            const data = await res.json();
            setAnnouncements(Array.isArray(data) ? data : []);
            setPage(1);
        } catch (err) {
            setError(err.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnnouncements() }, []);

    const startDate = useMemo(() => (startFilter ? new Date(startFilter) : null), [startFilter]);
    const endDate = useMemo(() => (endFilter ? new Date(endFilter) : null), [endFilter]);

    const filtered = useMemo(() => {
        let list = Array.isArray(announcements) ? [...announcements] : [];
        if (textFilter.trim()) {
            const q = textFilter.trim().toLowerCase();
            list = list.filter(a =>
                (a?.describeEvents || "").toLowerCase().includes(q) ||
                (a?.type || "").toLowerCase().includes(q) ||
                (a?.facultyId || "").toLowerCase().includes(q)
            );
        }
        if (selectedType !== "All") {
            const t = selectedType.toLowerCase();
            list = list.filter(a => (a?.type || "").toLowerCase() === t);
        }
        if (startDate || endDate) {
            list = list.filter(a => {
                if (!a?.publishDateTime) return false;
                const d = new Date(a.publishDateTime);
                if (startDate && d < startDate) return false;
                if (endDate && d > endDate) return false;
                return true;
            });
        }
        list.sort((x, y) => {
            const dx = x?.publishDateTime ? new Date(x.publishDateTime).getTime() : 0;
            const dy = y?.publishDateTime ? new Date(y.publishDateTime).getTime() : 0;
            return sortNewestFirst ? dy - dx : dx - dy;
        });
        return list;
    }, [announcements, textFilter, startDate, endDate, sortNewestFirst, selectedType]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const pageData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);
    
    const clearFilters = () => {
        setTextFilter("");
        setStartFilter("");
        setEndFilter("");
        setSelectedType("All");
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6  max-h-600vh">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Announcements & Notices</h1>
                <button
                    onClick={fetchAnnouncements}
                    className="mt-2 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 text-sm font-semibold text-gray-700"
                >
                    <IconRefresh /> Refresh
                </button>
            </header>

            {/* --- Filters --- */}
            <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <label className="text-sm font-medium block mb-1">Search</label>
                        <input type="search" value={textFilter} onChange={(e) => { setTextFilter(e.target.value); setPage(1); }} placeholder="Search by text, type, or faculty..." className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">Start Date</label>
                        <input type="datetime-local" value={startFilter} onChange={(e) => { setStartFilter(e.target.value); setPage(1); }} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">End Date</label>
                        <input type="datetime-local" value={endFilter} onChange={(e) => { setEndFilter(e.target.value); setPage(1); }} className="w-full p-2 border rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t">
                    <div>
                        <label className="text-sm font-medium mr-3">Filter by Type:</label>
                        <div className="inline-flex gap-2 rounded-md shadow-sm">
                            {["All", "Announcement", "Notice"].map((t) => (
                                <button key={t} onClick={() => { setSelectedType(t); setPage(1); }} className={`px-4 py-2 text-sm font-semibold first:rounded-l-md last:rounded-r-md border-y border-l last:border-r ${selectedType === t ? "bg-blue-600 text-white border-blue-600 z-10" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"}`} >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={clearFilters} className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-semibold hover:bg-red-200">Clear All Filters</button>
                </div>
            </div>

            {/* --- Main Content --- */}
            <main>
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                        Showing <strong>{pageData.length}</strong> of <strong>{total}</strong> results
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Sort:</label>
                        <button onClick={() => { setSortNewestFirst(true); }} className={`px-3 py-1 border rounded-md text-sm ${sortNewestFirst ? "bg-gray-800 text-white" : "bg-white"}`}>Newest</button>
                        <button onClick={() => { setSortNewestFirst(false); }} className={`px-3 py-1 border rounded-md text-sm ${!sortNewestFirst ? "bg-gray-800 text-white" : "bg-white"}`}>Oldest</button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
                ) : error ? (
                    <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>
                ) : total === 0 ? (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-lg">No announcements match your filters.</div>
                ) : (
                    <div className="space-y-4">
                        {pageData.map((a) => (
                            <AnnouncementCard key={a.id} announcement={a} onView={() => setOpenAnnouncement(a)} />
                        ))}
                    </div>
                )}

                {/* --- Pagination --- */}
                {total > pageSize && (
                    <div className="flex items-center justify-between mt-6 p-4 bg-white border rounded-lg">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-4 py-2 rounded-md border disabled:opacity-50 font-semibold">Previous</button>
                        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="px-4 py-2 rounded-md border disabled:opacity-50 font-semibold">Next</button>
                    </div>
                )}
            </main>

            {/* View modal */}
            {openAnnouncement && <ViewModal announcement={openAnnouncement} onClose={() => setOpenAnnouncement(null)} />}
        </div>
    );
};

export default AnnouncementsList;