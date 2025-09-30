import React from "react";

/**
 * News (Results) list — static dates, sorted latest -> oldest
 * - Titles auto-convert "Advanced Supplementary" -> "Regular" and append R-codes.
 * - No vertical column lines; subtle horizontal dividers only.
 */

const rawRows = [
  {
    title:
      "JNTUH B.Tech 4-2 Semester Advanced Supplementary Examinations Results - August 2025",
    time: "Friday at 7:55 AM",
    date: "2025-09-26",
    code: "R18",
  },
  {
    title:
      "JNTUH B.Pharm 2-1 Semester Advanced Supplementary Examinations Results - August 2025",
    time: "Thursday at 10:30 AM",
    date: "2025-09-25",
    code: "R20",
  },
  {
    title:
      "JNTUH M.Tech 1-1 Semester Regular Examinations Results - August 2025",
    time: "Wednesday at 9:00 AM",
    date: "2025-09-20",
    code: "R21",
  },
  {
    title:
      "JNTUH B.Tech 2-2 Semester Advanced Supplementary Examinations Results - August 2025",
    time: "Tuesday at 2:15 PM",
    date: "2025-09-18",
    code: "R18",
  },
  {
    title: "JNTUH MBA I Semester Regular Examinations Results - August 2025",
    time: "Monday at 11:45 AM",
    date: "2025-09-15",
    code: "R20",
  },
  {
    title:
      "JNTUH B.Tech 3-1 Semester Advanced Supplementary Examinations Results - July 2025",
    time: "Sunday at 6:00 PM",
    date: "2025-09-10",
    code: "R21",
  },
  {
    title: "JNTUH B.Sc 2-1 Semester Regular Examinations Results - August 2025",
    time: "Saturday at 8:20 AM",
    date: "2025-08-30",
    code: "R18",
  },
  {
    title: "JNTUH B.Tech 4-2 Semester Regular Examinations Results - September 2025",
    time: "Friday at 5:00 PM",
    date: "2025-08-22",
    code: "R20",
  },
  {
    title: "JNTUH BCA 3-2 Semester Advanced Supplementary Examinations Results - Aug 2025",
    time: "Thursday at 4:10 PM",
    date: "2025-08-12",
    code: "R18",
  },
  {
    title: "JNTUH B.Tech 1-2 Semester Regular Examinations Results - Aug 2025",
    time: "Wednesday at 12:30 PM",
    date: "2025-07-30",
    code: "R21",
  },
];

const formatTitle = (rawTitle, code) => {
  let t = rawTitle;
  t = t.replace(/Advanced Supplementary/gi, "Regular");
  t = t.replace(/Examinations Results/gi, "Examination Results");
  t = t.replace(/Examinations/gi, "Examination");
  t = t.replace(/\s{2,}/g, " ").trim();

  if (code && !/\bR(18|20|21)\b/i.test(t)) {
    t = `${t} (${code})`;
  }

  return t;
};

const formatDateShort = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const News = () => {
  // sort rows by date descending (newest first)
  const rows = [...rawRows].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="pt-16 pb-12 px-4 md:px-8 lg:px-16 min-h-screen bg-gradient-to-b from-white via-[#F8FAFF] to-white">
      <div className="max-w-6xl mx-auto">
      

        <div className="bg-white/95 shadow-md rounded-2xl overflow-hidden">
          {/* Visual header for larger screens */}
          <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-3 bg-[#D8E7F5] bg-opacity-30">
            <div className="col-span-9 text-sm md:text-base font-medium text-gray-700">Result Title</div>
            <div className="col-span-3 text-sm md:text-base font-medium text-gray-700 text-right">Published</div>
          </div>

          {/* Rows */}
          <div role="table" className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <div
                role="row"
                key={idx}
                className="grid grid-cols-12 gap-4 items-center px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
                aria-label={`news-row-${idx}`}
              >
                <div className="col-span-12 md:col-span-9">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block rounded-full w-3 h-3 bg-[#F3B300] shrink-0" aria-hidden />
                    <div>
                      <div className="text-sm md:text-base font-semibold text-gray-900">
                        {formatTitle(r.title, r.code)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 mt-1">
                        Official announcement — check the university portal for detailed marks and PDFs.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 text-sm md:text-base text-gray-600 md:text-right mt-2 md:mt-0">
                  {`${r.time} · ${formatDateShort(r.date)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
