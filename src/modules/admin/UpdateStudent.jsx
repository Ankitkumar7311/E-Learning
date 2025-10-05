// src/modules/student/UpdateStudent.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import teacher from "../../assets/teacher.jpg";
import SectionLeft from "../../layouts/studentdashboard/SectionLeft";
import StudentNavBar from "../student/StudentNavBar";

const API_BASE = "http://localhost:8080/VidyaSarthi";

// Get auth from localStorage
const getAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token") || null;
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        const studentId = u?.studentId || u?.userId || null;
        return { studentId, token };
      } catch (parseErr) {
        console.error("Failed to parse user from localStorage:", parseErr);
        return { studentId: null, token };
      }
    }
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const p = JSON.parse(vs);
      return { studentId: p?.studentId || null, token: p?.token || token };
    }
    return { studentId: null, token };
  } catch (err) {
    console.error("Auth read error:", err);
    return { studentId: null, token: null };
  }
};

// Convert base64 to Blob
const base64ToBlob = (base64, contentType = "image/jpeg") => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

const ONLINE_PLACEHOLDER =
  "https://ui-avatars.com/api/?name=Student&background=0D8ABC&color=fff&size=256";

const UpdateStudent = () => {
  const navigate = useNavigate();
  const { studentId: storedStudentId, token } = getAuthFromLocalStorage();

  const [formData, setFormData] = useState({
    address: "",
    semester: storedStudentId ? "" : "",
    studentId: storedStudentId || "",
    phone: "",
    regulation: "", // human-readable label (for UI/backwards compat)
  });

  // selectedRegulation stores the chosen regulation object { regulationId, display, raw }
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [regulations, setRegulations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Load regulations from API (same endpoint as UploadNotes)
  useEffect(() => {
    let cancelled = false;
    const fetchRegulations = async () => {
      setRegLoading(true);
      try {
        const res = await fetch(`${API_BASE}/student/getRegulationList`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          console.warn("Failed to load regulations", res.status);
          if (!cancelled) setRegulations([]);
          return;
        }
        const data = await res.json();
        // Normalize to [{ regulationId, display, raw }]
        let mapped = [];
        if (Array.isArray(data)) {
          mapped = data.map((r) => ({
            regulationId: r.regulationId ?? r.id ?? String(r),
            display: r.name ?? r.display ?? String(r),
            raw: r,
          }));
        } else if (data && data.regulations) {
          mapped = Object.values(data.regulations).map((r, idx) => ({
            regulationId: r.regulationId ?? r.id ?? String(idx),
            display: r.name ?? r.display ?? String(r),
            raw: r,
          }));
        } else {
          // fallback if shape differs
          mapped = [];
        }
        if (!cancelled) setRegulations(mapped);
      } catch (err) {
        console.error("Error fetching regulations:", err);
        if (!cancelled) setRegulations([]);
      } finally {
        if (!cancelled) setRegLoading(false);
      }
    };

    fetchRegulations();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Fetch student picture from backend
  useEffect(() => {
    let cancelled = false;

    const cleanup = () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {}
      }
    };

    const fetchPicture = async () => {
      if (!storedStudentId) {
        if (!cancelled) setPreviewUrl(null);
        return;
      }

      const endpointsToTry = [
        `${API_BASE}/student/getPic/${encodeURIComponent(storedStudentId)}`,
        `${API_BASE}/getPic/${encodeURIComponent(storedStudentId)}`,
      ];

      for (const url of endpointsToTry) {
        if (cancelled) return;
        try {
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch(url, { method: "GET", headers });

          if (!res.ok) {
            console.debug("getPic endpoint returned", res.status, "for", url);
            continue;
          }

          const contentType = (res.headers.get("content-type") || "").toLowerCase();

          if (contentType.startsWith("image/")) {
            const blob = await res.blob();
            if (cancelled) return;
            cleanup();
            const objUrl = URL.createObjectURL(blob);
            setPreviewUrl(objUrl);
            return;
          }

          const text = await res.text();
          if (!text) {
            console.debug("getPic empty response from", url);
            continue;
          }

          try {
            const json = JSON.parse(text);
            const b64 =
              json?.imageData || json?.imageBase64 || json?.data || json?.photo || json?.image;
            const mime = json?.contentType || json?.mimeType || "image/jpeg";

            if (b64 && typeof b64 === "string") {
              const cleaned = b64.replace(/^data:[^;]+;base64,/, "");
              const blob = base64ToBlob(cleaned, mime);
              if (cancelled) return;
              cleanup();
              const objUrl = URL.createObjectURL(blob);
              setPreviewUrl(objUrl);
              return;
            }
          } catch (err) {
            const trimmed = text.trim();
            if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 100) {
              try {
                const cleaned = trimmed.replace(/^data:[^;]+;base64,/, "");
                const blob = base64ToBlob(cleaned, "image/jpeg");
                if (cancelled) return;
                cleanup();
                const objUrl = URL.createObjectURL(blob);
                setPreviewUrl(objUrl);
                return;
              } catch (inner) {
                console.debug("Failed to convert base64 from", url, inner);
              }
            }
          }
        } catch (err) {
          console.debug("getPic fetch failed for", url, err);
        }
      }

      if (!cancelled) {
        cleanup();
        setPreviewUrl(null);
      }
    };

    fetchPicture();

    return () => {
      cancelled = true;
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {}
      }
    };
    // intentionally excluded previewUrl to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedStudentId, token]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {}
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setMsg("");
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setSelectedFile(null);
      return;
    }

    if (!f.type.startsWith("image/")) {
      setMsg("Please select an image file.");
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      setMsg("Image too large. Max 5MB.");
      return;
    }

    setSelectedFile(f);
    setMsg("");

    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch (err) {}
    }
    const obj = URL.createObjectURL(f);
    setPreviewUrl(obj);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentId) {
      errors.studentId = "Student ID is required. Please login again.";
    }

    if (!formData.address || formData.address.trim().length < 3) {
      errors.address = "Address is required (min 3 characters).";
    }

    if (!formData.phone || !/^\+?\d{7,15}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number (7-15 digits).";
    }

    if (!formData.semester || formData.semester.trim() === "") {
      errors.semester = "Semester is required.";
    }

    // require selectedRegulation to be set (so we can send regulationCode)
    if (!selectedRegulation) {
      errors.regulation = "Please select a regulation.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      setMsg(errors[firstKey]);
      return false;
    }

    setMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const body = new FormData();
      body.append("studentId", formData.studentId);
      body.append("address", formData.address);
      body.append("phone", formData.phone);
      body.append("semester", formData.semester);
      // send both for safety: human label and the code expected by backend
      body.append("regulation", selectedRegulation?.display || formData.regulation || "");
      body.append("regulationCode", selectedRegulation?.regulationId || "");

      if (selectedFile) {
        body.append("photo", selectedFile, selectedFile.name);
      }

      const res = await fetch(`${API_BASE}/student/updateStudent`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body,
      });

      if (!res.ok) {
        let errText = `Update failed (${res.status})`;
        try {
          const t = await res.text();
          if (t) errText = t;
        } catch {}
        throw new Error(errText);
      }

      const t = await res.text();
      setMsg(t || "Updated successfully");

      // short delay so user sees success message
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      setMsg(err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const imageSrc = previewUrl === null ? ONLINE_PLACEHOLDER : previewUrl || teacher;

  return (
    <>
      <StudentNavBar />
      <section className="flex flex-col lg:flex-row gap-6 bg-gray-50 min-h-screen px-4 sm:px-6 md:px-8 py-10 overflow-auto">
        <div className="w-full sm:flex sm:justify-center lg:w-1/3">
          <SectionLeft />
        </div>

        <div className="flex flex-col flex-1 items-center lg:w-2/3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">
            Update Student Details
          </h1>

          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">
            <div className="shadow-xl rounded-xl p-6 bg-white flex flex-col items-center w-full sm:max-w-md sm:mx-auto lg:w-1/2">
              <img
                src={imageSrc}
                alt="Profile Preview"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl mb-4"
                onError={() => {
                  if (imageSrc !== ONLINE_PLACEHOLDER) {
                    setPreviewUrl(null);
                  } else {
                    setPreviewUrl(undefined);
                  }
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-blue-100 p-2 rounded-lg w-full cursor-pointer"
              />
              <p className="text-gray-500 mt-3 text-sm text-center">
                Upload or update your profile photo (Max 5MB)
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="shadow-xl rounded-xl p-6 bg-white flex flex-col gap-4 w-full sm:max-w-md sm:mx-auto lg:w-1/2"
              noValidate
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  className="bg-gray-200 p-3 rounded-lg w-full text-sm cursor-not-allowed"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  readOnly
                  aria-label="Student ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  className={`p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200 ${
                    fieldErrors.address ? "border border-red-400 bg-red-50" : "bg-blue-50 border border-blue-200"
                  }`}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  aria-invalid={!!fieldErrors.address}
                  required
                />
                {fieldErrors.address && <div className="text-xs text-red-600 mt-1">{fieldErrors.address}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  className={`p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200 ${
                    fieldErrors.phone ? "border border-red-400 bg-red-50" : "bg-blue-50 border border-blue-200"
                  }`}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  aria-invalid={!!fieldErrors.phone}
                  required
                />
                {fieldErrors.phone && <div className="text-xs text-red-600 mt-1">{fieldErrors.phone}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  className={`p-3 rounded-lg w-full text-sm placeholder-gray-500 transition duration-200 ${
                    fieldErrors.semester ? "border border-red-400 bg-red-50" : "bg-blue-50 border border-blue-200"
                  }`}
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Semester --</option>
                  {[1,2,3,4,5,6,7,8].map((s) => (
                    <option key={s} value={String(s)}>{s}</option>
                  ))}
                </select>
                {fieldErrors.semester && <div className="text-xs text-red-600 mt-1">{fieldErrors.semester}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Regulation <span className="text-red-500">*</span>
                </label>
                <select
                  name="regulationSelect"
                  value={selectedRegulation?.regulationId || ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    const sel = regulations.find(r => r.regulationId === id) || null;
                    setSelectedRegulation(sel);
                    setFormData((prev) => ({ ...prev, regulation: sel ? sel.display : "" }));
                    setFieldErrors((prev) => ({ ...prev, regulation: "" }));
                    setMsg("");
                  }}
                  className={`p-3 rounded-lg w-full text-sm transition duration-200 ${
                    fieldErrors.regulation ? "border border-red-400 bg-red-50" : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <option value="">{regLoading ? "Loading Regulations..." : "-- Select Regulation --"}</option>
                  {regulations.map((r) => (
                    <option key={r.regulationId} value={r.regulationId}>
                      {r.display}
                    </option>
                  ))}
                </select>
                {fieldErrors.regulation && <div className="text-xs text-red-600 mt-1">{fieldErrors.regulation}</div>}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="text-white bg-yellow-500 p-3 rounded-lg w-full font-semibold hover:bg-yellow-600 shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update"}
              </button>

              {msg && (
                <p className={`${Object.keys(fieldErrors).length > 0 ? "text-red-600" : "text-green-700"} text-center mt-2 text-sm`}>
                  {msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateStudent;
