import React from "react";
import academic from "../../assets/academic.png";
import curveBg from "../../assets/Curve.png";

import Form from "./Form";

const Login = () => {
  return (
    <>
      <section
        className="w-[70vw] h-[50vh] bg-no-repeat bg-cover w-full flex items-center justify-center"
        style={{ backgroundImage: `url(${curveBg})` , height:"70vh" }}
      >
        <div
          className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg w-[1500px] h-[700px] p-6 flex flex-col justify-center   bg-no-repeat bg-[length:100%_100%] mt-[150px]"
          style={{ backgroundImage: `url(${academic})` }}
        >
          {/* Overlay for darkness */}
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

          {/* contain */}
          <div className="absolute top-45 left-20 text-[white] h-[400px] w-[600px] leading-relaxed">
            <h1
              className="font-julius font-extralight text-[70px]"
            >
             E-learning Platform
            </h1>

            <h3 className="font-roboto font-medium text-[40px]">
              Welcome to E-learning 
            </h3>

            <aside className="w-[600px]">
              <p className="font-roboto font-light text-[30px]">
                A digital bridge between students and teachers, where teachers
                share knowledge and students access notes with ease.
              </p>
            </aside>
          </div>
          <Form />
        </div>
      </section>
    </>
  );
};

export default Login;
