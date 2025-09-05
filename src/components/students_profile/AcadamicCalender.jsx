import React from 'react';

const AcadamicCalender = () => {
  // Single source of truth for all course data, matching the provided image
  const allCourses = [
    { type: 'core', code: 'MEC701', title: 'Automation in Manufacturing', l: 3, t: 0, p: 0, credits: 3 },
    { type: 'core', code: 'PEC-III', title: '', l: 3, t: 0, p: 0, credits: 3 },
    { type: 'core', code: 'PEC-IV', title: '', l: 3, t: 0, p: 0, credits: 3 },
    { type: 'core', code: 'OEC III', title: '', l: 3, t: 0, p: 0, credits: 3 },
    { type: 'core', code: 'OEC IV', title: '', l: 3, t: 0, p: 0, credits: 3 },
    { type: 'core', code: 'ME701P', title: 'Lab VII (RAC)', l: 0, t: 0, p: 2, credits: 1 },
    { type: 'core', code: 'ME702D', title: 'Project-I', l: 0, t: 0, p: 4, credits: 2 },
    { type: 'core', code: 'ME703I', title: 'Internship Assessment', l: 0, t: 0, p: 2, credits: 1 },
    
    // Professional Electives (Matching the image)
    { type: 'pec3', code: 'MEP702', title: 'Refrigeration and Air Conditioning' },
    { type: 'pec3', code: 'MEP703', title: 'Cryogenics' },
    { type: 'pec3', code: 'MEP704', title: 'Gas Dynamics' },
    { type: 'pec4', code: 'MEP705', title: 'Power Plant Engineering' },
    { type: 'pec4', code: 'MEP706', title: 'Finite Element Analysis' },
    { type: 'pec4', code: 'MEP707', title: 'Tool Design' },

    // Open Electives (Matching the image)
    { type: 'oec3', code: 'MEO708', title: 'Mechanical Vibrations' },
    { type: 'oec3', code: 'MEO709', title: 'Convective Heat Transfer' },
    { type: 'oec3', code: 'MEO710', title: 'Micro and Nano Manufacturing' },
    { type: 'oec3', code: 'MEO711', title: 'Energy Systems and Management' },
    { type: 'oec3', code: 'MEO712', title: 'Condition Monitoring' },
    { type: 'oec4', code: 'MEO713', title: 'Rapid Prototyping' },
    { type: 'oec4', code: 'MEO714', title: 'Industrial Automation' },
    { type: 'oec4', code: 'MEO715', title: 'Technology management' },
    { type: 'oec4', code: 'MEO716', title: 'Computer Aided Manufacturing' },
    { type: 'oec4', code: 'MEO717', title: 'Maintenance Engineering & management' },
  ];

  // Filter courses for each section
  const coreCourses = allCourses.filter(course => course.type === 'core');
  const professionalElectives3 = allCourses.filter(course => course.type === 'pec3');
  const professionalElectives4 = allCourses.filter(course => course.type === 'pec4');
  const openElectives3 = allCourses.filter(course => course.type === 'oec3');
  const openElectives4 = allCourses.filter(course => course.type === 'oec4');

  // Calculate the total credits for core courses
  const totalCredits = coreCourses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="flex flex-col items-center p-8 bg-white font-serif">
      {/* Header Section */}
      <div className="text-center mb-6">
        <p className="font-bold">Semester - VII</p>
        <p className="font-bold">Branch: Mechanical Engineering</p>
      </div>

      {/* Main Subjects Table */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse border border-gray-900 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-900 text-center font-bold">S.N.</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Code</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Course Title</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Lecture</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Tutorial</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Practical</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Credits</th>
            </tr>
          </thead>
          <tbody>
            {coreCourses.map((course, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-900 text-center">{index + 1}</td>
                <td className="p-2 border border-gray-900 text-center">{course.code}</td>
                <td className="p-2 border border-gray-900 text-left">{course.title}</td>
                <td className="p-2 border border-gray-900 text-center">{course.l}</td>
                <td className="p-2 border border-gray-900 text-center">{course.t}</td>
                <td className="p-2 border border-gray-900 text-center">{course.p}</td>
                <td className="p-2 border border-gray-900 text-center">{course.credits}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan="6" className="p-2 border border-gray-900 text-right">Total credits</td>
              <td className="p-2 border border-gray-900 text-center">{totalCredits}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Professional Electives Table */}
      <div className="w-full max-w-4xl overflow-x-auto mt-8">
        <table className="w-full border-collapse border border-gray-900 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-900 text-center font-bold">Code</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Professional Elective-III (Anyone)</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Code</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Professional Elective-IV (Any one)</th>
            </tr>
          </thead>
          <tbody>
            {professionalElectives3.map((pec3, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-900 text-center">{pec3.code}</td>
                <td className="p-2 border border-gray-900 text-left">{pec3.title}</td>
                {professionalElectives4[index] && (
                  <>
                    <td className="p-2 border border-gray-900 text-center">{professionalElectives4[index].code}</td>
                    <td className="p-2 border border-gray-900 text-left">{professionalElectives4[index].title}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Open Electives Table */}
      <div className="w-full max-w-4xl overflow-x-auto mt-8">
        <table className="w-full border-collapse border border-gray-900 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-900 text-center font-bold">Code</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Open Elective-III (Any one)</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Code</th>
              <th className="p-2 border border-gray-900 text-center font-bold">Open Elective-IV(Any one)</th>
            </tr>
          </thead>
          <tbody>
            {openElectives3.map((oec3, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-900 text-center">{oec3.code}</td>
                <td className="p-2 border border-gray-900 text-left">{oec3.title}</td>
                {openElectives4[index] && (
                  <>
                    <td className="p-2 border border-gray-900 text-center">{openElectives4[index].code}</td>
                    <td className="p-2 border border-gray-900 text-left">{openElectives4[index].title}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcadamicCalender;