import React from "react";
import SectionLeft from "./SectionLeft";
import SectionRight from "./SectionRight";
import { Outlet } from "react-router-dom";

const StudentSection = () => {
  return (
    <>
      <section className="h-[550px] bg-[white] flex pl-10">
        <SectionLeft />
        <SectionRight />
        <Outlet/>
      </section>
    </>
  );
};

export default StudentSection;
