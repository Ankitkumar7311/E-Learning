// src/modules/faculty/upload/UploadNewsEvents.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useApiClient } from "../../../context/AuthorizedFetch";

// Resolve API base (CRA / Vite / fallback)
const API_BASE = (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : "http://localhost:8080/VidyaSarthi";

const eventTypes = ["Notice", "Announcement"];

const MessageModal = ({ message, type = "success", onClose }) => {
  const bg = type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
      <div className={`rounded-xl border-l-4 p-4 shadow-xl max-w-md w-full ${bg}`}>
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="font-semibold">{type === "success" ? "Success" : "Error"}</p>
            <p className="mt-2 text-sm break-words">{message}</p>
          </div>
          <button onClick={onClose} className="ml-3 text-xl font-bold leading-none">✕</button>
        </div>
      </div>
    </div>
  );
};

// read token/facultyId helpers
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

const readFacultyIdFromStorage = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const p = JSON.parse(vs || "{}");
      if (p?.facultyId) return p.facultyId;
    }
    const u = localStorage.getItem("user");
    if (u) {
      const p = JSON.parse(u || "{}");
      return p?.facultyId || p?.userId || null;
    }
    return null;
  } catch (e) {
    console.warn("readFacultyIdFromStorage:", e);
    return null;
  }
};

const UploadNewsEvents = () => {
  const auth = useAuth();
  const apiClient = useApiClient();
  const apiRef = useRef(apiClient);
  useEffect(() => { apiRef.current = apiClient; }, [apiClient]);

  const [formData, setFormData] = useState({ type: "", describeEvents: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageModal, setMessageModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const ensureFacultyId = async () => {
      try {
        const email = auth?.user?.email || auth?.email;
        if (!email || auth?.facultyId) return;

        const call = apiRef.current ?? null;
        const token = readToken();
        const endpoint = call ? "/getFacultyId" : `${API_BASE}/faculty/getFacultyId`;
        const options = { method: "POST", headers: { "Content-Type": "application/json", ...(token && !call ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ email }) };
        
        const res = call ? await call(endpoint, options) : await fetch(endpoint, options);
        if (!res.ok) return;
        
        const payload = await res.json();
        const newFacultyId = payload?.facultyId || payload?.facultyID || payload?.facultyid;
        
        if (newFacultyId && typeof auth.login === "function" && !cancelled) {
          auth.login({ token: auth.token, user: auth.user, role: auth.role, facultyId: newFacultyId });
        }
      } catch (err) {
        console.warn("ensureFacultyId:", err);
      }
    };
    ensureFacultyId();
    return () => { cancelled = true; };
  }, [auth]);

  const handleChange = (e) => {
    setFormData(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const callApi = async (pathOrFullUrl, opts = {}) => {
    if (typeof apiRef.current === "function") {
      return apiRef.current(pathOrFullUrl, opts);
    }
    const url = pathOrFullUrl.startsWith("http") ? pathOrFullUrl : `${API_BASE}${pathOrFullUrl.startsWith("/") ? "" : "/"}${pathOrFullUrl}`;
    const token = readToken();
    const headers = { ...(opts.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    return fetch(url, { ...opts, headers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessageModal(null);

    if (!formData.type.trim()) {
      setError("Please select a type (Notice or Announcement).");
      return;
    }
    if (!formData.describeEvents.trim()) {
      setError("Please add description text before submitting.");
      return;
    }

    const facultyId = auth?.facultyId || readFacultyIdFromStorage();
    if (!facultyId) {
      setError("Faculty ID missing. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const body = { type: formData.type, describeEvents: formData.describeEvents, facultyId };
      const res = await callApi("/faculty/uploadNews&Announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text().catch(() => "");
      if (!res.ok) throw new Error(text || `Server returned ${res.status}`);

      setMessageModal({ type: "success", text: `${formData.type} uploaded successfully.` });
      setFormData({ type: "", describeEvents: "" });
    } catch (err) {
      console.error("UploadNewsEvents error:", err);
      setMessageModal({ type: "error", text: `Failed to upload ${formData.type || 'content'}. ${err.message || ""}` });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setMessageModal(null);

  const isSubmitDisabled = loading || !formData.type || !formData.describeEvents.trim();

  return (
    <div>
      {messageModal && (
        <MessageModal message={messageModal.text} type={messageModal.type} onClose={closeModal} />
      )}

      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3 text-blue-800">Upload Notice/Announcement</h2>
      <p className="text-sm text-gray-500 mb-6 text-center sm:text-left">Posting as: <strong>{auth?.facultyId || readFacultyIdFromStorage() || "Loading ID..."}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* RESPONSIVE REFINEMENT: Slightly adjusted label width for better balance on larger screens. */}
          <label className="sm:w-40 font-medium">Choose Type: <span className="text-red-500">*</span></label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100 w-full"
            required
          >
            <option value="">-- Select Type --</option>
            {eventTypes.map((eventType, idx) => (
              <option key={idx} value={eventType}>{eventType}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          {/* RESPONSIVE REFINEMENT: Slightly adjusted label width for better balance on larger screens. */}
          <label className="sm:w-40 font-medium">Describe Event: <span className="text-red-500">*</span></label>
          <textarea
            name="describeEvents"
            value={formData.describeEvents}
            onChange={handleChange}
            placeholder="Describe the notice or announcement..."
            rows="5"
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-blue-100 w-full resize-vertical"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-6 sm:px-8 py-2 rounded-md shadow transition duration-200 ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Submitting..." : "Submit Now"}
          </button>
        </div>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
    </div>
  );
};

export default UploadNewsEvents;