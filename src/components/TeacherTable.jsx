
import React from "react";
import tableBg from "../asset/Table_backGround.png"
const Table = () => {

    return (

        <div className="flex justify-center items-center gap-50">

            <div >
                <table className="border-separate  text-center shadow-lg rounded-lg">

                    <thead className=" text-white bg-orange-300">
                        <tr>
                            <th className=" px-4 py-2  border border-[white] rounded-tl-lg">Roll Number</th>
                            <th className=" px-4 py-2  border border-[white] ">Name</th>
                            <th className=" px-4 py-2  border border-[white] rounded-tr-lg">Course</th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundImage: `url(${tableBg})` }}>

                        <tr >
                            <td className="px-4 py-2 border border-[white]">20000001 </td>
                            <td className="px-4 py-2 border border-[white]">Prem Kr </td>
                            <td className="px-4 py-2 border border-[white]">Data Structures</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000002 </td>
                            <td className="px-4 py-2 border border-[white]">Aarav Singh </td>
                            <td className="px-4 py-2 border border-[white]">Fluid Mechanics </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000003 </td>
                            <td className="px-4 py-2 border border-[white]">Neha Sharma </td>
                            <td className="px-4 py-2 border border-[white]">Microprocessors </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000004 </td>
                            <td className="px-4 py-2 border border-[white]">Rohit Patel </td>
                            <td className="px-4 py-2 border border-[white]">Surveying </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000005</td>
                            <td className="px-4 py-2 border border-[white]">Siya Verma </td>
                            <td className="px-4 py-2 border border-[white]">Computer Networks </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000006</td>
                            <td className="px-4 py-2 border border-[white]">Karan Roy </td>
                            <td className="px-4 py-2 border border-[white]">Thermodynamics </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000007</td>
                            <td className="px-4 py-2 border border-[white]">Aisha Khan </td>
                            <td className="px-4 py-2 border border-[white]">Genetic Engineering </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000008 </td>
                            <td className="px-4 py-2 border border-[white]">Vikram Das </td>
                            <td className="px-4 py-2 border border-[white]">Algorithms </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000009 </td>
                            <td className="px-4 py-2 border border-[white]">Meera Jain</td>
                            <td className="px-4 py-2 border border-[white]">VLSI Design</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white] ">20000010</td>
                            <td className="px-4 py-2 border border-[white] ">Aditya Gupta </td>
                            <td className="px-4 py-2 border border-[white] ">DBMS </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="bg-white rounded-b-lg px-4 py-2">
                                <div className="flex justify-between font-bold">
                                    <span className="hover:text-orange-300"><a href="">{"<< Prev. Page"}</a></span>
                                    <span className="hover:text-orange-300"><a href="">{"Next Page >>"}</a></span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>

                </table>
            </div>

            <div>
                <p className="font-bold hover:text-orange-300"><a href="">{"Search Student >>"}</a></p>
            </div>

            <div>

                <table className="border-separate  text-center shadow-lg rounded-lg">

                    <thead className=" text-white bg-orange-300">
                        <tr>
                            <th className=" px-4 py-2  border border-[white] rounded-tl-lg">Roll Number</th>
                            <th className=" px-4 py-2  border border-[white] ">Name</th>
                            <th className=" px-4 py-2  border border-[white] rounded-tr-lg">Course</th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundImage: `url(${tableBg})` }}>

                        <tr >
                            <td className="px-4 py-2 border border-[white]">20000001 </td>
                            <td className="px-4 py-2 border border-[white]">Prem Kr </td>
                            <td className="px-4 py-2 border border-[white]">Data Structures</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000002 </td>
                            <td className="px-4 py-2 border border-[white]">Aarav Singh </td>
                            <td className="px-4 py-2 border border-[white]">Fluid Mechanics </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000003 </td>
                            <td className="px-4 py-2 border border-[white]">Neha Sharma </td>
                            <td className="px-4 py-2 border border-[white]">Microprocessors </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000004 </td>
                            <td className="px-4 py-2 border border-[white]">Rohit Patel </td>
                            <td className="px-4 py-2 border border-[white]">Surveying </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000005</td>
                            <td className="px-4 py-2 border border-[white]">Siya Verma </td>
                            <td className="px-4 py-2 border border-[white]">Computer Networks </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000006</td>
                            <td className="px-4 py-2 border border-[white]">Karan Roy </td>
                            <td className="px-4 py-2 border border-[white]">Thermodynamics </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000007</td>
                            <td className="px-4 py-2 border border-[white]">Aisha Khan </td>
                            <td className="px-4 py-2 border border-[white]">Genetic Engineering </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000008 </td>
                            <td className="px-4 py-2 border border-[white]">Vikram Das </td>
                            <td className="px-4 py-2 border border-[white]">Algorithms </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white]">20000009 </td>
                            <td className="px-4 py-2 border border-[white]">Meera Jain</td>
                            <td className="px-4 py-2 border border-[white]">VLSI Design</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border border-[white] ">20000010</td>
                            <td className="px-4 py-2 border border-[white] ">Aditya Gupta </td>
                            <td className="px-4 py-2 border border-[white] ">DBMS </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="bg-white rounded-b-lg px-4 py-2">
                                <div className="flex justify-between font-bold">
                                    <span className="hover:text-orange-300"><a href="">{"<< Prev. Page"}</a></span>
                                    <span className="hover:text-orange-300"><a href="">{"Next Page >>"}</a></span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>

                </table>

            </div>

        </div>

    );


}
export default Table;