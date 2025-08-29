import React, { useState } from "react";

const RegulationForm = () => {
    const regulations = ["R15", "R17", "R19", "R21"];
    const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
    const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];
    const subjects = ["A", "B", "C", "D", "E", "F"];

    const [formData, setFormData] = useState({
        regulation: "",
        branch: "",
        semester: "",
        subjects: Array(subjects.length).fill(""),
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (index, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index] = value;
        setFormData({ ...formData, subjects: newSubjects });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="w-full flex justify-center mt-10 ">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-2xl p-6 w-[800px]"
            >
                <h2 className="text-xl font-semibold mb-4">Add Regulation</h2>


                <div className="mb-3 flex items-center gap-4">
                    <label className="w-40">Choose Regulation :</label>
                    <select
                        name="regulation"
                        value={formData.regulation}
                        onChange={handleChange}
                        className="flex-1 p-2 rounded-md bg-blue-100"
                    >
                        <option value="">Choose a Regulation from drop down</option>
                        {regulations.map((reg, idx) => (
                            <option key={idx} value={reg}>{reg}</option>
                        ))}
                    </select>
                </div>


                <div className="mb-3 flex items-center gap-4">
                    <label className="w-40">Choose Branch :</label>
                    <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="flex-1 p-2 rounded-md bg-blue-100"
                    >
                        <option value="">Choose a Branch from drop down</option>
                        {branches.map((br, idx) => (
                            <option key={idx} value={br}>{br}</option>
                        ))}
                    </select>
                </div>


                <div className="mb-3 flex items-center gap-4">
                    <label className="w-40">Choose Semister :</label>
                    <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="flex-1 p-2 rounded-md bg-blue-100"
                    >
                        <option value="">Choose a Semister from drop down</option>
                        {semesters.map((sem, idx) => (
                            <option key={idx} value={sem}>{sem}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Subjects: <span className="text-sm">(Choose Priority Wise)</span></label>
                    <div className="flex gap-3 flex-wrap">
                        {subjects.map((sub, index) => (
                            <select
                                key={index}
                                value={formData.subjects[index]}
                                onChange={(e) => handleSubjectChange(index, e.target.value)}
                                className="p-2 rounded-md bg-blue-100"
                            >
                                <option value="">{sub}. Choose</option>
                                <option value="Maths">Maths</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="English">English</option>
                            </select>
                        ))}
                    </div>
                </div>


                <button
                    type="submit"
                    className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition block mx-auto"
                >
                    Submit Now
                </button>
            </form>
        </div>
    );
};

export default RegulationForm;
