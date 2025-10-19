// import React, { useState } from "react";
// import { useAuth } from "../../auth/AuthContext"; // Make sure this path is correct

// // --- Reusable Helper Components & Configuration ---

// const API_BASE_URL = 'http://localhost:8080/VidyaSarthi';

// const readToken = () => {
//   try {
//     const vs = localStorage.getItem("vidyaSarthiAuth");
//     if (vs) {
//       const parsed = JSON.parse(vs || "{}");
//       if (parsed?.token) return parsed.token;
//     }
//     return localStorage.getItem("token") || null;
//   } catch (e) {
//     console.warn("readToken error:", e);
//     return localStorage.getItem("token") || null;
//   }
// };

// const Modal = ({ message, type = "error", onClose }) => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
//         <div className={`relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 border-l-4 ${type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
//             <h3 className={`text-lg font-semibold ${type === 'error' ? 'text-red-700' : 'text-green-700'}`}>{type === 'error' ? 'Error' : 'Success'}</h3>
//             <p className="mt-2 text-sm text-gray-600">{message}</p>
//             <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">&times;</button>
//         </div>
//     </div>
// );

// const ProfileCard = ({ data, type, onClose }) => {
//     const isStudent = type === 'student';
//     const profileImage = data.imageData ? `data:image/jpeg;base64,${data.imageData}` : 'https://via.placeholder.com/150';

//     return (
//         <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn" onClick={e => e.stopPropagation()}>
//                 <div className="p-6">
//                     <div className="flex flex-col items-center text-center">
//                         <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover" />
//                         <h2 className="mt-4 text-2xl font-bold text-gray-800">{data.name}</h2>
//                         <p className="text-sm text-gray-500">{isStudent ? data.studentId : data.facultyId}</p>
//                         <p className="mt-1 font-semibold text-blue-600">{isStudent ? data.branch : data.designation}</p>
//                     </div>
//                     <div className="mt-6 border-t border-gray-200 pt-4 space-y-3 text-sm">
//                         <div className="flex justify-between"><span className="font-semibold text-gray-600">Email:</span> <span className="text-gray-800">{data.email}</span></div>
//                         <div className="flex justify-between"><span className="font-semibold text-gray-600">Phone:</span> <span className="text-gray-800">{data.phone || 'N/A'}</span></div>
//                         <div className="flex justify-between text-left"><span className="font-semibold text-gray-600 pr-4">Address:</span> <span className="text-gray-800">{data.address || 'N/A'}</span></div>
//                         {isStudent ? (
//                             <>
//                                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Year:</span> <span className="text-gray-800">{data.year}</span></div>
//                                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Semester:</span> <span className="text-gray-800">{data.semester}</span></div>
//                             </>
//                         ) : (
//                             <div className="text-left"><span className="font-semibold text-gray-600">Subjects:</span> <p className="text-gray-800 text-xs mt-1">{data.subjects?.map(s => s.name || s).join(', ') || 'N/A'}</p></div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- Main Search Dashboard Component ---

// const SearchStudents = () => {
//     const { token: contextToken } = useAuth() || {};
//     const token = contextToken || readToken();

//     // State
//     const [modal, setModal] = useState(null);
//     const [loading, setLoading] = useState({});

//     // Specific Search
//     const [searchType, setSearchType] = useState("student");
//     const [searchId, setSearchId] = useState("");
//     const [specificResult, setSpecificResult] = useState(null);

//     // List Search
//     const [students, setStudents] = useState([]);
//     const [faculty, setFaculty] = useState([]);
    
//     // --- API Handlers ---

//     const handleSpecificSearch = async () => {
//         if (!searchId.trim()) {
//             setModal({ type: 'error', message: 'Please enter an ID to search.' });
//             return;
//         }
//         setLoading({ ...loading, specific: true });
//         setSpecificResult(null);

//         const url = `${API_BASE_URL}/${searchType === 'student' ? 'searchByStudentId' : 'searchByFacultyId'}/${searchId}`;

