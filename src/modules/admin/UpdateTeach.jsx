import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import teacher from "../../assets/teacher.jpg";

const API_BASE = "http://localhost:8080/VidyaSarthi"; // adjust if different

// read auth - supports vidyaSarthiAuth or user/token
const getAuthFromLocalStorage = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const p = JSON.parse(vs || "{}");
      return { facultyId: p?.facultyId || null, token: p?.token || null };
    }
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token") || null;
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        return { facultyId: u?.facultyId || u?.userId || null, token };
      } catch {
        return { facultyId: null, token };
      }
    }
    return { facultyId: null, token: null };
  } catch (err) {
    console.error("auth read error", err);
    return { facultyId: null, token: null };
  }
};

const BRANCH_OPTIONS = [
  { value: "", label: "-- Select Branch --" }, // force user to choose
  { value: "CSE", label: "Computer Science (CSE)" },
  { value: "ECE", label: "Electronics (ECE)" },
  { value: "ME", label: "Mechanical (ME)" },
  { value: "CE", label: "Civil (CE)" },
];

/** Convert a base64 string to a Blob */
const base64ToBlob = (base64, contentType = "image/jpeg") => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

// online placeholder (used when backend has no image or fetch fails)
const ONLINE_PLACEHOLDER = "https://ui-avatars.com/api/?name=No+Profile&background=0D8ABC&color=fff&size=256";

