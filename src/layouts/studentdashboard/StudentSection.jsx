import React from "react";
import SectionLeft from "./SectionLeft";
import SectionRight from "./SectionRight";
import { Outlet } from "react-router-dom";

const StudentSection = () => {
  return (
    <>
      <section className="h-auto md:h-[550px] bg-[white] flex flex-col md:flex-row pl-10 gap-6">
        <SectionLeft />
        <SectionRight />
      </section>
    </>
  );
};

export default StudentSection;
