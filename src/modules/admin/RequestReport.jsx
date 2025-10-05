import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SVG Icons for buttons ---
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

// Resolve API base (CRA / Vite / fallback)
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
    ? process.env.REACT_APP_API_BASE
    : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
        ? import.meta.env.VITE_API_BASE
        : 'http://localhost:8080/VidyaSarthi';

// Helpers to read token / facultyId from localStorage (same approach as your working component)
const getFacultyIdFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem('user');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return parsed?.facultyId || parsed?.userId || null;
    } catch (e) {
        console.error('Error parsing user from localStorage', e);
        return null;
    }
};

const getTokenFromLocalStorage = () => {
    try {
        return localStorage.getItem('token') || null;
    } catch (e) {
        console.error('Error getting token from localStorage', e);
        return null;
    }
};

const RequestReport = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const facultyId = getFacultyIdFromLocalStorage();

    const fetchComplaints = useCallback(async () => {
        if (!facultyId) {
            setError('Faculty ID not found. Please log in again.');
            setLoading(false);
            return;
        }

        const token = getTokenFromLocalStorage();
        if (!token) {
            setError('Authorization token not found. Please log in again.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/faculty/getAllComplains/${encodeURIComponent(facultyId)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                let msg = `Failed to fetch complaints. Status: ${res.status}`;
                try {
                    const j = await res.json();
                    if (j && j.message) msg = j.message;
                } catch (_) { }
                throw new Error(msg);
            }

            const data = await res.json();

            const sorted = (data || []).sort((a, b) => {
                if (a.complainStatus === 'ACTION_REQUIRED') return -1;
                if (b.complainStatus === 'ACTION_REQUIRED') return 1;
                return 0;
            });

            setComplaints(sorted);
        } catch (err) {
            console.error('Error fetching complaints:', err);
            setError(err.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    }, [facultyId]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const handleUpdateStatus = async (complainId, newStatus) => {
        const token = getTokenFromLocalStorage();
        if (!token) {
            alert('Authorization token missing. Please login again.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/faculty/updateComplainStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: complainId, updatedStatus: newStatus })
            });

            if (!res.ok) {
                let msg = `Failed to update status. Server returned ${res.status}`;
                try {
                    const j = await res.json();
                    if (j && j.message) msg = j.message;
                } catch (_) { }
                throw new Error(msg);
            }

            // Refresh list after update
            fetchComplaints();
        } catch (err) {
            console.error('Error updating status:', err);
            alert(err.message || 'Failed to update status');
        }
    };

    const handleEdit = (complain) => {
        const selectedMaterialName = complain.pdfName || complain.filename || complain.materialId || 'N/A';
        navigate(`/teacher/edit-material/${encodeURIComponent(complain.materialId)}`, {
            state: { selectedMaterialName }
        });
    };

    const renderStatus = (status) => {
        let colorClass = 'bg-gray-200 text-gray-800';
        if (status === 'ACTION_REQUIRED') colorClass = 'bg-yellow-200 text-yellow-800 animate-pulse';
        if (status === 'ACTION_TAKEN') colorClass = 'bg-green-200 text-green-800';
        if (status === 'REJECTED') colorClass = 'bg-red-200 text-red-800';

        return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClass}`}>
                {String(status).replace('_', ' ')}
            </span>
        );
    };

    if (loading) return <div className="text-center p-8">Loading complaints...</div>;
    if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Complaints Dashboard</h1>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-100 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">S.N.</th>
                                <th className="px-6 py-3">Student ID</th>
                                <th className="px-6 py-3">Module Code</th>
                                <th className="px-6 py-3 min-w-[300px]">Comment</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Resolve</th>
                                <th className="px-6 py-3 text-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.length > 0 ? complaints.map((complain, index) => {
                                const isActionRequired = complain.complainStatus === 'ACTION_REQUIRED';
                                return (
                                    <tr key={complain.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4">{complain.studentId}</td>
                                        <td className="px-6 py-4">{complain.materialId}</td>
                                        <td className="px-6 py-4">{complain.comment}</td>
                                        <td className="px-6 py-4 text-center">{renderStatus(complain.complainStatus)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(complain.id, 'ACTION_TAKEN')}
                                                    className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Mark as Action Taken"
                                                    disabled={!isActionRequired}
                                                >
                                                    <CheckIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(complain.id, 'REJECTED')}
                                                    className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Reject Complain"
                                                    disabled={!isActionRequired}
                                                >
                                                    <XIcon />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleEdit(complain)}
                                                className="flex items-center justify-center mx-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                disabled={!isActionRequired}
                                            >
                                                <EditIcon />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">No complaints found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequestReport;
