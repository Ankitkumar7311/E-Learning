import teacher  from "../assets/teacher.jpg"
import { FaRegEdit } from "react-icons/fa";



let ProfileLeft=()=>{
return <>

     <div className=" flex flex-col justify-center items-center h-[610px] w-1/4 shadow-2xl rounded-xl" >

    <img src={teacher} alt="no img" className="h-[150px] w-[200px] rounded-xl"/>
    <h1 className="text-[25px]">PREM KUMAR</h1>
    <hr className="border-t-2 border-gray-300 w-full my-4" />

   
    <p className="text-center">
        Subject: Compiler Design <br />
        Batch: 2020 - 24 <br />
        Roll: 200XXXX
    </p>
    <hr className="border-t-2 border-gray-300 w-full my-4" />

    <p className="text-center">
        Phone: <br />
        +91 XXXXXXXXXX <br />
        Email : <br />
        XXXXXXXXXXXXXX
    </p>
   <hr className="border-t-2 border-gray-300 w-full my-4" />

   <p className="text-center">
    Address: <br />
    Village, Block, Lakhisarai <br />
    Bihar 811315 <br />
   </p>
   <br /> 

   <button className="bg-yellow-500 text-white rounded-xl h-[30px] w-[150px] flex flex-row justify-evenly"><FaRegEdit size={28} />Request</button>

    </div>
   

</>

}
export default ProfileLeft