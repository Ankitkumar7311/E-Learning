// src/modules/student/find/ComplainsList.jsx
import React, { useEffect, useState } from "react";

const API_BASE =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  "http://localhost:8080/VidyaSarthi";

const readToken = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    console.warn("readToken:", e);
    return localStorage.getItem("token") || null;
  }
};

const getStoredStudentId = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const p = JSON.parse(vs || "{}");
      if (p?.studentId) return p.studentId;
      if (p?.user?.studentId) return p.user.studentId;
    }
    const u = localStorage.getItem("user");
    if (u) {
      const p = JSON.parse(u || "{}");
      return p?.studentId || p?.userId || null;
    }
    return null;
  } catch (e) {
    console.warn("getStoredStudentId:", e);
    return null;
  }
};

const ComplainsList = () => {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // modal + form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    comment: "",
    materialId: "",
    facultyId: "",
    complainType: "REPORT",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // faculty lookup state
  const [facultyLookup, setFacultyLookup] = useState({ loading: false, error: "" });

  const studentId = getStoredStudentId();
  const token = readToken();

  useEffect(() => {
    let cancelled = false;
    const fetchComplains = async () => {
      setLoading(true);
      setErr("");
      setComplains([]);
      if (!studentId) {
        setErr("Student ID not found. Please login.");
        setLoading(false);
        return;
      }
      try {
        const url = `${API_BASE}/student/getComplainTable/${encodeURIComponent(studentId)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed to load complains (${res.status})`);
        }
        const data = await res.json();
        if (!cancelled) {
          setComplains(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) setErr(error.message || "Failed to load complains");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchComplains();
    return () => { cancelled = true; };
  }, [studentId, token, refreshCounter]);

  const refresh = () => setRefreshCounter((c) => c + 1);

  const openModal = () => {
    setFormError("");
    setFormSuccess("");
    setForm({
      comment: "",
      materialId: "",
      facultyId: "",
      complainType: "REPORT",
    });
    setFacultyLookup({ loading: false, error: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setFormSuccess("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // AUTO-FILL Faculty ID when Material ID changes
  useEffect(() => {
    const id = (form.materialId || "").trim();
    if (!id) {
      setFacultyLookup({ loading: false, error: "" });
      setForm((f) => ({ ...f, facultyId: "" }));
      return;
    }

    const ctrl = new AbortController();
    setFacultyLookup({ loading: true, error: "" });

    const t = setTimeout(async () => {
      try {
        const url = `${API_BASE}/student/getFacultyIdByMaterialId/${encodeURIComponent(id)}`;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(url, { method: "GET", headers, signal: ctrl.signal });

        const text = await res.text().catch(() => "");
        if (!res.ok) {
          throw new Error(text || `Lookup failed (${res.status})`);
        }

        // Accept either JSON { facultyId: "..."} or plain text body
        let facultyId = "";
        try {
          const json = JSON.parse(text);
          facultyId = json?.facultyId ?? json?.id ?? json ?? "";
        } catch {
          facultyId = text ?? "";
        }
        setForm((f) => ({ ...f, facultyId: String(facultyId || "") }));
        setFacultyLookup({ loading: false, error: "" });
      } catch (e) {
        if (e?.name === "AbortError") return;
        setFacultyLookup({ loading: false, error: "Unable to fetch Faculty ID." });
        setForm((f) => ({ ...f, facultyId: "" }));
      }
    }, 350); // debounce while typing

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [form.materialId, token]);

  const submitComplaint = async (e) => {
    e && e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!studentId) {
      setFormError("Student ID not available. Please login.");
      return;
    }

    if (!form.comment || !form.materialId) {
      setFormError("Please provide a comment and material ID.");
      return;
    }

    const payload = {
      comment: form.comment,
      studentId: String(studentId),
      materialId: form.materialId,
      facultyId: form.facultyId || "",
      complainType: form.complainType || "REPORT",
      complainStatus: "ACTION_REQUIRED",
    };

    setSubmitting(true);
    try {
      const url = `${API_BASE}/student/registerNewComplain`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const txt = await res.text().catch(() => "");
      if (!res.ok) {
        throw new Error(txt || `Status ${res.status}`);
      }

      setFormSuccess("Complaint registered successfully.");
      refresh();
      setTimeout(() => {
        closeModal();
      }, 900);
    } catch (err) {
      console.error("Register complaint failed:", err);
      setFormError(err.message || "Failed to register complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  const viewMaterial = async (materialId) => {
    if (!materialId) {
      alert("No materialId.");
      return;
    }

    const candidates = [
      `${API_BASE}/getMaterial/${encodeURIComponent(materialId)}`,
      `${API_BASE}/faculty/getMaterial/${encodeURIComponent(materialId)}`,
      `${API_BASE}/downloadMaterial/${encodeURIComponent(materialId)}`,
    ];

    for (const url of candidates) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) continue;

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        if (contentType.includes("application/json") || contentType.includes("text/")) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            if (json?.url) {
              window.open(json.url, "_blank");
              return;
            }
            const b64 = json?.imageData || json?.data || json?.base64 || json?.file;
            if (b64 && typeof b64 === "string") {
              const cleaned = b64.replace(/^data:[^;]+;base64,/, "");
              const bytes = atob(cleaned);
              const arr = new Uint8Array(bytes.length);
              for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
              const blob = new Blob([arr], { type: json?.contentType || "application/pdf" });
              const objUrl = URL.createObjectURL(blob);
              window.open(objUrl, "_blank");
              return;
            }
          } catch {
            // try next
          }
          continue;
        }

        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        window.open(objUrl, "_blank");
        return;
      } catch {
        // try next
      }
    }

    alert("Unable to open material. Backend may not expose a direct download endpoint.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Registered Complaints</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-sm"
            title="Reload complaints list"
          >
            Refresh
          </button>

          <button
            onClick={openModal}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            title="Register a new complaint (Report / Request)"
          >
            Register Complaint
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-6 bg-white rounded shadow text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading complaints...</p>
        </div>
      )}

      {!loading && err && (
        <div className="p-4 bg-red-50 text-red-700 rounded">{err}</div>
      )}

      {!loading && !err && complains.length === 0 && (
        <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">No complaints found.</div>
      )}

      {!loading && !err && complains.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b bg-gray-50">
                <th className="py-2 px-3">Comment</th>
                <th className="py-2 px-3">Material ID</th>
                <th className="py-2 px-3">Faculty ID</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {complains.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2 px-3 align-top max-w-xs break-words">{c.comment}</td>
                  <td className="py-2 px-3 align-top font-mono text-xs">{c.materialId}</td>
                  <td className="py-2 px-3 align-top">{c.facultyId || "—"}</td>
                  <td className="py-2 px-3 align-top">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        c.complainStatus === "ACTION_REQUIRED"
                          ? "bg-yellow-100 text-yellow-800"
                          : c.complainStatus === "RESOLVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {c.complainStatus || "—"}
                    </span>
                  </td>
                  <td className="py-2 px-3 align-top">
                    <button
                      onClick={() => viewMaterial(c.materialId)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-semibold">Register Complaint</h4>
              <button onClick={closeModal} className="text-xl font-bold leading-none">✕</button>
            </div>

            <form onSubmit={submitComplaint} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe your issue or request..."
                  className="w-full p-2 rounded bg-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Material ID</label>
                  <input
                    name="materialId"
                    value={form.materialId}
                    onChange={handleFormChange}
                    placeholder="e.g. pyq-1759696617179-9qhswvo"
                    className="w-full p-2 rounded bg-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Faculty ID</label>
                  <div className="relative">
                    <input
                      name="facultyId"
                      value={form.facultyId}
                      readOnly
                      className="w-full p-2 rounded bg-blue-100"
                    />
                    {facultyLookup.loading && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        Loading…
                      </span>
                    )}
                  </div>
                  {facultyLookup.error && (
                    <p className="mt-1 text-xs text-red-600">{facultyLookup.error}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="complainType"
                  value={form.complainType}
                  onChange={handleFormChange}
                  className="w-full p-2 rounded bg-blue-100"
                >
                  <option value="REPORT">Report</option>
                  <option value="REQUEST">Request</option>
                </select>
              </div>

              <input type="hidden" name="studentId" value={studentId || ""} />

              {formError && <div className="p-2 bg-red-50 text-red-700 rounded">{formError}</div>}
              {formSuccess && <div className="p-2 bg-green-50 text-green-700 rounded">{formSuccess}</div>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded text-white ${submitting ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"}`}
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplainsList;