//         try {
//             const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
//             if (!response.ok) throw new Error(`Could not find the ${searchType}. Please check the ID.`);
//             const data = await response.json();
//             setSpecificResult(data);
//         } catch (error) {
//             setModal({ type: 'error', message: error.message });
//         } finally {
//             setLoading({ ...loading, specific: false });
//         }
//     };
    
//     const handleFetchList = async (type) => {
//         setLoading({ ...loading, [type]: true });
//         if (type === 'students') setStudents([]); else setFaculty([]);

//         const url = `${API_BASE_URL}/${type === 'students' ? 'studentList' : 'getFacultyListWithSubject'}`;
        
//         try {
//             const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
//             if (!response.ok) throw new Error(`Failed to fetch ${type} list.`);
//             const data = await response.json();

//             if (type === 'students') setStudents(data); else setFaculty(data);
//         } catch (error) {
//             setModal({ type: 'error', message: error.message });
//         } finally {
//             setLoading({ ...loading, [type]: false });
//         }
//     };

//     // --- Render ---

//     const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50";
//     const buttonClass = (isLoading) => `px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;

//     return (
//         <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
//             {modal && <Modal message={modal.message} type={modal.type} onClose={() => setModal(null)} />}
//             {specificResult && <ProfileCard data={specificResult} type={searchType} onClose={() => setSpecificResult(null)} />}

//             <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl mx-auto p-6 space-y-8 border">
//                 {/* 1. Specific Search Section */}
//                 <div className="pb-4 border-b">
//                     <h2 className="text-xl font-semibold text-gray-800">Search for a Specific Profile</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-4">
//                         <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={inputClass}>
//                             <option value="student">Student</option>
//                             <option value="faculty">Faculty</option>
//                         </select>
//                         <input
//                             type="text"
//                             placeholder={`Enter ${searchType === 'student' ? 'Student' : 'Faculty'} ID`}
//                             value={searchId}
//                             onChange={(e) => setSearchId(e.target.value)}
//                             className={`md:col-span-2 ${inputClass}`} // ✅ FIX IS HERE
//                         />
//                         <button onClick={handleSpecificSearch} disabled={loading.specific} className={buttonClass(loading.specific)}>
//                             {loading.specific ? 'Searching...' : 'Search'}
//                         </button>
//                     </div>
//                 </div>

//                 {/* 2. List Sections */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
//                     {/* 2a. Student List */}
//                     <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                             <h3 className="text-lg font-medium text-gray-800">Student Master List</h3>
//                             <button onClick={() => handleFetchList('students')} disabled={loading.students} className={buttonClass(loading.students)}>
//                                 {loading.students ? 'Loading...' : 'Show All Students'}
//                             </button>
//                         </div>
//                         <div className="h-96 overflow-y-auto border rounded-lg">
//                             <table className="min-w-full text-sm">
//                                 <thead className="bg-blue-100 sticky top-0">
//                                     <tr>
//                                         {["ID", "Name", "Branch", "Year"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>)}
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y">
//                                     {students.map(s => (
//                                         <tr key={s.studentId} className="hover:bg-gray-50">
//                                             <td className="px-3 py-2 whitespace-nowrap">{s.studentId}</td>
//                                             <td className="px-3 py-2 whitespace-nowrap">{s.name}</td>
//                                             <td className="px-3 py-2 whitespace-nowrap">{s.branch}</td>
//                                             <td className="px-3 py-2 whitespace-nowrap">{s.year}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                              {students.length === 0 && <p className="text-center p-4 text-gray-500">{loading.students ? '' : 'No students to display.'}</p>}
//                         </div>
//                     </div>

