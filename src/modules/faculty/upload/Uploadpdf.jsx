// src/modules/faculty/upload/UploadPdf.jsx
import React, { useEffect, useRef, useState } from "react";

// Small message modal (reused style)
const MessageModal = ({ message, type = "success", onClose }) => {
  const bg = type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl border-l-4 p-4 shadow-xl max-w-md w-full ${bg}`}>
        <div className="flex justify-between items-center">
          <p className="font-semibold">{type === "success" ? "Success" : "Error"}</p>
          <button onClick={onClose} className="text-xl font-bold">✕</button>
        </div>
        <p className="mt-2 text-sm break-words">{message}</p>
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

// small unique id for material
const generateUniqueId = () => `upload-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

const UploadPdf = ({ uploadEndpoint = "/faculty/uploadPdf", maxSizeMB = 10 }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Upload from Local");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type }
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setFileName("Upload from Local");
      if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
      return;
    }

    // Validation: only PDF (adjust if you also accept other types)
    if (!f.type || !f.type.includes('pdf')) {
      setMessage({ text: "Please select a PDF file.", type: "error" });
      e.target.value = "";
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      setMessage({ text: `File too large. Max ${maxSizeMB}MB allowed.`, type: "error" });
      e.target.value = "";
      return;
    }

    setFile(f);
    setFileName(f.name);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    try {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } catch (err) {
      console.warn("Could not create preview URL", err);
      setPreviewUrl(null);
    }
    setMessage(null);
  };

  const clearSelection = () => {
    setFile(null);
    setFileName("Upload from Local");
    if (fileInputRef.current) {
      try { fileInputRef.current.value = ""; } catch (e) { /* ignore */ }
    }
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setMessage(null);
  };

  const handleUpload = async () => {
    setMessage(null);

    if (!file) {
      setMessage({ text: "Please choose a PDF to upload.", type: "error" });
      return;
    }

    const facultyId = getFacultyIdFromLocalStorage();
    const token = getTokenFromLocalStorage();

    if (!facultyId) {
      setMessage({ text: "Faculty ID not found. Please login again.", type: "error" });
      return;
    }
    if (!token) {
      setMessage({ text: "Auth token missing. Please login again.", type: "error" });
      return;
    }

    const form = new FormData();
    form.append("materialId", generateUniqueId());
    form.append("facultyId", facultyId);
    form.append("pdf", file);
    form.append("pdfName", file.name || "");
    // you can append other fields if your backend expects them

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}${uploadEndpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type for FormData
        },
        body: form,
      });

      if (!res.ok) {
        let text = `Upload failed (status ${res.status})`;
        try { const t = await res.text(); if (t) text = t; } catch (_) {}
        throw new Error(text);
      }

      const respText = await res.text();
      setMessage({ text: respText || "Uploaded successfully.", type: "success" });
      // clear selection after success
      clearSelection();
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({ text: err.message || "Upload failed.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mx-auto mt-10">
      {message && (
        <MessageModal
          message={message.text}
          type={message.type === "success" ? "success" : "error"}
          onClose={() => setMessage(null)}
        />
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload PDF</h2>
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4 text-gray-700">Complete your Upload</h3>

        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
          <label htmlFor="uploadDocument" className="w-full md:w-1/3 text-gray-700 font-medium">
            Upload Document:
          </label>

          <div className="relative w-full md:w-2/3">
            <input
              ref={fileInputRef}
              type="file"
              id="uploadDocument"
              accept="application/pdf"
              className="absolute inset-0 z-50 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="flex justify-between items-center border border-gray-300 rounded-md py-2 px-4 bg-blue-100 text-gray-600">
              <span className="truncate">{fileName}</span>
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline text-blue-700"
                    title="Open preview in new tab"
                  >
                    Preview
                  </a>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-60 ${uploading ? 'cursor-wait' : ''}`}
          >
            {uploading ? "Uploading..." : "Upload Changes"}
          </button>

          <button
            onClick={clearSelection}
            type="button"
            disabled={uploading || !file}
            className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Only PDF files are allowed. Max size: {maxSizeMB}MB. Uploaded file will be associated with your Faculty ID.
        </p>
      </div>
    </div>
  );
};

export default UploadPdf;
