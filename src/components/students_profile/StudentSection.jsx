import React from "react";
import SectionLeft from "./SectionLeft";
import SectionRight from "./SectionRight";

const StudentSection = () => {
  return (
    <>
      <section className="h-[550px] bg-[white] flex pl-10">
        <SectionLeft />
        <SectionRight />
      </section>
    </>
  );
};

export default StudentSection;
