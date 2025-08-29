import React from "react";
import curveBg from "../../assets/Curve.png"; 

const Background = ({ children }) => {
   return (
    <div
      className="relative w-full min-h-screen bg-white bg-no-repeat bg-top bg-cover overflow-hidden"
      style={{ backgroundImage: `url(${curveBg})` }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
