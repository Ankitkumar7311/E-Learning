import faculty from "../assets/faculty.jpg"

let Teacherprofile=()=>{
    return <>
    
    <div className="h-[800px] w-[1100px] p-12 flex flex-col pl-100">
        <hr className="w-[650px]" />
        <h1 className="text-center">Teacher Information </h1>
        <hr className="w-[650px]" /> <br />

        <div className="flex flex-row justify-between items-center">
            <p>
                Name: Prem Kumar <br />
                Roll: 200XXXX <br />
                Subject: Compiler Design <br />
            </p>

            <img src={faculty} alt="no img" className="h-[150px] w-[200px] rounded-lg"/>
        </div> <br /><br />

        <table className="table-auto border border-black [&_*]:px-4 [&_*]:py-2 rounded-xl border-separate border-spacing-0 [&_td]:border [&_th]:border">
            <thead>
                <tr>
                    <th >S.No</th>
                    <th >Code</th>
                    <th >Class Name</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td >1.</td>
                    <td >CS304</td>
                    <td >CSE 4th Sec A</td>
                </tr>

                <tr>
                    <td >2.</td>
                    <td >CS304</td>
                    <td >CSE 4th Sec B</td>
                </tr>

                <tr>
                    <td >3.</td>
                    <td >CS304</td>
                    <td >IT 4th Sec A</td>
                </tr>

                <tr>
                    <td >4.</td>
                    <td >CS304</td>
                    <td >EE 4th Sec D</td>
                </tr>

                <tr>
                    <td >5.</td>
                    <td >ME304</td>
                    <td >Environmental Sciences & Green..</td>
                </tr>
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan="3" className="text-center border border-black">Total Classes - 5</td>
                </tr>
            </tfoot>
        </table>



    </div>




    </>
}

export default Teacherprofile