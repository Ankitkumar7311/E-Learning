import React from "react";
import academic from "../../assets/academic.png";
import curveBg from "../../assets/Curve.png";

import Form from "./Form";

const Login = () => {
  return (
    <>
      <section
        className="h-[470px] bg-no-repeat bg-cover w-full flex items-center justify-center"
        style={{ backgroundImage: `url(${curveBg})` }}
      >
        <div
          className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg w-[1000px] h-[465px] p-6 flex flex-col justify-center   bg-no-repeat bg-[length:100%_100%]
"
          style={{ backgroundImage: `url(${academic})` }}
        >
          {/* Overlay for darkness */}
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

          {/* contain */}
          <div className="absolute top-22 left-15 text-[white] h-[400px] w-[600px] leading-relaxed">
            <h1
              className="font-julius font-extralight
text-[63px]"
            >
              VIDYA SARTHI
            </h1>

            <h3 className="font-roboto font-medium text-3xl/[60px]">
              Welcome to Vidya Sarthi
            </h3>

            <aside className="w-[350px]">
              <p className="font-roboto font-light text-[20px]/[25px]">
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
