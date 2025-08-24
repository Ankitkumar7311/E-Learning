import React from "react";
import academic from "../assets/academic.png"


const Login = () => {
  return (
    <>
    {/* <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Login Page</h1>
      <p className="text-gray-600">Here your login.</p>
    </div> */}

    <div className="relative w-full min-h-screen bg-cover "
          style={{ backgroundImage: `url(${academic})` }}>

        <div className="absolute top-30 left-30 text-3xl text-[white] h-[400px] w-[600px] leading-relaxed">

          <h1 className="text-[70px]">VIDYA SARTHI</h1>

          <h3 className="text-[50px]">Welcome to Vidya Sarthi</h3> <br />
          <p>A digital bridge between students and teachers, where teachers share knowledge and students access notes with ease.</p>
        </div>
      
    </div>
    


    
    </>
  );
};

export default Login;
