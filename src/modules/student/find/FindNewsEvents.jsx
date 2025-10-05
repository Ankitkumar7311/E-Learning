// src/modules/student/AnnouncementsList.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * AnnouncementsList
 * - Fetches announcements from /student/getAnnouncement
 * - Client-side filters:
 *    - text search against describeEvents (case-insensitive)
 *    - start / end publish datetime (datetime-local inputs)
 *    - type filter (All / Announcement / Notice)
 * - Pagination (client-side) with page size selector
 * - Sorting: Date asc/desc buttons
 * - "View" button opens a large modal showing full announcement content
 */

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080/VidyaSarthi';

const readToken = () => {
  try {
    const vs = localStorage.getItem("vidyaSarthiAuth");
    if (vs) {
      const parsed = JSON.parse(vs || "{}");
      if (parsed?.token) return parsed.token;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    console.warn("readToken error", e);
    return localStorage.getItem("token") || null;
  }
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

const defaultPageSizes = [5, 10, 20];

const AnnouncementsList = () => {
  const token = readToken();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [textFilter, setTextFilter] = useState("");
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [selectedType, setSelectedType] = useState("All"); // All | Announcement | Notice

  // pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // modal
  const [openAnnouncement, setOpenAnnouncement] = useState(null);

  // sorting: false -> ascending, true -> descending (newest first)
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/student/getAnnouncement`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Server returned ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setAnnouncements([]);
      } else {
        setAnnouncements(data);
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError(err.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDate = useMemo(() => (startFilter ? new Date(startFilter) : null), [startFilter]);
  const endDate = useMemo(() => (endFilter ? new Date(endFilter) : null), [endFilter]);

  const filtered = useMemo(() => {
    let list = Array.isArray(announcements) ? announcements.slice() : [];

    // text filter
    if (textFilter && textFilter.trim()) {
      const q = textFilter.trim().toLowerCase();
      list = list.filter(a =>
        (a?.describeEvents || "").toLowerCase().includes(q) ||
        (a?.type || "").toLowerCase().includes(q) ||
        (a?.facultyId || "").toLowerCase().includes(q)
      );
    }

    // type filter
    if (selectedType && selectedType !== "All") {
      const t = selectedType.toLowerCase();
      list = list.filter(a => (a?.type || "").toLowerCase() === t);
    }

    // date range filter
    if (startDate || endDate) {
      list = list.filter(a => {
        if (!a?.publishDateTime) return false;
        const d = new Date(a.publishDateTime);
        if (isNaN(d.getTime())) return false;
        if (startDate && d < startDate) return false;
        if (endDate && d > endDate) return false;
        return true;
      });
    }

    // sort by date
    list.sort((x, y) => {
      const dx = x?.publishDateTime ? new Date(x.publishDateTime).getTime() : 0;
      const dy = y?.publishDateTime ? new Date(y.publishDateTime).getTime() : 0;
      return sortNewestFirst ? dy - dx : dx - dy;
    });

    return list;
  }, [announcements, textFilter, startDate, endDate, sortNewestFirst, selectedType]);

  // pagination calculations
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const clearFilters = () => {
    setTextFilter("");
    setStartFilter("");
    setEndFilter("");
    setSelectedType("All");
    setPage(1);
  };

  const onView = (a) => setOpenAnnouncement(a);
  const closeModal = () => setOpenAnnouncement(null);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Announcements & Notices</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnnouncements}
            className="px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-1">
          <label className="text-sm font-medium block mb-1">Search (text/type/faculty)</label>
          <input
            type="search"
            value={textFilter}
            onChange={(e) => { setTextFilter(e.target.value); setPage(1); }}
            placeholder="Search description..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Start (publish datetime)</label>
          <input
            type="datetime-local"
            value={startFilter}
            onChange={(e) => { setStartFilter(e.target.value); setPage(1); }}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">End (publish datetime)</label>
          <input
            type="datetime-local"
            value={endFilter}
            onChange={(e) => { setEndFilter(e.target.value); setPage(1); }}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Type</label>
          <div className="flex gap-2">
            {["All", "Announcement", "Notice"].map((t) => (
              <button
                key={t}
                onClick={() => { setSelectedType(t); setPage(1); }}
                className={`px-3 py-2 rounded border text-sm ${selectedType === t ? "bg-yellow-400 text-white border-yellow-500" : "bg-white hover:bg-gray-50"}`}
                aria-pressed={selectedType === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 flex items-center gap-3 mt-2">
          <button onClick={clearFilters} className="px-3 py-2 bg-red-100 border text-red-700 rounded">Clear filters</button>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm mr-2">Sort by date:</label>
            <button
              onClick={() => { setSortNewestFirst(false); }}
              className={`px-3 py-1 border rounded text-sm ${!sortNewestFirst ? "bg-yellow-400 text-white" : "bg-white"}`}
              title="Date ascending (oldest first)"
            >
              Date ↑
            </button>
            <button
              onClick={() => { setSortNewestFirst(true); }}
              className={`px-3 py-1 border rounded text-sm ${sortNewestFirst ? "bg-yellow-400 text-white" : "bg-white"}`}
              title="Date descending (newest first)"
            >
              Date ↓
            </button>

            <label className="text-sm ml-3">Page size</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="p-2 border rounded">
              {defaultPageSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white border rounded shadow-sm">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            <p className="mt-3 text-gray-600">Loading announcements...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">Found <strong>{total}</strong> announcement(s)</div>
                <div className="text-sm text-gray-500">Page {page} / {totalPages}</div>
              </div>

              {total === 0 ? (
                <div className="p-6 text-center text-gray-500">No announcements match your filters.</div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b bg-gray-50">
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Description (preview)</th>
                      <th className="py-2 px-3">Faculty ID</th>
                      <th className="py-2 px-3">Published</th>
                      <th className="py-2 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((a) => (
                      <tr key={a.id} className="border-b align-top">
                        <td className="py-2 px-3 font-medium">{a.type || "—"}</td>
                        <td className="py-2 px-3">
                          <div className="text-xs text-gray-700 max-w-xl truncate" title={a.describeEvents}>
                            {a.describeEvents ? a.describeEvents.replace(/\n/g, " ") : "—"}
                          </div>
                        </td>
                        <td className="py-2 px-3">{a.facultyId || "—"}</td>
                        <td className="py-2 px-3">{formatDateTime(a.publishDateTime)}</td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => onView(a)}
                            className="px-3 py-1 rounded bg-yellow-500 text-white text-xs hover:bg-yellow-600"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination controls */}
            {total > 0 && (
              <div className="flex items-center justify-between p-3 border-t bg-gray-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                  >
                    ◀
                  </button>
                  <span className="px-3 text-sm">Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 1;
                      if (v <= 0) return;
                      setPage(Math.min(Math.max(1, v), totalPages));
                    }}
                    className="w-16 p-1 border rounded text-sm"
                  />
                  <span className="text-sm">of {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                  >
                    ⏭
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View modal */}
      {openAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{openAnnouncement.type || "Announcement"}</h3>
                <div className="text-xs text-gray-500">Published: {formatDateTime(openAnnouncement.publishDateTime)}</div>
                <div className="text-xs text-gray-500">Faculty: {openAnnouncement.facultyId || "—"}</div>
              </div>
              <div>
                <button onClick={closeModal} className="text-xl px-3 py-1 rounded hover:bg-gray-100">✕</button>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{openAnnouncement.describeEvents || "—"}</div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 rounded border bg-white hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
