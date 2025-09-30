import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useApiClient } from "../../../context/AuthorizedFetch";

// Re-using components from UploadNotes for consistency
// Inline SVG Upload Icon
const UploadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5 12.5 32.8 12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64z" />
  </svg>
);

// Inline SVG Close Icon
const TimesIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
    <path fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 4.7 55.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 4.7 411.3c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.3 456.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
  </svg>
);

// Message modal
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

// Unique ID generator (must be unique across all materials)
const generateUniqueId = () => `pyq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const UploadPYQ = () => {
  const auth = useAuth();
  const apiClient = useApiClient();

  // Keep a stable ref to apiClient
  const apiRef = useRef(apiClient);
  useEffect(() => { apiRef.current = apiClient; }, [apiClient]);

  // UI / data states
  const [regulations, setRegulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState({ regulations: false, subjects: false, facultyId: false });
  const [error, setError] = useState(null);

  // Four priority rows for consistency with UploadNotes
  const initialRows = useMemo(() => ["A", "B", "C", "D"], []);
  const rowsCount = initialRows.length;

  // Form state
  const [formData, setFormData] = useState({
    selectedRegulation: null,
    selectedBranch: "",
    selectedSemester: "",
    subjects: Array(rowsCount).fill(""),
    files: Array(rowsCount).fill(null),
  });

  // Submission state
  const [submissionStatus, setSubmissionStatus] = useState({ submitted: false, error: null, message: null });
  const [isUploading, setIsUploading] = useState(false);

  // Refs to file inputs
  const fileInputRefs = useRef([]);
  fileInputRefs.current = fileInputRefs.current.slice(0, rowsCount);

  const pushFileRef = (el) => {
    if (!el) return;
    if (!fileInputRefs.current.includes(el)) fileInputRefs.current.push(el);
  };

  // Hard-coded branches and semesters (assuming these are constant)
  const BRANCHES = ["CSE", "CIVIL", "EEE"];
  const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

  // --- Data Fetching Logic (Identical to UploadNotes) ---

  // 1. Fetch regulations on mount
  useEffect(() => {
    let cancelled = false;
    const fetchRegulations = async () => {
      setLoading((s) => ({ ...s, regulations: true }));
      setError(null);
      try {
        const res = await apiRef.current("/getRegulationList", { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((r) => ({
            regulationId: r.regulationId ?? r.regulation ?? r.regulation_id ?? r.id ?? String(r),
            display: r.name ?? r.display ?? r.name ?? String(r),
            raw: r,
          }));
          if (!cancelled) setRegulations(mapped);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Network error fetching regulations.");
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, regulations: false }));
      }
    };

    fetchRegulations();
    return () => { cancelled = true; };
  }, []);

  // 2. Fetch Faculty ID (if missing)
  useEffect(() => {
    let cancelled = false;
    const maybeFetchFacultyId = async () => {
      const email = auth?.user?.email || auth?.email;
      if (!email || auth?.facultyId) return;

      setLoading((s) => ({ ...s, facultyId: true }));
      try {
        const res = await apiRef.current("/getFacultyId", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          const result = await res.json();
          const newFacultyId = result?.facultyId || result?.facultyID || result?.facultyid;
          if (newFacultyId && typeof auth.login === 'function') {
            auth.login({ token: auth.token, user: auth.user, role: auth.role, facultyId: newFacultyId });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch facultyId for PYQ upload:', err);
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, facultyId: false }));
      }
    };

    maybeFetchFacultyId();
    return () => { cancelled = true; };
  }, [auth?.user?.email, auth?.email, auth?.facultyId]); // Added auth.facultyId to deps

  // 3. Fetch subjects when regulation + branch + semester are all selected
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
      setLoading((s) => ({ ...s, subjects: true }));
      setError(null);
      setSubjects([]);

      const dto = {
        regulationId: reg.regulationId,
        semester: Number(semester),
        branch: branch,
      };

      try {
        const res = await apiRef.current("/getNewSubjectList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const result = await res.json();

        if (result && result.subject && typeof result.subject === "object") {
          const list = Object.entries(result.subject).map(([code, name]) => ({ subjectCode: code, subjectName: name }));
          if (!cancelled) setSubjects(list);
        } else if (Array.isArray(result)) {
          if (!cancelled) setSubjects(result.map(s => ({ subjectCode: s.subjectCode ?? s.code ?? s.id, subjectName: s.subjectName ?? s.name })));
        } else if (Array.isArray(result?.subjectList)) {
          if (!cancelled) setSubjects(result.subjectList.map(s => ({ subjectCode: s.subjectCode ?? s.code ?? s.id, subjectName: s.subjectName ?? s.name })));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Network error fetching subjects.");
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, subjects: false }));
      }
    };

    fetchSubjects();
    return () => { cancelled = true; };
  }, [formData.selectedRegulation?.regulationId, formData.selectedBranch, formData.selectedSemester]);

  // --- Handlers (mostly same as UploadNotes) ---

  const resetFileInputs = useCallback(() => {
    fileInputRefs.current.forEach(input => {
      try { input.value = ""; } catch (_) { }
    });
  }, []);

  const resetFormDependentFields = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      subjects: Array(rowsCount).fill(""),
      files: Array(rowsCount).fill(null),
    }));
    resetFileInputs();
  }, [rowsCount, resetFileInputs]);

  const handleRegulationChange = useCallback((e) => {
    const id = e.target.value;
    const selected = regulations.find(r => r.regulationId === id) || null;
    setFormData(prev => ({
      ...prev,
      selectedRegulation: selected,
      selectedBranch: "",
      selectedSemester: "",
    }));
    resetFormDependentFields();
  }, [regulations, resetFormDependentFields]);

  const handleBranchChange = useCallback((e) => {
    const branch = e.target.value;
    setFormData(prev => ({ ...prev, selectedBranch: branch, selectedSemester: "" }));
    resetFormDependentFields();
  }, [resetFormDependentFields]);

  const handleSemesterChange = useCallback((e) => {
    const sem = e.target.value;
    setFormData(prev => ({ ...prev, selectedSemester: sem }));
    resetFormDependentFields();
  }, [resetFormDependentFields]);

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

  // --- Submission Logic (Adapted for PYQ) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus({ submitted: false, error: null, message: null });

    const reg = formData.selectedRegulation;
    if (!reg) {
      setSubmissionStatus({ submitted: true, error: true, message: "Please select a regulation!" });
      return;
    }
    if (!formData.selectedBranch || !formData.selectedSemester) {
      setSubmissionStatus({ submitted: true, error: true, message: "Please select branch and semester!" });
      return;
    }

    let facultyId = auth?.facultyId;
    if (!facultyId) {
      setSubmissionStatus({ submitted: true, error: true, message: "Faculty ID missing. Please log in again." });
      return;
    }

    // Prepare list of rows that have both subject and file
    const uploadRows = [];
    for (let i = 0; i < rowsCount; i++) {
      const file = formData.files[i];
      const subjectCode = formData.subjects[i];
      if (file && subjectCode) uploadRows.push({ index: i, file, subjectCode });
    }

    if (uploadRows.length === 0) {
      setSubmissionStatus({ submitted: true, error: true, message: "Please select at least one subject and upload a file." });
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
      fd.append("regulationId", reg.regulationId);
      fd.append("pdf", r.file);
      fd.append("pdfName", r.file?.name ); // Sending original filename

      try {
        // *** TARGETING THE PYQ ENDPOINT: /addNewPYQ ***
        const resp = await apiRef.current("/addNewPYQ", { method: "POST", body: fd });
        if (resp.ok) {
          successCount++;
        } else {
          let reason = `HTTP ${resp.status}`;
          try { reason = await resp.text(); } catch (_) { }
          failed.push({ subjectCode: r.subjectCode, reason });
        }
      } catch (err) {
        failed.push({ subjectCode: r.subjectCode, reason: err.message || "Network error" });
      }
    }

    setIsUploading(false);

    if (successCount > 0 && failed.length === 0) {
      setSubmissionStatus({ submitted: true, error: false, message: `Successfully uploaded ${successCount} PYQs!` });
      // reset dynamic parts of the form
      setFormData(prev => ({ ...prev, subjects: Array(rowsCount).fill(""), files: Array(rowsCount).fill(null) }));
      resetFileInputs();
    } else if (successCount > 0) {
      setSubmissionStatus({
        submitted: true,
        error: true,
        message: `Uploaded ${successCount} successfully, but ${failed.length} failed. Check console for details.`,
      });
      console.warn("Failed PYQ uploads:", failed);
    } else {
      setSubmissionStatus({ submitted: true, error: true, message: `All PYQ uploads failed. Check server connection and logs.` });
      console.warn("All PYQ uploads failed:", failed);
    }
  };

  const closeMessage = () => setSubmissionStatus({ submitted: false, error: null, message: null });

  // --- Render (Using a distinct style from Notes for PYQ) ---
  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
      {submissionStatus.message && (
        <MessageModal message={submissionStatus.message} type={submissionStatus.error ? "error" : "success"} onClose={closeMessage} />
      )}

      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3 text-red-700">Upload Previous Year Questions (PYQ)</h2>
      <p className="text-gray-500 mb-8">Upload is associated with your Faculty ID: <strong>{auth?.facultyId || "N/A"}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Regulation Selection */}
        <div className="flex flex-col md:flex-row md:items-center p-4 bg-red-50 rounded-lg">
          <label className="w-full md:w-48 font-semibold text-red-700 mb-2 md:mb-0">Choose Regulation:</label>
          <select
            name="regulation"
            value={formData.selectedRegulation?.regulationId || ""}
            onChange={handleRegulationChange}
            disabled={loading.regulations}
            className="flex-1 p-3 rounded-xl border border-red-300 bg-white shadow-inner focus:ring-2 focus:ring-red-500 transition duration-150 disabled:bg-gray-200"
          >
            <option value="">{loading.regulations ? "Loading Regulations..." : "-- Select Regulation --"}</option>
            {regulations.map((reg) => (
              <option key={reg.regulationId} value={reg.regulationId}>{reg.display}</option>
            ))}
          </select>
        </div>

        {/* Branch & Semester (appear after regulation selected) */}
        {formData.selectedRegulation && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-red-50 rounded-lg">
              <label className="block font-semibold text-red-700 mb-2">Branch</label>
              <select value={formData.selectedBranch} onChange={handleBranchChange} className="w-full p-3 rounded-xl border border-red-300 bg-white">
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex-1 p-4 bg-red-50 rounded-lg">
              <label className="block font-semibold text-red-700 mb-2">Semester</label>
              <select value={formData.selectedSemester} onChange={handleSemesterChange} className="w-full p-3 rounded-xl border border-red-300 bg-white">
                <option value="">-- Select Semester --</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Subjects & Uploads */}
        <div>
          <label className="block text-xl font-semibold mb-4 text-gray-700">
            Subject PYQ Uploads
            {loading.subjects && <span className="text-sm ml-2 text-gray-500">(Loading Subjects...)</span>}
          </label>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="flex flex-col gap-5">
            {initialRows.map((label, index) => (
              <div key={index} className="flex flex-col lg:flex-row lg:items-center gap-3 border border-gray-200 p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-300">
                {/* Subject Dropdown */}
                <div className="w-full lg:w-1/3">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Priority {label}. Subject:</label>
                  <select
                    value={formData.subjects[index]}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    disabled={!formData.selectedRegulation || !formData.selectedBranch || !formData.selectedSemester || loading.subjects}
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:border-red-500 focus:ring focus:ring-red-500/50 disabled:bg-gray-100"
                  >
                    <option value="">{loading.subjects ? "Loading..." : (subjects.length === 0 ? "No Subjects Found" : "-- Select Subject --")}</option>
                    {subjects.map((sub) => (
                      <option key={sub.subjectCode} value={sub.subjectCode}>
                        {sub.subjectName ?? sub.name ?? `${sub.subjectCode}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div className="w-full lg:w-1/3">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Choose File (PYQ PDF):</label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer text-white px-4 py-2.5 rounded-lg shadow-md w-full justify-center transition duration-200 ease-in-out
                      ${!formData.selectedRegulation ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
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

                {/* File name display */}
                <div className="w-full lg:w-1/3 flex items-center h-full pt-1 lg:pt-0">
                  {formData.files[index] ? (
                    <div className="text-sm text-red-600 truncate bg-red-50 p-2 rounded-lg border border-red-200 w-full font-mono">
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
            className={`font-extrabold text-white px-12 py-3 rounded-full shadow-lg transition duration-300 ease-in-out w-full md:w-auto
              ${isUploading || !formData.selectedRegulation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-xl transform hover:scale-105"
              }`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Uploading...
              </span>
            ) : (
              "Submit PYQs Now"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPYQ;