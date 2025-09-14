import AdminNavBar from "../../modules/admin/AdminNavBar";
import TeacherNavBar from "../../modules/faculty/TeacherNavBar";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

const Profile = () => {
  return (
    <>
      {/* <TeacherNavBar /> */}
      <section className="flex h-[550px] bg-white pl-10">
        <ProfileLeft />
        <ProfileRight />
      </section>
    </>
  );
};

export default Profile;
