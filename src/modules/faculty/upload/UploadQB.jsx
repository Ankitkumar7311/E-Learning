// src/modules/faculty/upload/UploadQB.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Message modal (small, reused across upload components)
const MessageModal = ({ message, type = "success", onClose }) => {
  const bg = type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl border-l-4 p-4 shadow-xl max-w-sm w-full ${bg}`}>
        <div className="flex justify-between items-center">
          <p className="font-semibold">{type === "success" ? "Success!" : "Error!"}</p>
          <button onClick={onClose} className="text-xl font-bold hover:opacity-75">✕</button>
        </div>
        <p className="mt-2 text-sm break-words">{message}</p>
      </div>
    </div>
  );
};

// Small inline SVGs
const UploadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5 12.5 32.8 12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64z"/></svg>
);

// Resolve API base (CRA / Vite / fallback)
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

// helpers to read auth from localStorage (supports vidyaSarthiAuth or user/token)
const getFacultyIdFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      if (parsed?.facultyId) return parsed.facultyId;
      if (parsed?.user?.facultyId) return parsed.user.facultyId;
    }
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.facultyId || parsed?.userId || null;
  } catch (e) {
    console.error('Error reading facultyId from localStorage', e);
    return null;
  }
};
const getTokenFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem('token') || null;
  } catch (e) {
    console.error('Error reading token from localStorage', e);
    return null;
  }
};

// client-side unique id (optional)
const generateUniqueId = () => `qb-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

// Hard-coded branch & semester lists (can be changed)
const BRANCHES = ["CSE", "CIVIL", "EEE", "ECE"];
const SEMESTERS = [1,2,3,4,5,6,7,8];

const UploadQB = () => {
  // local state
  const [regulations, setRegulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState({ regulations: false, subjects: false, facultyId: false });
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    selectedRegulation: null,
    selectedBranch: "",
    selectedSemester: "",
    selectedSubjectCode: "",
    file: null,
  });

  const fileInputRef = useRef(null);
  const [submissionStatus, setSubmissionStatus] = useState({ open: false, message: "", isError: false });
  const [isUploading, setIsUploading] = useState(false);

  const token = getTokenFromLocalStorage();
  const storedFacultyId = getFacultyIdFromLocalStorage();

  // Fetch regulations on mount
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
        if (Array.isArray(data)) {
          const mapped = data.map(r => ({
            regulationId: r.regulationId ?? r.regulation ?? r.id ?? String(r),
            display: r.name ?? r.display ?? String(r),
            raw: r,
          }));
          if (!cancelled) setRegulations(mapped);
        } else {
          // fallback: if a wrapper was returned, try common fields
          console.warn("Unexpected regulations response:", data);
          if (!cancelled) setRegulations([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Network error fetching regulations.");
      } finally {
        if (!cancelled) setLoading(s => ({ ...s, regulations: false }));
      }
    };
    fetchRegulations();
    return () => { cancelled = true; };
  }, [token]);

  // Fetch subjects when regulation+branch+semester selected
  useEffect(() => {
    const reg = formData.selectedRegulation;
    const branch = formData.selectedBranch;
    const semester = formData.selectedSemester;
    if (!reg || !branch || !semester) {
      setSubjects([]);
      return;
    }

    let cancelled = false;
    const fetchSubjects = async () => {
      setLoading(s => ({ ...s, subjects: true }));
      setError(null);
      setSubjects([]);
      try {
        const dto = { regulationId: reg.regulationId, semester: Number(semester), branch };
        const res = await fetch(`${API_BASE}/faculty/getNewSubjectList`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(dto),
        });
        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);
        const result = await res.json();
        if (result && result.subject && typeof result.subject === "object") {
          const list = Object.entries(result.subject).map(([code, name]) => ({ subjectCode: code, subjectName: name }));
          if (!cancelled) setSubjects(list);
        } else if (Array.isArray(result)) {
          if (!cancelled) setSubjects(result.map(s => ({ subjectCode: s.subjectCode ?? s.code ?? s.id, subjectName: s.subjectName ?? s.name })));
        } else {
          if (!cancelled) setSubjects([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Network error fetching subjects.");
      } finally {
        if (!cancelled) setLoading(s => ({ ...s, subjects: false }));
      }
    };

    fetchSubjects();
    return () => { cancelled = true; };
  }, [formData.selectedRegulation?.regulationId, formData.selectedBranch, formData.selectedSemester, token]);

  // helper to resolve facultyId (use stored first; optional fallback to server by email)
  const resolveFacultyId = useCallback(async () => {
    if (storedFacultyId) return storedFacultyId;
    // attempt to find from vidyaSarthiAuth or user object
    try {
      const vsRaw = localStorage.getItem('vidyaSarthiAuth');
      let email = null;
      if (vsRaw) {
        const parsed = JSON.parse(vsRaw || '{}');
        email = parsed?.user?.email || parsed?.email || null;
      } else {
        const uRaw = localStorage.getItem('user');
        if (uRaw) {
          const p = JSON.parse(uRaw || '{}');
          email = p?.email || null;
        }
      }
      if (!email) return null;
      const res = await fetch(`${API_BASE}/faculty/getFacultyId`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) return null;
      const payload = await res.json();
      return payload?.facultyId || payload?.facultyID || payload?.facultyid || null;
    } catch (e) {
      console.warn("Could not resolve facultyId:", e);
      return null;
    }
  }, [storedFacultyId, token]);

  // handlers
  const resetFileAndSubject = useCallback(() => {
    setFormData(prev => ({ ...prev, selectedSubjectCode: "", file: null }));
    if (fileInputRef.current) {
      try { fileInputRef.current.value = ""; } catch (_) {}
    }
  }, []);

  const handleRegulationChange = useCallback((e) => {
    const id = e.target.value;
    const selected = regulations.find(r => r.regulationId === id) || null;
    setFormData(prev => ({ ...prev, selectedRegulation: selected, selectedBranch: "", selectedSemester: "" }));
    resetFileAndSubject();
  }, [regulations, resetFileAndSubject]);

  const handleBranchChange = useCallback((e) => {
    const branch = e.target.value;
    setFormData(prev => ({ ...prev, selectedBranch: branch, selectedSemester: "" }));
    resetFileAndSubject();
  }, [resetFileAndSubject]);

  const handleSemesterChange = useCallback((e) => {
    const sem = e.target.value;
    setFormData(prev => ({ ...prev, selectedSemester: sem }));
    resetFileAndSubject();
  }, [resetFileAndSubject]);

  const handleSubjectChange = useCallback((e) => {
    const code = e.target.value;
    setFormData(prev => ({ ...prev, selectedSubjectCode: code, file: null }));
    if (fileInputRef.current) {
      try { fileInputRef.current.value = ""; } catch (_) {}
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const f = e.target.files && e.target.files[0];
    setFormData(prev => ({ ...prev, file: f || null }));
  }, []);

  // submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmissionStatus({ open: false, message: "", isError: false });
    setError(null);

    const reg = formData.selectedRegulation;
    if (!reg || !formData.selectedBranch || !formData.selectedSemester) {
      setSubmissionStatus({ open: true, message: "Please select regulation, branch and semester.", isError: true });
      return;
    }

    if (!formData.selectedSubjectCode) {
      setSubmissionStatus({ open: true, message: "Please select a subject.", isError: true });
      return;
    }

    if (!formData.file) {
      setSubmissionStatus({ open: true, message: "Please choose a PDF file for the Question Bank.", isError: true });
      return;
    }

    const facultyId = await resolveFacultyId();
    if (!facultyId) {
      setSubmissionStatus({ open: true, message: "Faculty ID not found. Please login again.", isError: true });
      return;
    }
    if (!token) {
      setSubmissionStatus({ open: true, message: "Auth token missing. Please login again.", isError: true });
      return;
    }

    // validate file type
    if (!formData.file.type || !formData.file.type.includes("pdf")) {
      setSubmissionStatus({ open: true, message: "Only PDF files are accepted for Question Bank.", isError: true });
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("materialId", generateUniqueId());
      fd.append("subjectCode", formData.selectedSubjectCode);
      fd.append("facultyId", facultyId);
      fd.append("regulationId", reg.regulationId);
      fd.append("pdf", formData.file);
      fd.append("pdfName", `${formData.selectedSubjectCode}_QB_${formData.file.name || ""}`);

      const resp = await fetch(`${API_BASE}/faculty/addNewQB`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd, // browser sets appropriate multipart boundary
      });

      const text = await resp.text();
      if (resp.ok) {
        setSubmissionStatus({ open: true, message: text || `Uploaded QB for ${formData.selectedSubjectCode}`, isError: false });
        resetFileAndSubject();
      } else {
        console.error("Server error uploading QB:", text);
        setSubmissionStatus({ open: true, message: text || `Upload failed (${resp.status})`, isError: true });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setSubmissionStatus({ open: true, message: err.message || "Network error during upload.", isError: true });
    } finally {
      setIsUploading(false);
    }
  }, [formData, resolveFacultyId, token, resetFileAndSubject]);

  const closeMessage = () => setSubmissionStatus({ open: false, message: "", isError: false });

  // derived flags
  const isSubjectSectionEnabled = !!(formData.selectedRegulation && formData.selectedBranch && formData.selectedSemester && !loading.subjects);
  const isUploadEnabled = !!(isSubjectSectionEnabled && formData.selectedSubjectCode && formData.file && !isUploading);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
      {submissionStatus.open && (
        <MessageModal message={submissionStatus.message} type={submissionStatus.isError ? "error" : "success"} onClose={closeMessage} />
      )}

      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3 text-purple-700">Upload Question Bank (QB) per Subject</h2>
      <p className="text-gray-500 mb-6">Upload is associated with your Faculty ID: <strong>{storedFacultyId || "N/A"}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Regulation */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <label className="block font-semibold text-purple-700 mb-2">Choose Regulation:</label>
          <select
            name="regulation"
            value={formData.selectedRegulation?.regulationId || ""}
            onChange={handleRegulationChange}
            disabled={loading.regulations}
            className="w-full p-3 rounded-xl border border-purple-300 bg-white"
          >
            <option value="">{loading.regulations ? "Loading Regulations..." : "-- Select Regulation --"}</option>
            {regulations.map(r => <option key={r.regulationId} value={r.regulationId}>{r.display}</option>)}
          </select>
        </div>

        {/* Branch & Semester */}
        {formData.selectedRegulation && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-purple-50 rounded-lg">
              <label className="block font-semibold text-purple-700 mb-2">Branch</label>
              <select value={formData.selectedBranch} onChange={handleBranchChange} className="w-full p-3 rounded-xl border border-purple-300 bg-white">
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex-1 p-4 bg-purple-50 rounded-lg">
              <label className="block font-semibold text-purple-700 mb-2">Semester</label>
              <select value={formData.selectedSemester} onChange={handleSemesterChange} className="w-full p-3 rounded-xl border border-purple-300 bg-white">
                <option value="">-- Select Semester --</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Subject */}
        {isSubjectSectionEnabled && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <label className="block font-semibold text-purple-700 mb-2">
              Choose Subject
              {loading.subjects && <span className="text-sm ml-2 text-gray-500">(Loading Subjects...)</span>}
            </label>
            <select
              value={formData.selectedSubjectCode}
              onChange={handleSubjectChange}
              disabled={!isSubjectSectionEnabled || loading.subjects || subjects.length === 0}
              className="w-full p-3 rounded-xl border border-purple-300 bg-white"
            >
              <option value="">{loading.subjects ? "Loading..." : (subjects.length === 0 ? "No Subjects Found" : "-- Select Subject --")}</option>
              {subjects.map(s => <option key={s.subjectCode} value={s.subjectCode}>{s.subjectCode}: {s.subjectName}</option>)}
            </select>
          </div>
        )}

        {/* File upload */}
        {formData.selectedSubjectCode && (
          <div className="border border-gray-200 p-6 rounded-xl shadow-md bg-white flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium text-gray-600 block mb-1">Question Bank PDF:</label>
              <label
                className={`flex items-center gap-2 cursor-pointer text-white px-4 py-3 rounded-lg w-full justify-center ${isUploadEnabled ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-400"}`}
                htmlFor="qb-file-input"
              >
                <UploadIcon className="h-5 w-5" />
                <span className="text-base font-medium">{formData.file ? "Change File" : "Upload Subject QB (PDF)"}</span>
                <input
                  id="qb-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  disabled={!formData.selectedSubjectCode}
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="w-full md:flex-1">
              {formData.file ? (
                <div className="text-sm text-green-600 truncate bg-green-50 p-3 rounded-lg border border-green-200 w-full font-mono">
                  <span className="font-semibold text-gray-700">Selected File:</span> {formData.file.name}
                </div>
              ) : (
                <span className="text-sm text-gray-400 p-3 block">Please select a PDF file for the subject's Question Bank.</span>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!formData.selectedSubjectCode || !formData.file || isUploading}
            className={`font-extrabold text-white px-12 py-3 rounded-full shadow-lg w-full md:w-auto ${(!formData.selectedSubjectCode || !formData.file || isUploading) ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {isUploading ? "Uploading..." : "Submit Question Bank Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadQB;