//                     {/* 2b. Faculty List */}
//                     <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                             <h3 className="text-lg font-medium text-gray-800">Faculty Master List</h3>
//                             <button onClick={() => handleFetchList('faculty')} disabled={loading.faculty} className={buttonClass(loading.faculty)}>
//                                 {loading.faculty ? 'Loading...' : 'Show All Faculty'}
//                             </button>
//                         </div>
//                         <div className="h-96 overflow-y-auto border rounded-lg">
//                             <table className="min-w-full text-sm">
//                                 <thead className="bg-blue-100 sticky top-0">
//                                     <tr>
//                                         {["ID", "Name", "Designation", "Subjects"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>)}
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y">
//                                     {faculty.map(f => (
//                                         <tr key={f.facultyId} className="hover:bg-gray-50">
//                                             <td className="px-3 py-2 whitespace-nowrap">{f.facultyId}</td>
//                                             <td className="px-3 py-2 whitespace-nowrap">{f.name}</td>
//                                             <td className="px-3 py-2 whitespace-nowrap">{f.designation}</td>
//                                             <td className="px-3 py-2">{f.subjects?.join(', ') || 'N/A'}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             {faculty.length === 0 && <p className="text-center p-4 text-gray-500">{loading.faculty ? '' : 'No faculty to display.'}</p>}
//                         </div>
//                     </div>

//                 </div>
//             </div>
//             <style>{`.animate-fadeIn { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
//         </div>
//     );
// };

// export default SearchStudents;
import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext"; // Make sure this path is correct

// --- 1. CHART.JS IMPORTS ---
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// --- 2. PDF EXPORT IMPORTS (FIXED) ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- 1. IMPORT FIX

// --- REGISTER CHART.JS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Reusable Helper Components & Configuration ---

const API_BASE_URL = 'http://localhost:8080/VidyaSarthi';

const readToken = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    console.warn("readToken error:", e);
    return localStorage.getItem("token") || null;
  }
};

// --- 3. EXPORT HELPER FUNCTIONS ---

const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header];
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Exports data to a PDF file. (FIXED)
 */
const exportToPDF = (data, title, columnHeaders, dataKeys, filename) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  const doc = new jsPDF();
  doc.text(title, 14, 15);

  // --- 2. FUNCTION CALL FIX ---
  // Call autoTable as a function, passing 'doc' in
  autoTable(doc, { 
    head: [columnHeaders], 
    body: data.map(item => 
      dataKeys.map(key => item[key] || 'N/A')
    ),
    startY: 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 144, 255] },
  });

  doc.save(filename);
};


// --- MODAL & PROFILE COMPONENTS (UNCHANGED) ---

