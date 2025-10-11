// src/modules/student/FindQB.jsx
import React, { useCallback, useEffect, useState } from "react";

/**
 * FindQB
 * - Loads regulations
 * - lets the user choose regulation -> branch -> semester (1..8)
 * - loads subjects for that triple (calls /student/getNewSubjectList POST)
 * - when a subject is chosen, calls /getMaterialListQB/{subjectCode} to get QB list
 * - displays material list and allows viewing (best-effort fetch & open)
 */

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

// helper: read token and student id from localStorage (resilient)
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

const getStoredStudentId = () => {
  try {
    const vs = localStorage.getItem('vidyaSarthiAuth');
    if (vs) {
      const parsed = JSON.parse(vs || '{}');
      if (parsed?.studentId) return parsed.studentId;
    }
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.studentId || parsed?.userId || null;
  } catch (e) {
    console.error('Error reading studentId from localStorage', e);
    return null;
  }
};

const SEMESTERS = [1,2,3,4,5,6,7,8];
const BRANCHES = ["CSE", "CIVIL", "EEE", "ECE", "ME"]; // extend as needed

const FindQB = () => {
  // UI state
  const [regulations, setRegulations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [errorRegs, setErrorRegs] = useState("");

  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState("");

  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [errorMaterials, setErrorMaterials] = useState("");

  const token = getTokenFromLocalStorage();
  const storedStudentId = getStoredStudentId();

  // load regulations on mount
  useEffect(() => {
    let cancelled = false;
    const fetchRegs = async () => {
      setLoadingRegs(true);
      setErrorRegs("");
      try {
        const res = await fetch(`${API_BASE}/student/getRegulationList`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Failed to load regulations (${res.status})`);
        const data = await res.json();
        let mapped = [];
        if (Array.isArray(data)) {
          mapped = data.map(r => ({
            regulationId: r.regulationId ?? r.id ?? String(r),
            display: r.name ?? r.display ?? String(r),
            raw: r
          }));
        } else if (data && data.regulations) {
          mapped = Object.values(data.regulations).map((r, idx) => ({
            regulationId: r.regulationId ?? r.id ?? String(idx),
            display: r.name ?? r.display ?? String(r),
            raw: r
          }));
        } else {
          mapped = Object.keys(data || {}).map(k => ({ regulationId: k, display: String(data[k]) }));
        }
        if (!cancelled) setRegulations(mapped);
      } catch (err) {
        if (!cancelled) setErrorRegs(err.message || "Network error while loading regulations");
      } finally {
        if (!cancelled) setLoadingRegs(false);
      }
    };

    fetchRegs();
    return () => { cancelled = true; };
  }, [token]);

  // fetch subjects when regulation, branch, semester selected
  useEffect(() => {
    if (!selectedRegulation || !selectedBranch || !selectedSemester) {
      setSubjects([]);
      setSelectedSubjectCode("");
      return;
    }

    let cancelled = false;
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      setErrorSubjects("");
      setSubjects([]);
      try {
        const dto = {
          regulationId: selectedRegulation.regulationId ?? selectedRegulation,
          branch: selectedBranch,
          semester: Number(selectedSemester)
        };
        const res = await fetch(`${API_BASE}/student/getNewSubjectList`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(dto)
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
        if (!cancelled) setErrorSubjects(err.message || "Network error fetching subjects");
      } finally {
        if (!cancelled) setLoadingSubjects(false);
      }
    };

    fetchSubjects();
    return () => { cancelled = true; };
  }, [selectedRegulation, selectedBranch, selectedSemester, token]);

  // fetch QB materials when subject selected
  useEffect(() => {
    if (!selectedSubjectCode) {
      setMaterials([]);
      return;
    }

    let cancelled = false;
    const fetchMaterials = async () => {
      setLoadingMaterials(true);
      setErrorMaterials("");
      setMaterials([]);
      try {
        const url = `${API_BASE}/getMaterialListQB/${encodeURIComponent(selectedSubjectCode)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed to fetch QBs (${res.status})`);
        }

        const data = await res.json();
        if (Array.isArray(data)) setMaterials(data);
        else setMaterials([]);
      } catch (err) {
        if (!cancelled) setErrorMaterials(err.message || "Error loading QB list");
      } finally {
        if (!cancelled) setLoadingMaterials(false);
      }
    };

    fetchMaterials();
    return () => { cancelled = true; };
  }, [selectedSubjectCode, token]);

  // handlers
  const handleRegChange = useCallback((e) => {
    const id = e.target.value;
    const sel = regulations.find(r => String(r.regulationId) === String(id)) || null;
    setSelectedRegulation(sel);
    setSelectedBranch("");
    setSelectedSemester("");
    setSelectedSubjectCode("");
    setSubjects([]);
    setMaterials([]);
  }, [regulations]);

  const handleBranchChange = useCallback((e) => {
    setSelectedBranch(e.target.value);
    setSelectedSubjectCode("");
    setSubjects([]);
    setMaterials([]);
  }, []);

  const handleSemesterChange = useCallback((e) => {
    setSelectedSemester(e.target.value);
    setSelectedSubjectCode("");
    setSubjects([]);
    setMaterials([]);
  }, []);

  const handleSubjectSelect = (e) => {
    setSelectedSubjectCode(e.target.value);
  };

  // view/download logic (best-effort)
  const viewMaterial = async (material) => {
    const candidates = [
      `${API_BASE}/faculty/getMaterialFile/${encodeURIComponent(material.materialId)}`,
      `${API_BASE}/faculty/getMaterial/${encodeURIComponent(material.materialId)}`,
      `${API_BASE}/downloadMaterial/${encodeURIComponent(material.materialId)}`,
      `${API_BASE}/getMaterial/${encodeURIComponent(material.materialId)}`,
    ];

    for (const url of candidates) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) continue;

        const ct = (res.headers.get("content-type") || "").toLowerCase();
        if (ct.includes("application/json") || ct.includes("text/")) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            if (json?.url) { window.open(json.url, "_blank"); return; }
            const b64 = json?.imageData || json?.data || json?.base64 || json?.file;
            if (b64 && typeof b64 === "string") {
              const cleaned = b64.replace(/^data:[^;]+;base64,/, "");
              const byteCharacters = atob(cleaned);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
              const blob = new Blob([new Uint8Array(byteNumbers)], { type: json?.contentType || "application/pdf" });
              const objUrl = URL.createObjectURL(blob);
              window.open(objUrl, "_blank");
              return;
            }
          } catch (err) { /* not json */ }
          continue;
        }

        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        return;
      } catch (err) {
        console.debug("viewMaterial attempt failed for", url, err);
      }
    }

    alert("Unable to open file. Backend may not expose a direct download endpoint for this material.");
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center px-4 py-6">
      <section className="w-full max-w-3xl flex flex-col bg-white p-6 ">
        <h2 className="text-2xl font-bold text-center mb-6">Find QB</h2>

        {/* Regulation */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="font-medium w-full md:w-1/3 mb-2 md:mb-0 text-sm">Choose Regulation:</label>
          <div className="w-full md:w-2/3">
            <select
              value={selectedRegulation?.regulationId || ""}
              onChange={handleRegChange}
              className="w-full h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm"
            >
              <option value="">{loadingRegs ? "Loading Regulations..." : "-- Select Regulation --"}</option>
              {regulations.map(r => (
                <option key={r.regulationId} value={r.regulationId}>{r.display}</option>
              ))}
            </select>
            {errorRegs && <p className="text-xs text-red-600 mt-1">{errorRegs}</p>}
          </div>
        </div>

        {/* Branch + Semester */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="font-medium w-full md:w-1/3 mb-2 md:mb-0 text-sm">Branch & Semester:</label>
          <div className="w-full md:w-2/3 flex gap-3">
            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              className="flex-1 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm"
              disabled={!selectedRegulation}
            >
              <option value="">{selectedRegulation ? "-- Select Branch --" : "Select regulation first"}</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="w-32 h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm"
              disabled={!selectedRegulation}
            >
              <option value="">{selectedRegulation ? "Sem" : "-"}</option>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="font-medium w-full md:w-1/3 mb-2 md:mb-0 text-sm">Subjects:</label>
          <div className="w-full md:w-2/3">
            <select
              value={selectedSubjectCode}
              onChange={handleSubjectSelect}
              className="w-full h-11 bg-blue-100 border border-gray-200 rounded-lg p-2 text-sm"
              disabled={!selectedRegulation || !selectedBranch || !selectedSemester || loadingSubjects}
            >
              <option value="">{loadingSubjects ? "Loading Subjects..." : (subjects.length === 0 ? "-- No Subjects --" : "-- Select Subject --")}</option>
              {subjects.map(s => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectName ?? s.subjectCode}
                </option>
              ))}
            </select>
            {errorSubjects && <p className="text-xs text-red-600 mt-1">{errorSubjects}</p>}
          </div>
        </div>

        {/* Materials Listing */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">QB List</h3>
            <div className="text-sm text-gray-500">Student: <strong>{storedStudentId || "N/A"}</strong></div>
          </div>

          {loadingMaterials && <p className="text-sm text-gray-600">Loading materials...</p>}
          {errorMaterials && <p className="text-sm text-red-600">{errorMaterials}</p>}

          {!loadingMaterials && materials.length === 0 && !errorMaterials && (
            <p className="text-sm text-gray-500">No QBs found for the selected subject.</p>
          )}

          {materials.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Filename</th>
                    <th className="py-2 px-2">Material ID</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Regulation</th>
                    <th className="py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => (
                    <tr key={m.materialId || m.id} className="border-b">
                      <td className="py-2 px-2">{m.pdfFilename || "—"}</td>
                      <td className="py-2 px-2 font-mono text-xs">{m.materialId}</td>
                      <td className="py-2 px-2">{m.materialType ?? "—"}</td>
                      <td className="py-2 px-2">{m.regulationId ?? "—"}</td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => viewMaterial(m)}
                          className="px-3 py-1 rounded bg-yellow-500 text-white text-xs hover:bg-yellow-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default FindQB;
