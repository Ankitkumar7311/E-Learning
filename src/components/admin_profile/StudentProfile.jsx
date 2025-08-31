import studentprofile from "../../assets/studentprofile.png";
let StudentProfile = () => {
  return (
    <>
      <main className=" border-2  h-400 w-full flex justify-center pt-10 ">
        <section className="h-380 rounded-4xl shadow-lg  w-222 flex-col justify-center items-center ">
          <div
            id="div1"
            className="flex justify-center "
          >
            <div className=" text-center m-10 w-150 border-t border-b  text-3xl"><h2>Student Information : 2024-25 (Autumn)</h2></div>
          </div>
          <div
            id="div2"
            className=" h-[250px] w-222 flex justify-around px-10 py-1 text-[20px] font-medium mb-2"
          >
            <aside
              id="1"
              className=" h-full w-1/3 flex justify-start items-center"
            >
              <span>
                <p>
                  Name: Prem Kumar <br />
                  Program: B.Tech <br />
                  Branch: CSE <br />
                  Type: Regular
                </p>
              </span>
            </aside>
            <aside
              id="2"
              className=" h-full w-1/3 flex justify-end items-center"
            >
              <span>
                <p>
                  Roll: 200XXXX <br />
                  Batch: 2021-25 <br />
                  Semester: VI <br />
                  Active Backlog: 0
                </p>
              </span>
            </aside>
            <aside
              id="3"
              className=" h-full w-1/3 flex justify-center items-center"
            >
              <img
                src={studentprofile}
                alt="student profile picture"
                className="h-45"
              />
            </aside>
          </div>
          <div
            id="div3"
            className=" h-[450px] w-222 flex justify-around px-5 py-1 text-[20px] font-medium"
          >
             
            <table className="table-auto w-222 h-full border border-black rounded-xl border-separate [&_td]:border [&_td]:border-black [&_th]:border [&_th]:border-black">


        <thead className="bg-gray-200">
          <tr>
            <th className="px-3 py-1">S.N</th>
            <th className="px-3 py-1">Code</th>
            <th className="px-3 py-1">Course Name</th>
            <th className="px-3 py-1">L</th>
            <th className="px-3 py-1">T</th>
            <th className="px-3 py-1">P</th>
            <th className="px-3 py-1">C</th>
            <th className="px-3 py-1">Type</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>1.</td>
            <td>CS304</td>
            <td className="text-center">Compiler Design</td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>2.</td>
            <td>CS305</td>
            <td className="text-center">Computer Networks</td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>3.</td>
            <td>CS306</td>
            <td className="text-center">Computer Graphics</td>
            <td>3</td>
            <td>0</td>
            <td>2</td>
            <td>4</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>4.</td>
            <td>CS307</td>
            <td className="text-center">Machine Learning</td>
            <td>3</td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>5.</td>
            <td>ME306</td>
            <td className="text-center">Environmental Sciences & Green..</td>
            <td>2</td>
            <td>0</td>
            <td>0</td>
            <td>2</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>6.</td>
            <td>CS312</td>
            <td className="text-center">Compiler Design LAB</td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>2</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>7.</td>
            <td>CS313</td>
            <td className="text-center">Computer Networks LAB</td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>2</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>8.</td>
            <td>CS314</td>
            <td className="text-center">Machine Learning LAB</td>
            <td>0</td>
            <td>0</td>
            <td>3</td>
            <td>2</td>
            <td>Compulsory</td>
          </tr>
          <tr>
            <td>9.</td>
            <td>N/A</td>
            <td className="text-center">Elective-I</td>
            <td>3</td>
            <td>1</td>
            <td>0</td>
            <td>4</td>
            <td>Elective</td>
          </tr>
          <tr>
            <td>-</td>
            <td>-</td>
            <td className="text-center">-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>Minor</td> 
         </tr>
          <tr>
            <td>-</td>
            <td>-</td>
            <td className="text-center">-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>Other</td> 
         </tr>
          <tr>
            <td colSpan="3" className="text-center font-semibold">
              Total Credits
            </td>
            <td colSpan="5">24</td>
          </tr>
        </tbody>
      </table>
      </div>
<br />

      <div
            id="div4"
            className=" h-[250px] w-222 flex justify-around px-5 py-1 text-[20px] font-medium"
          >
             
            <table className="table-auto w-222 h-full border border-black rounded-xl border-separate [&_td]:border [&_td]:border-black [&_th]:border [&_th]:border-black">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>S.N</th>
                    <th>For</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody className="text-center">
                <tr>
                    <td rowSpan="2">Recurring Fee</td>
                    <td>1.</td>
                    <td>Tuition Fee</td>
                    <td>₹ 90,000.00</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td>Other Institute Fee</td>
                    <td>₹ 11,250.00</td>
                </tr>
                <tr>
                    <td rowSpan="2">One Time Fee</td>
                    <td>3.</td>
                    <td>Admission Fee/Convocation Fee</td>
                    <td>N/A</td>
                </tr>
                 <tr>
                    <td>4.</td>
                    <td>Fine</td>
                    <td>0.00</td>
                </tr>
                <tr>
                    <th colSpan="3">Total</th>
                    <th> ₹ 1,01,250.00  </th>
                </tr>
            </tbody>
            </table>
            </div>

            <div id="div5" className=" h-[300px] w-222 grid grid-cols-2 justify-center p-5 items-center  text-[25px] font-medium text-start">
                <aside id="11" className="h-[70px] w-100 ">
                    <span>
                        Registration Status: Complete ✔️
                    </span>
                </aside>
                <aside id="22" className="h-[70px] w-100 ">
                    <span>
                        Payment Status: Verified ✔️
                    </span>
                </aside>
                <aside id="33" className="h-[70px] w-100 ">
                    <span>
                        Signature of Faculty Advisor
                    </span>
                </aside>
                <aside id="44" className="h-[70px] w-100 ">
                    <span>
                        Signature of F/I Academic UG/PG
                    </span>
                </aside>

            </div>
        </section>
      </main>
    </>
  );
};
export default StudentProfile;
