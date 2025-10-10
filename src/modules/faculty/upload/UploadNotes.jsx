import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Inline icons
const UploadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5 12.5 32.8 12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64z" />
  </svg>
);
const TimesIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
    <path fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 4.7 55.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 4.7 411.3c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.3 456.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
  </svg>
);
const BinIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
    </svg>
);

// Message Modal
const MessageModal = ({ message, type = "success", onClose }) => {
  const bg = type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl border-l-4 p-4 shadow-xl max-w-sm w-full ${bg}`}>
        <div className="flex justify-between items-center">
          <p className="font-semibold">{type === "success" ? "Success!" : "Error!"}</p>
          <button onClick={onClose} className="text-xl font-bold hover:opacity-75">
            <TimesIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm">{message}</p>
      </div>
    </div>
  );
};

// Loading Overlay
const LoadingOverlay = ({ text = "Loading..." }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex flex-col items-center justify-center">
      <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-white text-lg font-semibold">{text}</p>
    </div>
);

// Resolve API base
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

// Helpers to read auth
const getFacultyIdFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      return parsed?.facultyId || null;
    }
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.facultyId || parsed?.userId || null;
  } catch (e) { console.error('Error reading facultyId from localStorage', e); return null; }
};
const getTokenFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem('token') || null;
  } catch (e) { console.error('Error reading token from localStorage', e); return null; }
};

// Unique ID generator
const generateUniqueId = () => `material-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

const UploadNotes = () => {
  const navigate = useNavigate();

  // State
  const [regulations, setRegulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState({ regulations: false, subjects: false });
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState({ open: false, message: "", isError: false });
  
  const createInitialUnit = () => ({ id: Date.now() + Math.random(), subject: "", file: null });

  const [formData, setFormData] = useState({
    selectedRegulation: null,
    selectedBranch: "",
    selectedSemester: "",
  });

  const [units, setUnits] = useState([createInitialUnit(), createInitialUnit()]);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRefs = useRef({});

  const token = getTokenFromLocalStorage();
  const storedFacultyId = getFacultyIdFromLocalStorage();

  // Fetch regulations
  useEffect(() => {
    let cancelled = false;
    const fetchRegulations = async () => {
      setLoading(s => ({ ...s, regulations: true }));
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/faculty/getRegulationList`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Failed to load regulations (${res.status})`);
        const data = await res.json();
        const mapped = (data?.regulations ? Object.values(data.regulations) : Array.isArray(data) ? data : []).map((r, idx) => ({
            regulationId: r.regulationId ?? r.id ?? String(idx),
            display: r.name ?? r.display ?? String(r),
        }));
        if (!cancelled) setRegulations(mapped);
      } catch (err) {
        if (!cancelled) setError(err.message || "Network error fetching regulations.");
      } finally {
        if (!cancelled) setLoading(s => ({ ...s, regulations: false }));
      }
    };
    fetchRegulations();
    return () => { cancelled = true; };
  }, [token]);

  // Fetch subjects
  useEffect(() => {
    const { selectedRegulation, selectedBranch, selectedSemester } = formData;
    if (!selectedRegulation || !selectedBranch || !selectedSemester) {
      setSubjects([]);
      return;
    }

    let cancelled = false;
    const fetchSubjects = async () => {
      setLoading(s => ({ ...s, subjects: true }));
      setError(null);
      setSubjects([]);
      try {
        const dto = { regulationId: selectedRegulation.regulationId, semester: Number(selectedSemester), branch: selectedBranch };
        const res = await fetch(`${API_BASE}/faculty/getNewSubjectList`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(dto),
        });
        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);
        const result = await res.json();
        const list = (result?.subject ? Object.entries(result.subject).map(([code, name]) => ({ subjectCode: code, subjectName: name })) : Array.isArray(result) ? result.map(s => ({ subjectCode: s.subjectCode ?? s.code ?? s.id, subjectName: s.subjectName ?? s.name })) : []);
        if (!cancelled) setSubjects(list);
      } catch (err) {
        if (!cancelled) setError(err.message || "Network error fetching subjects.");
      } finally {
        if (!cancelled) setLoading(s => ({ ...s, subjects: false }));
      }
    };
    fetchSubjects();
    return () => { cancelled = true; };
  }, [formData.selectedRegulation, formData.selectedBranch, formData.selectedSemester, token]);
  
  // Form handlers
  const resetUnits = () => {
    setUnits([createInitialUnit(), createInitialUnit()]);
    Object.values(fileInputRefs.current).forEach(input => {
        if (input) try { input.value = ""; } catch (_) {}
    });
  }

  const handleSelectionChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value, ...(field === 'selectedRegulation' && { selectedBranch: '', selectedSemester: '' }), ...(field === 'selectedBranch' && { selectedSemester: '' }) }));
    resetUnits();
  };

  const handleRegulationChange = (e) => {
    const id = e.target.value;
    const selected = regulations.find(r => r.regulationId === id) || null;
    handleSelectionChange('selectedRegulation', selected);
  };

  const handleUnitChange = (id, field, value) => {
    setUnits(prevUnits => prevUnits.map(unit => unit.id === id ? { ...unit, [field]: value } : unit));
  };
  
  const addUnit = () => setUnits(prev => [...prev, createInitialUnit()]);
  const removeUnit = (id) => setUnits(prev => prev.filter(unit => unit.id !== id));

  // Resolve facultyId
  const resolveFacultyId = useCallback(async () => {
    let facultyId = storedFacultyId;
    if (facultyId) return facultyId;
    try {
      const vsRaw = localStorage.getItem('vidyaSarthiAuth');
      let email = null;
      if (vsRaw) {
        const parsed = JSON.parse(vsRaw || '{}');
        email = parsed?.user?.email || parsed?.email || null;
      } else {
        const uRaw = localStorage.getItem('user');
        if (uRaw) {
          try { const p = JSON.parse(uRaw); email = p?.email || null; } catch (_) { }
        }
      }
      if (!email) return null;
      const res = await fetch(`${API_BASE}/faculty/getFacultyId`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { console.warn('getFacultyId returned', res.status); return null; }
      const payload = await res.json();
      facultyId = payload?.facultyId || payload?.facultyID || payload?.facultyid || null;
      if (facultyId) {
        try {
          const key = 'vidyaSarthiAuth';
          const existingRaw = localStorage.getItem(key);
          if (existingRaw) {
            const existing = JSON.parse(existingRaw || '{}');
            localStorage.setItem(key, JSON.stringify({ ...existing, facultyId }));
          }
        } catch (e) { console.warn('Failed to persist facultyId locally', e); }
      }
      return facultyId;
    } catch (err) { console.warn('Failed to resolve facultyId', err); return null; }
  }, [storedFacultyId, token]);

  // Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmission({ open: false, message: "", isError: false });
    setError(null);

    if (!formData.selectedRegulation || !formData.selectedBranch || !formData.selectedSemester) {
      setSubmission({ open: true, message: "Please select regulation, branch, and semester.", isError: true });
      return;
    }
    const facultyId = await resolveFacultyId();
    if (!facultyId) {
      setSubmission({ open: true, message: "Faculty ID not found. Please login again.", isError: true });
      return;
    }
    if (!token) {
      setSubmission({ open: true, message: "Auth token missing. Please login again.", isError: true });
      return;
    }

    const uploadUnits = units.filter(u => u.file && u.subject);
    if (uploadUnits.length === 0) {
      setSubmission({ open: true, message: "Please select at least one subject and upload a file.", isError: true });
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    const failed = [];

    for (const unit of uploadUnits) {
      const fd = new FormData();
      fd.append("materialId", generateUniqueId());
      fd.append("subjectCode", unit.subject);
      fd.append("facultyId", facultyId);
      fd.append("regulationId", formData.selectedRegulation.regulationId);
      fd.append("pdf", unit.file);
      fd.append("pdfName", unit.file?.name || "");

      try {
        const resp = await fetch(`${API_BASE}/faculty/addNewNotes`, {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd,
        });
        if (resp.ok) {
          successCount++;
        } else {
          let reason = `HTTP ${resp.status}`;
          try { reason = await resp.text(); } catch (_) {}
          failed.push({ subjectCode: unit.subject, reason });
        }
      } catch (err) {
        failed.push({ subjectCode: unit.subject, reason: err.message || "Network error" });
      }
    }

    setIsUploading(false);

    if (successCount > 0 && failed.length === 0) {
      setSubmission({ open: true, message: `Successfully uploaded ${successCount} notes!`, isError: false });
      resetUnits();
    } else if (successCount > 0) {
      setSubmission({ open: true, message: `Uploaded ${successCount}, but ${failed.length} failed. Check console.`, isError: true });
      console.warn("Failed uploads:", failed);
    } else {
      setSubmission({ open: true, message: "All uploads failed. Check server logs.", isError: true });
      console.warn("All uploads failed:", failed);
    }
  }, [formData, units, resolveFacultyId, token]);

  const closeSubmission = () => setSubmission({ open: false, message: "", isError: false });

  // Render Info
  const BRANCHES = ["CSE", "CIVIL", "EEE"];
  const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
  const showUploadSection = formData.selectedRegulation && formData.selectedBranch && formData.selectedSemester;

  return (
    <div>
      {(loading.regulations || isUploading) && (
        <LoadingOverlay
          text={isUploading ? "Uploading Files..." : "Loading Data..."}
        />
      )}
      {submission.open && <MessageModal message={submission.message} type={submission.isError ? "error" : "success"} onClose={closeSubmission} />}

      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3 text-blue-800">Upload Notes & Materials</h2>
      <p className="text-gray-500 mb-4">Faculty ID: <strong>{storedFacultyId || "N/A"}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Selection Section --- */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label htmlFor="regulation-select" className="font-semibold text-black-800 text-lg md:text-xl flex-shrink-0">
            Regulation:
            </label>
            <select
              id="regulation-select"
              value={formData.selectedRegulation?.regulationId || ""}
              onChange={handleRegulationChange}
              disabled={loading.regulations}
              className="flex-1 w-full p-3 rounded-xl border border-blue-300 bg-white shadow-inner focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">{loading.regulations ? "Loading..." : "-- Select Regulation --"}</option>
              {regulations.map(reg => <option key={reg.regulationId} value={reg.regulationId}>{reg.display}</option>)}
            </select>
          </div>
          {/* Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block font-semibold text-black-800 mb-2">Branch</label>
              <select
                value={formData.selectedBranch}
                onChange={(e) => handleSelectionChange('selectedBranch', e.target.value)}
                disabled={!formData.selectedRegulation}
                className="w-full p-3 rounded-xl border border-blue-300 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          {/* Semester */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block font-semibold text-black-800 mb-2">Semester</label>
              <select
                value={formData.selectedSemester}
                onChange={(e) => handleSelectionChange('selectedSemester', e.target.value)}
                disabled={!formData.selectedBranch}
                className="w-full p-3 rounded-xl border border-blue-300 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Semester --</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- Dynamic Unit Upload Section --- */}
        {showUploadSection && (
          <div className="pt-4 px-1 md:px-4">
            <label className="block text-xl font-semibold mb-4 text-gray-700">
              Subject Materials Uploads
              {loading.subjects && <span className="text-sm ml-2 text-gray-500">(Loading Subjects...)</span>}
            </label>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="flex flex-col gap-5">
              {units.map((unit, index) => (
                <div key={unit.id} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Unit {index + 1}. Subject:</label>
                            <select
                                value={unit.subject}
                                onChange={(e) => handleUnitChange(unit.id, 'subject', e.target.value)}
                                disabled={loading.subjects}
                                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                            >
                                <option value="">{loading.subjects ? "Loading..." : (subjects.length === 0 ? "No Subjects Found" : "Select Subject")}</option>
                                {subjects.map((sub) => (
                                    <option key={sub.subjectCode} value={sub.subjectCode}>
                                        {sub.subjectName ?? sub.name ?? sub.subjectCode}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                className={`flex items-center gap-2 cursor-pointer text-gray-800 px-4 py-2.5 rounded-lg shadow-md w-full justify-center transition bg-yellow-400 hover:bg-yellow-500`}
                                htmlFor={`file-input-${unit.id}`}
                            >
                                <UploadIcon className="h-5 w-5" />
                                <span className="text-base font-medium">{unit.file ? "Change File" : "Upload PDF/Doc"}</span>
                                <input
                                    id={`file-input-${unit.id}`}
                                    ref={(el) => (fileInputRefs.current[unit.id] = el)}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => handleUnitChange(unit.id, 'file', e.target.files[0] || null)}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="pt-2 flex justify-between items-center min-h-[40px]">
                        {unit.file ? (
                            <div className="text-sm text-gray-800 truncate bg-gray-100 p-2 rounded-lg border border-gray-200 font-mono flex-1 min-w-0">
                                <span className="font-semibold">File:</span> <span className="truncate">{unit.file.name}</span>
                            </div>
                        ) : ( <span className="text-sm text-gray-400 p-2">No file selected.</span> )}
                        {units.length > 2 && (
                            <button type="button" onClick={() => removeUnit(unit.id)} className="ml-4 p-2 rounded-full text-gray-500 hover:bg-yellow-200 hover:text-yellow-700 transition-colors">
                               <BinIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <button type="button" onClick={addUnit} className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-6 rounded-lg transition">
                  + Add Unit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Submit Button --- */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isUploading || !showUploadSection}
            className={`font-extrabold text-white px-12 py-3 rounded-full shadow-lg transition duration-300 ease-in-out w-full md:w-auto
              ${isUploading || !showUploadSection ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:scale-105"}`}
          >
            {isUploading ? "Uploading..." : "Submit Notes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNotes;