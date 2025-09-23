import React from "react";
import studentprofile from "../../assets/studentprofile.png";

const StudentProfile = () => {
  return (
    <main className="h-screen w-full overflow-x-hidden flex justify-center items-center bg-gray-100">
      <section className="w-[95%] max-w-6xl h-[95%] bg-white rounded-2xl shadow-lg p-6 overflow-hidden flex flex-col">
        
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold border-y-2 py-1 inline-block px-4">
            Student Information : 2024-25 (Autumn)
          </h2>
        </div>

        {/* Profile Info */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm mb-4 text-sm">
          <aside className="w-1/3 space-y-1">
            <p><b>Name:</b> Prem Kumar</p>
            <p><b>Program:</b> B.Tech</p>
            <p><b>Branch:</b> CSE</p>
            <p><b>Type:</b> Regular</p>
          </aside>
          <aside className="w-1/3 space-y-1 text-right">
            <p><b>Roll:</b> 200XXXX</p>
            <p><b>Batch:</b> 2021-25</p>
            <p><b>Semester:</b> VI</p>
            <p><b>Active Backlog:</b> 0</p>
          </aside>
          <aside className="w-1/3 flex justify-center">
            <img
              src={studentprofile}
              alt="student profile"
              className="h-28 w-28 object-cover rounded-full border-2 border-gray-300 shadow-md"
            />
          </aside>
        </div>

        {/* Scrollable Content */}
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
          
          {/* Course Table */}
          <div className="overflow-y-auto border rounded-lg shadow-sm">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px]">
                <table className="table-auto w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-2 py-1">S.N</th>
                      <th className="px-2 py-1">Code</th>
                      <th className="px-2 py-1">Course</th>
                      <th className="px-2 py-1">L</th>
                      <th className="px-2 py-1">T</th>
                      <th className="px-2 py-1">P</th>
                      <th className="px-2 py-1">C</th>
                      <th className="px-2 py-1">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr><td>1.</td><td>CS304</td><td>Compiler Design</td><td>3</td><td>0</td><td>0</td><td>3</td><td>Compulsory</td></tr>
                    <tr><td>2.</td><td>CS305</td><td>Computer Networks</td><td>3</td><td>0</td><td>0</td><td>3</td><td>Compulsory</td></tr>
                    <tr><td>3.</td><td>CS306</td><td>Computer Graphics</td><td>3</td><td>0</td><td>2</td><td>4</td><td>Compulsory</td></tr>
                    <tr><td>4.</td><td>CS307</td><td>Machine Learning</td><td>3</td><td>0</td><td>0</td><td>3</td><td>Compulsory</td></tr>
                    <tr><td>5.</td><td>ME306</td><td>Environmental Sciences</td><td>2</td><td>0</td><td>0</td><td>2</td><td>Compulsory</td></tr>
                    <tr><td>6.</td><td>CS312</td><td>Compiler Design LAB</td><td>0</td><td>0</td><td>3</td><td>2</td><td>Compulsory</td></tr>
                    <tr><td>7.</td><td>CS313</td><td>Computer Networks LAB</td><td>0</td><td>0</td><td>3</td><td>2</td><td>Compulsory</td></tr>
                    <tr><td>8.</td><td>CS314</td><td>Machine Learning LAB</td><td>0</td><td>0</td><td>3</td><td>2</td><td>Compulsory</td></tr>
                    <tr><td>9.</td><td>N/A</td><td>Elective-I</td><td>3</td><td>1</td><td>0</td><td>4</td><td>Elective</td></tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="3" className="text-right pr-2">Total Credits</td>
                      <td colSpan="5">24</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Fee Table */}
          <div className="overflow-y-auto border rounded-lg shadow-sm">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px]">
                <table className="table-auto w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-2 py-1">Type</th>
                      <th className="px-2 py-1">S.N</th>
                      <th className="px-2 py-1">For</th>
                      <th className="px-2 py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr><td rowSpan="2">Recurring Fee</td><td>1.</td><td>Tuition Fee</td><td>₹ 90,000.00</td></tr>
                    <tr><td>2.</td><td>Other Institute Fee</td><td>₹ 11,250.00</td></tr>
                    <tr><td rowSpan="2">One Time Fee</td><td>3.</td><td>Admission/Convocation</td><td>N/A</td></tr>
                    <tr><td>4.</td><td>Fine</td><td>0.00</td></tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="3">Total</td>
                      <td>₹ 1,01,250.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-2 gap-3 text-sm font-medium mt-4">
          <aside className="bg-green-50 p-2 rounded-lg shadow">
            Registration Status: <span className="text-green-700 font-semibold">Complete ✔️</span>
          </aside>
          <aside className="bg-green-50 p-2 rounded-lg shadow">
            Payment Status: <span className="text-green-700 font-semibold">Verified ✔️</span>
          </aside>
          <aside className="bg-gray-50 p-2 rounded-lg shadow">
            Signature of Faculty Advisor
          </aside>
          <aside className="bg-gray-50 p-2 rounded-lg shadow">
            Signature of F/I Academic UG/PG
          </aside>
        </div>
      </section>
    </main>
  );
};

export default StudentProfile;
