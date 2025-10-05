// src/modules/faculty/upload/UploadNotes.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Inline icons (kept from your original)
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

// message modal
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

// Resolve API base (CRA / Vite / fallback)
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

// helpers to read auth
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
  } catch (e) {
    console.error('Error reading facultyId from localStorage', e);
    return null;
  }
};
const getTokenFromLocalStorage = () => {
  try {
    // prefer vidyaSarthiAuth token if present
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

// small util to generate unique material id
const generateUniqueId = () => `material-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

const UploadNotes = () => {
  const navigate = useNavigate();

  // state
  const [regulations, setRegulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState({ regulations: false, subjects: false, facultyId: false });
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState({ open: false, message: "", isError: false });

  // rows config
  const rows = useMemo(() => ["A", "B", "C", "D"], []);
  const rowsCount = rows.length;

  const [formData, setFormData] = useState({
    selectedRegulation: null,
    selectedBranch: "",
    selectedSemester: "",
    subjects: Array(rowsCount).fill(""),
    files: Array(rowsCount).fill(null),
  });

  // file input refs
  const fileInputRefs = useRef([]);
  fileInputRefs.current = fileInputRefs.current.slice(0, rowsCount);
  const pushFileRef = (el) => {
    if (!el) return;
    if (!fileInputRefs.current.includes(el)) fileInputRefs.current.push(el);
  };

  const [isUploading, setIsUploading] = useState(false);

  const token = getTokenFromLocalStorage();
  const storedFacultyId = getFacultyIdFromLocalStorage();

  // fetch regulations
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
        // expect array or object - normalise to array of { regulationId, display, raw }
        if (Array.isArray(data)) {
          const mapped = data.map(r => ({
            regulationId: r.regulationId ?? r.id ?? String(r),
            display: r.name ?? r.display ?? String(r),
            raw: r,
          }));
          if (!cancelled) setRegulations(mapped);
        } else if (data && data.regulations) {
          // support wrapper
          const mapped = Object.values(data.regulations).map((r, idx) => ({
            regulationId: r.regulationId ?? r.id ?? String(idx),
            display: r.name ?? r.display ?? String(r),
            raw: r,
          }));
          if (!cancelled) setRegulations(mapped);
        } else {
          // fallback to empty
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

  // fetch subjects when regulation+branch+semester selected
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
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(dto),
        });
        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);
        const result = await res.json();
        // support SubjectListDto shape: { subject: { code: name } }
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

  // update handlers
  const handleRegulationChange = useCallback((e) => {
    const id = e.target.value;
    const selected = regulations.find(r => r.regulationId === id) || null;
    setFormData(prev => ({
      ...prev,
      selectedRegulation: selected,
      selectedBranch: "",
      selectedSemester: "",
      subjects: Array(rowsCount).fill(""),
      files: Array(rowsCount).fill(null),
    }));
    // clear file inputs DOM values
    fileInputRefs.current.forEach(f => { try { f.value = ""; } catch (_) { } });
  }, [regulations, rowsCount]);

  const handleBranchChange = useCallback((e) => {
    const branch = e.target.value;
    setFormData(prev => ({ ...prev, selectedBranch: branch, subjects: Array(rowsCount).fill(""), files: Array(rowsCount).fill(null) }));
    fileInputRefs.current.forEach(f => { try { f.value = ""; } catch (_) { } });
  }, [rowsCount]);

  const handleSemesterChange = useCallback((e) => {
    const sem = e.target.value;
    setFormData(prev => ({ ...prev, selectedSemester: sem, subjects: Array(rowsCount).fill(""), files: Array(rowsCount).fill(null) }));
    fileInputRefs.current.forEach(f => { try { f.value = ""; } catch (_) { } });
  }, [rowsCount]);

  const handleSubjectChange = useCallback((index, value) => {
    setFormData(prev => {
      const copy = [...prev.subjects];
      copy[index] = value;
      return { ...prev, subjects: copy };
    });
  }, []);

  const handleFileChange = useCallback((index, file) => {
    setFormData(prev => {
      const copy = [...prev.files];
      copy[index] = file;
      return { ...prev, files: copy };
    });
  }, []);

  const resetFileInputs = useCallback(() => {
    fileInputRefs.current.forEach(input => {
      try { input.value = ""; } catch (_) { }
    });
  }, []);

  // try to resolve facultyId (prefer stored, else try to fetch via email param in localStorage user)
  const resolveFacultyId = useCallback(async () => {
    let facultyId = storedFacultyId;
    if (facultyId) return facultyId;

    // try to fetch using email in stored 'user' or vidyaSarthiAuth
    try {
      const vsRaw = localStorage.getItem('vidyaSarthiAuth');
      let email = null;
      if (vsRaw) {
        const parsed = JSON.parse(vsRaw || '{}');
        email = parsed?.user?.email || parsed?.email || null;
      } else {
        const uRaw = localStorage.getItem('user');
        if (uRaw) {
          try {
            const p = JSON.parse(uRaw);
            email = p?.email || null;
          } catch (_) {}
        }
      }

      if (!email) return null;

      const res = await fetch(`${API_BASE}/faculty/getFacultyId`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        console.warn('getFacultyId returned', res.status);
        return null;
      }

      const payload = await res.json();
      facultyId = payload?.facultyId || payload?.facultyID || payload?.facultyid || null;
      if (facultyId) {
        // persist to localStorage vidyaSarthiAuth if present, else into user object
        try {
          const key = 'vidyaSarthiAuth';
          const existingRaw = localStorage.getItem(key);
          if (existingRaw) {
            const existing = JSON.parse(existingRaw || '{}');
            localStorage.setItem(key, JSON.stringify({ ...existing, facultyId }));
          } else {
            // fallback: merge into 'user' object if present
            const uRaw = localStorage.getItem('user');
            if (uRaw) {
              const u = JSON.parse(uRaw || '{}');
              localStorage.setItem('user', JSON.stringify({ ...u, facultyId }));
            } else {
              localStorage.setItem(key, JSON.stringify({ facultyId }));
            }
          }
        } catch (e) {
          console.warn('Failed to persist facultyId locally', e);
        }
      }
      return facultyId;
    } catch (err) {
      console.warn('Failed to resolve facultyId', err);
      return null;
    }
  }, [storedFacultyId, token]);

  // submit handler: upload each selected row
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmission({ open: false, message: "", isError: false });
    setError(null);

    if (!formData.selectedRegulation) {
      setSubmission({ open: true, message: "Please select a regulation.", isError: true });
      return;
    }
    if (!formData.selectedBranch || !formData.selectedSemester) {
      setSubmission({ open: true, message: "Please select branch and semester.", isError: true });
      return;
    }

    // ensure facultyId exists
    const facultyId = await resolveFacultyId();
    if (!facultyId) {
      setSubmission({ open: true, message: "Faculty ID not found. Please login again.", isError: true });
      return;
    }

    if (!token) {
      setSubmission({ open: true, message: "Auth token missing. Please login again.", isError: true });
      return;
    }

    // collect rows with both subject and file
    const uploadRows = [];
    for (let i = 0; i < rowsCount; i++) {
      const file = formData.files[i];
      const subjectCode = formData.subjects[i];
      if (file && subjectCode) uploadRows.push({ index: i, file, subjectCode });
    }

    if (uploadRows.length === 0) {
      setSubmission({ open: true, message: "Please select at least one subject and upload a file.", isError: true });
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    const failed = [];

    for (const r of uploadRows) {
      const fd = new FormData();
      fd.append("materialId", generateUniqueId());
      fd.append("subjectCode", r.subjectCode);
      fd.append("facultyId", facultyId);
      fd.append("regulationId", formData.selectedRegulation.regulationId);
      fd.append("pdf", r.file);
      fd.append("pdfName", r.file?.name || "");

      try {
        const resp = await fetch(`${API_BASE}/faculty/addNewNotes`, {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: fd, // browser sets proper multipart boundary
        });

        if (resp.ok) {
          successCount++;
        } else {
          let reason = `HTTP ${resp.status}`;
          try { reason = await resp.text(); } catch (_) {}
          failed.push({ subjectCode: r.subjectCode, reason });
        }
      } catch (err) {
        failed.push({ subjectCode: r.subjectCode, reason: err.message || "Network error" });
      }
    }

    setIsUploading(false);

    if (successCount > 0 && failed.length === 0) {
      setSubmission({ open: true, message: `Successfully uploaded ${successCount} notes!`, isError: false });
      setFormData(prev => ({ ...prev, subjects: Array(rowsCount).fill(""), files: Array(rowsCount).fill(null) }));
      resetFileInputs();
    } else if (successCount > 0) {
      setSubmission({ open: true, message: `Uploaded ${successCount} successfully, but ${failed.length} failed. Check console for details.`, isError: true });
      console.warn("Failed uploads:", failed);
    } else {
      setSubmission({ open: true, message: "All uploads failed. Check server logs.", isError: true });
      console.warn("All uploads failed:", failed);
    }
  }, [formData, resolveFacultyId, rowsCount, token, resetFileInputs]);

  const closeSubmission = () => setSubmission({ open: false, message: "", isError: false });

  // BRANCH & SEM options hard-coded
  const BRANCHES = ["CSE", "CIVIL", "EEE"];
  const SEMESTERS = [1,2,3,4,5,6,7,8];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
      {submission.open && <MessageModal message={submission.message} type={submission.isError ? "error" : "success"} onClose={closeSubmission} />}

      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">Upload Notes & Materials</h2>
      <p className="text-gray-500 mb-4">Faculty ID: <strong>{storedFacultyId || "N/A"}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Regulation */}
        <div className="flex flex-col md:flex-row md:items-center p-4 bg-blue-50 rounded-lg">
          <label className="w-full md:w-48 font-semibold text-blue-700 mb-2 md:mb-0">Choose Regulation:</label>
          <select
            name="regulation"
            value={formData.selectedRegulation?.regulationId || ""}
            onChange={handleRegulationChange}
            disabled={loading.regulations}
            className="flex-1 p-3 rounded-xl border border-blue-300 bg-white shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-150 disabled:bg-gray-200"
          >
            <option value="">{loading.regulations ? "Loading Regulations..." : "-- Select Regulation --"}</option>
            {regulations.map(reg => <option key={reg.regulationId} value={reg.regulationId}>{reg.display}</option>)}
          </select>
        </div>

        {/* Branch & Semester */}
        {formData.selectedRegulation && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-blue-50 rounded-lg">
              <label className="block font-semibold text-blue-700 mb-2">Branch</label>
              <select value={formData.selectedBranch} onChange={handleBranchChange} className="w-full p-3 rounded-xl border border-blue-300 bg-white">
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex-1 p-4 bg-blue-50 rounded-lg">
              <label className="block font-semibold text-blue-700 mb-2">Semester</label>
              <select value={formData.selectedSemester} onChange={handleSemesterChange} className="w-full p-3 rounded-xl border border-blue-300 bg-white">
                <option value="">-- Select Semester --</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Subject rows */}
        <div>
          <label className="block text-xl font-semibold mb-4 text-gray-700">
            Subject Materials Uploads
            {loading.subjects && <span className="text-sm ml-2 text-gray-500">(Loading Subjects...)</span>}
          </label>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="flex flex-col gap-5">
            {rows.map((label, index) => (
              <div key={index} className="flex flex-col lg:flex-row lg:items-center gap-3 border border-gray-200 p-4 rounded-xl shadow-md bg-white">
                <div className="w-full lg:w-1/3">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Priority {label}. Subject:</label>
                  <select
                    value={formData.subjects[index]}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    disabled={!formData.selectedRegulation || !formData.selectedBranch || !formData.selectedSemester || loading.subjects}
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50"
                  >
                    <option value="">{loading.subjects ? "Loading..." : (subjects.length === 0 ? "No Subjects Found" : "-- Select Subject --")}</option>
                    {subjects.map(s => (
                      <option key={s.subjectCode} value={s.subjectCode}>{s.subjectName ?? s.name ?? s.subjectCode}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full lg:w-1/3">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Choose File:</label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer text-white px-4 py-2.5 rounded-lg w-full justify-center
                      ${!formData.selectedRegulation ? "bg-gray-400" : "bg-yellow-400 hover:bg-yellow-500"}`}
                    htmlFor={`file-input-${index}`}
                  >
                    <UploadIcon className="h-5 w-5" />
                    <span className="text-base font-medium">{formData.files[index] ? "Change File" : "Upload PDF/Document"}</span>
                    <input
                      id={`file-input-${index}`}
                      ref={pushFileRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      disabled={!formData.selectedRegulation}
                      onChange={(e) => handleFileChange(index, e.target.files[0] || null)}
                    />
                  </label>
                </div>

                <div className="w-full lg:w-1/3 flex items-center pt-1 lg:pt-0">
                  {formData.files[index] ? (
                    <div className="text-sm text-green-600 truncate bg-green-50 p-2 rounded-lg border border-green-200 w-full font-mono">
                      <span className="font-semibold text-gray-700">File:</span> {formData.files[index].name}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 p-2">No file selected.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isUploading || !formData.selectedRegulation}
            className={`font-extrabold text-white px-12 py-3 rounded-full shadow-lg w-full md:w-auto
              ${isUploading || !formData.selectedRegulation ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {isUploading ? "Uploading..." : "Submit Notes Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNotes;