const UpdateTeach = () => {
  const location = useLocation();
  const { facultyId: stateFacultyId } = location.state || {};
  const { facultyId: storedFacultyId, token } = getAuthFromLocalStorage();
  const facultyId = stateFacultyId || storedFacultyId;

  const [formData, setFormData] = useState({
    address: "",
    branch: "", // required - user must choose
    designation: "",
    phone: "",
  });

  const [subjectOptions, setSubjectOptions] = useState([]); // [{code, name}, ...]
  const [selectedCodes, setSelectedCodes] = useState([]); // selected subject codes
  const [filterText, setFilterText] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // objectURL for fetched image or uploaded preview

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(""); // used for inline error/success messages
  const [fieldErrors, setFieldErrors] = useState({}); // per-field error hints

  // Fetch subject list (same as before)
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/faculty/getSubjectList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn("Failed fetching subjects:", res.status);
          return;
        }
        const j = await res.json();
        const subjMap = j?.subject || {};
        const arr = Object.keys(subjMap).map((k) => ({ code: k, name: subjMap[k] }));
        setSubjectOptions(arr);
      } catch (err) {
        console.error("Error loading subjects:", err);
      }
    };
    fetchSubjects();
  }, [token]);

  // Load teacher picture from backend when facultyId available
  useEffect(() => {
    let cancelled = false;

    // cleanup helper to revoke previous objectURL
    const cleanup = () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {}
      }
    };

    const fetchPicture = async () => {
      if (!facultyId) {
        // no facultyId => use placeholder (null => handled in JSX)
        if (!cancelled) setPreviewUrl(null);
        return;
      }

      // try multiple commonly used endpoint shapes; adjust if your backend differs
      const endpointsToTry = [
        `${API_BASE}/faculty/getPic/${encodeURIComponent(facultyId)}`, // /faculty/getPic/{id}
      ];

      for (const url of endpointsToTry) {
        if (cancelled) return;
        try {
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch(url, { method: "GET", headers });
          if (!res.ok) {
            // try next url
            console.debug("getPic endpoint returned", res.status, "for", url);
            continue;
          }

          const contentType = (res.headers.get("content-type") || "").toLowerCase();

          if (contentType.startsWith("image/")) {
            // raw image bytes => create blob URL
            const blob = await res.blob();
            if (cancelled) return;
            cleanup();
            const objUrl = URL.createObjectURL(blob);
            setPreviewUrl(objUrl);
            return;
          }

          // not image/* content-type, read text to check JSON or base64
          const text = await res.text();
          if (!text) {
            console.debug("getPic empty response from", url);
            continue;
          }

          // try JSON { imageData: "...base64..." } or similar
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
            // unknown json shape -> continue to next endpoint
          } catch (err) {
            // not JSON, maybe plain base64 string in body
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
                console.debug("Failed to convert plain base64 text from", url, inner);
              }
            }
          }
        } catch (err) {
          console.debug("getPic fetch failed for", url, err);
          // try next endpoint
        }
      }

      // nothing matched -> set to null so UI shows online placeholder
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyId, token]);

  // cleanup previewUrl when user selects a new local file (we set preview below)
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

  const toggleCode = (code) => {
    setSelectedCodes((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code];
      setFieldErrors((prevErr) => ({ ...prevErr, subjectCodes: "" }));
      setMsg("");
      return next;
    });
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

    // create local preview for uploaded file, and clean previous preview URL
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
    if (!facultyId) {
      errors.facultyId = "Faculty ID missing. Login again.";
    }
    if (!formData.address || formData.address.trim().length < 3) {
      errors.address = "Address is required (min 3 characters).";
    }
    if (!formData.branch) {
      errors.branch = "Please choose your branch.";
    }
    if (!formData.designation || formData.designation.trim().length < 2) {
      errors.designation = "Designation is required.";
    }
    if (!formData.phone || !/^\+?\d{7,15}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number (7-15 digits, optional leading +).";
    }
    if (selectedCodes.length === 0) {
      errors.subjectCodes = "Please select at least one subject.";
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
      body.append("facultyId", facultyId);
      body.append("address", formData.address);
      body.append("designation", formData.designation);
      body.append("phone", formData.phone);
      body.append("branch", formData.branch);

      selectedCodes.forEach((code) => body.append("subjectCodes", code));
      if (selectedFile) body.append("photo", selectedFile, selectedFile.name);

      const res = await fetch(`${API_BASE}/faculty/updateFaculty`, {
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
    } catch (err) {
      console.error("Update error:", err);
      setMsg(err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const visibleSubjects = subjectOptions.filter((s) =>
    `${s.code} ${s.name}`.toLowerCase().includes(filterText.toLowerCase())
  );

  // compute final image src: if previewUrl === null -> use online placeholder; if falsey undefined -> fallback to local teacher.jpg
  const imageSrc = previewUrl === null ? ONLINE_PLACEHOLDER : (previewUrl || teacher);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-2xl space-y-4" noValidate>
        {/* Responsive: Stacks vertically on small screens */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <img
            src={imageSrc}
            alt="Teacher"
            className="h-32 w-32 rounded-xl object-cover flex-shrink-0"
            onError={() => {
              // if object URL or remote img fails, fallback to online placeholder then local teacher.jpg
              if (imageSrc !== ONLINE_PLACEHOLDER) {
                setPreviewUrl(null); // try online placeholder next render
              } else {
                // placeholder failed — fallback to local file
                setPreviewUrl(undefined);
              }
            }}
          />
          <div className="w-full sm:flex-1">
            <input readOnly value={facultyId || ""} className="bg-gray-200 p-2 rounded w-full mb-2 cursor-not-allowed" aria-label="Faculty ID" />
            <label className="block mb-2" aria-hidden>
              <input accept="image/*" type="file" onChange={handleFileChange} />
            </label>
            <div className="text-sm text-gray-600 text-center sm:text-left">Profile photo (optional, max 5MB)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address <span className="text-red-500">*</span></label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={`p-2 rounded w-full ${fieldErrors.address ? "border border-red-400 bg-red-50" : "bg-blue-100"}`}
              aria-invalid={!!fieldErrors.address}
              aria-describedby={fieldErrors.address ? "err-address" : undefined}
              required
            />
            {fieldErrors.address && <div id="err-address" className="text-xs text-red-600 mt-1">{fieldErrors.address}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Branch <span className="text-red-500">*</span></label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={`p-2 rounded w-full ${fieldErrors.branch ? "border border-red-400 bg-red-50" : "bg-blue-100"}`}
              aria-invalid={!!fieldErrors.branch}
              aria-describedby={fieldErrors.branch ? "err-branch" : undefined}
              required
            >
              {BRANCH_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {fieldErrors.branch && <div id="err-branch" className="text-xs text-red-600 mt-1">{fieldErrors.branch}</div>}
          </div>
        </div>

        {/* Subject multi-select */}
        <div className="border rounded p-3 bg-gray-50">
          {/* Responsive: Stacks vertically on small screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-2">
            <input
              placeholder="Search subjects..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 rounded border w-full sm:w-auto"
              aria-label="Search subjects"
            />
            <div className="flex gap-2 items-center self-end sm:self-center">
              <button
                type="button"
                onClick={() => {
                  const visible = visibleSubjects.map((s) => s.code);
                  setSelectedCodes((prev) => Array.from(new Set([...prev, ...visible])));
                  setFieldErrors((prev) => ({ ...prev, subjectCodes: "" }));
                  setMsg("");
                }}
                className="text-sm text-blue-600 underline"
              >
                Select visible
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCodes([]);
                  setFieldErrors((prev) => ({ ...prev, subjectCodes: "" }));
                  setMsg("");
                }}
                className="text-sm text-red-600 underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-auto">
            {visibleSubjects.length === 0 ? (
              <div className="text-sm text-gray-500">No subjects found.</div>
            ) : (
              visibleSubjects.map((s) => (
                <label key={s.code} className="flex items-center gap-3 py-1">
                  <input
                    type="checkbox"
                    checked={selectedCodes.includes(s.code)}
                    onChange={() => toggleCode(s.code)}
                    aria-checked={selectedCodes.includes(s.code)}
                  />
                  <span className="font-medium">{s.code}</span>
                  <span className="text-gray-500">— {s.name}</span>
                </label>
              ))
            )}
            {fieldErrors.subjectCodes && <div className="text-xs text-red-600 mt-2">{fieldErrors.subjectCodes}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Designation <span className="text-red-500">*</span></label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className={`p-2 rounded w-full ${fieldErrors.designation ? "border border-red-400 bg-red-50" : "bg-blue-100"}`}
              aria-invalid={!!fieldErrors.designation}
              aria-describedby={fieldErrors.designation ? "err-designation" : undefined}
              required
            />
            {fieldErrors.designation && <div id="err-designation" className="text-xs text-red-600 mt-1">{fieldErrors.designation}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={`p-2 rounded w-full ${fieldErrors.phone ? "border border-red-400 bg-red-50" : "bg-blue-100"}`}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
              required
            />
            {fieldErrors.phone && <div id="err-phone" className="text-xs text-red-600 mt-1">{fieldErrors.phone}</div>}
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-400">
          {loading ? "Updating..." : "Update"}
        </button>

        {/* Global message area */}
        {msg && <p className={`${Object.keys(fieldErrors).length > 0 ? "text-red-600" : "text-green-700"} text-center mt-2`}>{msg}</p>}
      </form>
    </div>
  );
};

export default UpdateTeach;