// TeacherTables.jsx
import React from "react";

const TeacherTables = () => {
  const rows = [
    { sn: 1, materialId: "CS304", subjectCode: "ME304", title: "Operating System", type: "Notes" },
    { sn: 2, materialId: "CS304", subjectCode: "ME304", title: "OP QB", type: "QB" },
    { sn: 3, materialId: "CS304", subjectCode: "ME304", title: "OP - PYQ", type: "PYQ" },
    { sn: 4, materialId: "CS304", subjectCode: "ME304", title: "Practice", type: "NOTES" },
  ];

  return (
    <div className="flex justify-center items-start">
      <table className="w-[35rem] h-[22rem] border-2 border-black border-collapse text-center bg-white rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-black px-2 py-2">S.N</th>
            <th className="border border-black px-2 py-2">Material_ID</th>
            <th className="border border-black px-2 py-2">Subject_CODE</th>
            <th className="border border-black px-2 py-2">Title</th>
            <th className="border border-black px-2 py-2">TYPE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sn}>
              <td className="border border-black px-3 py-2">{r.sn}.</td>
              <td className="border border-black px-2 py-2">{r.materialId}</td>
              <td className="border border-black px-2 py-2">{r.subjectCode}</td>
              <td className="border border-black px-2 py-2">{r.title}</td>
              <td className="border border-black px-2 py-2">{r.type}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black px-3 py-6">5.</td>
            <td className="border border-black" colSpan={3}></td>
            <td className="border border-black"></td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-6">6.</td>
            <td className="border border-black" colSpan={3}></td>
            <td className="border border-black"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td className="border border-black px-4 py-2" colSpan={4}>
              Total
            </td>
            <td className="border border-black text-center">5</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TeacherTables;
