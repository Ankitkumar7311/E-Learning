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

    return () => {
      cancelled = true;
    };
  }, [studentId, token, refreshCounter]);

  const refresh = () => setRefreshCounter((c) => c + 1);

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
        if (!res.ok) {
          continue;
        }

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        if (contentType.includes("application/json") || contentType.includes("text/")) {
          // maybe returned JSON with url or base64
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
          } catch (e) {
            // ignore and try next candidate
          }
          continue;
        }

        // assume binary/pdf
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        window.open(objUrl, "_blank");
        // don't revoke immediately (new tab needs to load). Browser will handle cleanup.
        return;
      } catch (err) {
        console.debug("viewMaterial failed for", url, err);
        // try next
      }
    }

    alert("Unable to open material. Backend may not expose a direct download endpoint.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Registered Complains</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-6 bg-white rounded shadow text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading complains...</p>
        </div>
      )}

      {!loading && err && (
        <div className="p-4 bg-red-50 text-red-700 rounded">{err}</div>
      )}

      {!loading && !err && complains.length === 0 && (
        <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">No complains found.</div>
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
    </div>
  );
};

export default ComplainsList;
