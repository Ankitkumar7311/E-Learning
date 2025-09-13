import TeacherTables from "../TeacherTables";
import UploadPdf from "../../components/upload/UploadPdf";
import EditMaterial from "./EditMaterial";
import TeacherNavBar from "../../components/navbars/TeacherNavbar";

const FacultyEditProfile = () => {
  return (
    <>
      <TeacherNavBar />
      <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
        {/* Row: Table + Edit Material */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <TeacherTables />
          </div>
          <div className="w-full md:w-1/3">
            <EditMaterial />
          </div>
        </div>

        {/* Upload PDF section */}
        <div className="mt-8">
          <UploadPdf />
        </div>
      </div>
    </>
  );
};

export default FacultyEditProfile;