const Modal = ({ message, type = "error", onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-gradient-to-br from-yellow-100 to-blue-300 bg-opacity-60 backdrop-blur-sm">
        <div className={`relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 border-l-4 ${type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
            <h3 className={`text-lg font-semibold ${type === 'error' ? 'text-red-700' : 'text-green-700'}`}>{type === 'error' ? 'Error' : 'Success'}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">&times;</button>
        </div>
    </div>
);

const ProfileCard = ({ data, type, onClose }) => {
    const isStudent = type === 'student';
    const profileImage = data.imageData ? `data:image/jpeg;base64,${data.imageData}` : 'https://via.placeholder.com/150';

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4  bg-gradient-to-br from-yellow-100 to-blue-300 bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">{data.name}</h2>
                        <p className="text-sm text-gray-500">{isStudent ? data.studentId : data.facultyId}</p>
                        <p className="mt-1 font-semibold text-blue-600">{isStudent ? data.branch : data.designation}</p>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-4 space-y-3 text-sm">
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Email:</span> <span className="text-gray-800">{data.email}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Phone:</span> <span className="text-gray-800">{data.phone || 'N/A'}</span></div>
                        <div className="flex justify-between text-left"><span className="font-semibold text-gray-600 pr-4">Address:</span> <span className="text-gray-800">{data.address || 'N/A'}</span></div>
                        {isStudent ? (
                            <>
                                <div className="flex justify-between"><span className="font-semibold text-gray-600">Year:</span> <span className="text-gray-800">{data.year}</span></div>
                                <div className="flex justify-between"><span className="font-semibold text-gray-600">Semester:</span> <span className="text-gray-800">{data.semester}</span></div>
                            </>
                        ) : (
                            <div className="text-left"><span className="font-semibold text-gray-600">Subjects:</span> <p className="text-gray-800 text-xs mt-1">{data.subjects?.map(s => s.name || s).join(', ') || 'N/A'}</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsChart = ({ studentCount, facultyCount }) => {
  const data = {
    labels: ['Total Users'],
    datasets: [
      {
        label: 'Students',
        data: [studentCount],
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
      },
      {
        label: 'Faculty',
        data: [facultyCount],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'User Statistics' } },
    scales: { y: { beginAtZero: true } }
  };
  return <Bar options={options} data={data} />;
};

const StatsModal = ({ studentCount, facultyCount, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 to-blue-300 bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
      <h3 className="text-lg font-semibold text-gray-800">Admin Statistics</h3>
      <div className="my-4">
        <StatsChart studentCount={studentCount} facultyCount={facultyCount} />
      </div>
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
    </div>
  </div>
);


// --- Main Search Dashboard Component ---

const SearchStudents = () => {
    const { token: contextToken } = useAuth() || {};
    const token = contextToken || readToken();

    // State
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState({});
    const [searchType, setSearchType] = useState("student");
    const [searchId, setSearchId] = useState("");
    const [specificResult, setSpecificResult] = useState(null);
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [showStats, setShowStats] = useState(false);

    // --- API Handlers (UNCHANGED) ---

    const handleSpecificSearch = async () => {
        if (!searchId.trim()) {
            setModal({ type: 'error', message: 'Please enter an ID to search.' });
            return;
        }
        setLoading(prev => ({ ...prev, specific: true }));
        setSpecificResult(null);
        const url = `${API_BASE_URL}/${searchType === 'student' ? 'searchByStudentId' : 'searchByFacultyId'}/${searchId}`;
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`Could not find the ${searchType}. Please check the ID.`);
            const data = await response.json();
            setSpecificResult(data);
        } catch (error) {
            setModal({ type: 'error', message: error.message });
        } finally {
            setLoading(prev => ({ ...prev, specific: false }));
        }
    };
    
    const handleFetchList = async (type) => {
        setLoading(prev => ({ ...prev, [type]: true }));
        if (!showStats) {
            if (type === 'students') setStudents([]); else setFaculty([]);
        }
        const url = `${API_BASE_URL}/${type === 'students' ? 'studentList' : 'getFacultyListWithSubject'}`;
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`Failed to fetch ${type} list.`);
            const data = await response.json();
            if (type === 'students') setStudents(data); else setFaculty(data);
        } catch (error) {
            setModal({ type: 'error', message: error.message });
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleShowStats = async () => {
      setLoading(prev => ({ ...prev, stats: true }));
      if (students.length === 0) await handleFetchList('students');
      if (faculty.length === 0) await handleFetchList('faculty');
      setShowStats(true);
      setLoading(prev => ({ ...prev, stats: false }));
    };

    // --- 4. EXPORT HANDLERS (UNCHANGED) ---
    
    const handleStudentCSV = () => {
      const dataToExport = students.map(s => ({
        ID: s.studentId,
        Name: s.name,
        Email: s.email,
        Branch: s.branch,
        Year: s.year,
        Semester: s.semester
      }));
      exportToCSV(dataToExport, 'student_list.csv');
    };

    const handleStudentPDF = () => {
      exportToPDF(
        students,
        'Student Master List',
        ['ID', 'Name', 'Email', 'Branch', 'Year'],
        ['studentId', 'name', 'email', 'branch', 'year'],
        'student_list.pdf'
      );
    };

    const handleFacultyCSV = () => {
      const dataToExport = faculty.map(f => ({
        ID: f.facultyId,
        Name: f.name,
        Email: f.email,
        Designation: f.designation,
        Subjects: f.subjects?.join(' | ') || 'N/A'
      }));
      exportToCSV(dataToExport, 'faculty_list.csv');
    };

    const handleFacultyPDF = () => {
      const dataForPDF = faculty.map(f => ({
        ...f,
        subjects: f.subjects?.join(', ') || 'N/A'
      }));
      
      exportToPDF(
        dataForPDF,
        'Faculty Master List',
        ['ID', 'Name', 'Email', 'Designation', 'Subjects'],
        ['facultyId', 'name', 'email', 'designation', 'subjects'],
        'faculty_list.pdf'
      );
    };


    // --- Render ---

    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50";
    const buttonClass = (isLoading) => `px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;
    const statsButtonClass = (isLoading) => `px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;
    const exportButtonClass = (disabled) => `px-3 py-1 text-xs font-medium rounded-md shadow-sm transition-all ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`;


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
            {modal && <Modal message={modal.message} type={modal.type} onClose={() => setModal(null)} />}
            {specificResult && <ProfileCard data={specificResult} type={searchType} onClose={() => setSpecificResult(null)} />}
            {showStats && <StatsModal studentCount={students.length} facultyCount={faculty.length} onClose={() => setShowStats(false)} />}

            <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl mx-auto p-6 space-y-8 ">
                
                <div className="pb-4 border-b flex justify-between items-center">
                   <h2 className="text-xl font-semibold text-gray-800">Search Faculty & Student</h2>
                   <button onClick={handleShowStats} disabled={loading.stats} className={statsButtonClass(loading.stats)}>
                     {loading.stats ? 'Loading Data...' : 'Show Statistics'}
                   </button>
                </div>

                <div className="pb-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Search for a Specific Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-4">
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={inputClass}>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                        <input
                            type="text"
                            placeholder={`Enter ${searchType === 'student' ? 'Student' : 'Faculty'} ID`}
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className={`md:col-span-2 ${inputClass}`}
                        />
                        <button onClick={handleSpecificSearch} disabled={loading.specific} className={buttonClass(loading.specific)}>
                            {loading.specific ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* 2. List Sections (UNCHANGED) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Student List Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-800">Student Master List</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={handleStudentCSV} disabled={students.length === 0} className={exportButtonClass(students.length === 0)}>CSV</button>
                                <button onClick={handleStudentPDF} disabled={students.length === 0} className={exportButtonClass(students.length === 0)}>PDF</button>
                                <button onClick={() => handleFetchList('students')} disabled={loading.students} className={buttonClass(loading.students)}>
                                    {loading.students ? 'Loading...' : 'Show All'}
                                </button>
                            </div>
                        </div>
                        <div className="h-96 overflow-y-auto border rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead className="bg-blue-100 sticky top-0">
                                    <tr>
                                        {["ID", "Name", "Branch", "Year"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y">
                                    {students.map(s => (
                                        <tr key={s.studentId} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap">{s.studentId}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{s.name}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{s.branch}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{s.year}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {students.length === 0 && <p className="text-center p-4 text-gray-500">{loading.students ? '' : 'No students to display.'}</p>}
                        </div>
                    </div>

                    {/* Faculty List Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-800">Faculty Master List</h3>
                             <div className="flex items-center gap-2">
                                <button onClick={handleFacultyCSV} disabled={faculty.length === 0} className={exportButtonClass(faculty.length === 0)}>CSV</button>
                                <button onClick={handleFacultyPDF} disabled={faculty.length === 0} className={exportButtonClass(faculty.length === 0)}>PDF</button>
                                <button onClick={() => handleFetchList('faculty')} disabled={loading.faculty} className={buttonClass(loading.faculty)}>
                                    {loading.faculty ? 'Loading...' : 'Show All'}
                                </button>
                            </div>
                        </div>
                        <div className="h-96 overflow-y-auto border rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead className="bg-blue-100 sticky top-0">
                                    <tr>
                                        {["ID", "Name", "Designation", "Subjects"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y">
                                    {faculty.map(f => (
                                        <tr key={f.facultyId} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap">{f.facultyId}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{f.name}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{f.designation}</td>
                                            <td className="px-3 py-2">{f.subjects?.join(', ') || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {faculty.length === 0 && <p className="text-center p-4 text-gray-500">{loading.faculty ? '' : 'No faculty to display.'}</p>}
                        </div>
                    </div>

                </div>
            </div>
            <style>{`.animate-fadeIn { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
    );
};

export default SearchStudents;