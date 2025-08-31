import React from "react";
import academic from "../../assets/academic.png";
import curveBg from "../../assets/Curve.png";

import Form from "./Form";

const Login = () => {
  return (
    <section
      className="w-full flex items-center justify-center bg-no-repeat bg-cover px-2"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      <div
        className="
          relative rounded-4xl shadow-xl overflow-hidden
          w-[92vw] sm:w-[90vw] md:w-[90vw] lg:w-[90vw] xl:w-[70vw] max-w-[1500vw]
          md:aspect-[16/9]
          bg-no-repeat bg-cover bg-center
        "
        style={{ backgroundImage: `url(${academic})` }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

        {/* TEXT CONTENT */}
        <div className="absolute md:top-25 md:left-6 w-full md:w-1/2 p-4 md:p-6 text-white overflow-y-auto h-full">
          <h1 className="font-julius font-light text-6xl sm:text-5xl md:text-6xl lg:text-6xl leading-normal">
          Vidya Sarthi
          </h1>
          <h3 className="font-roboto font-medium text-lg sm:text-2xl md:text-3xl mt-2 leading-normal">
            Welcome to Vidya Sarthi
          </h3>
          <p className="font-roboto font-normal text-[1vh] sm:text-[1vh] md:text-[3.5vh] mt-1 leading-none">
            A digital bridge between students and teachers, where teachers share knowledge and students access notes with ease.
          </p>
        </div>

        {/* FORM */}
        <Form />
      </div>
    </section>
  );
};

export default Login;
