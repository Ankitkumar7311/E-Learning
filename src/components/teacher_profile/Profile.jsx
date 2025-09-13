
import TeacherNavBar from "../navbars/TeacherNavbar";
import ProfileLeft from "../teacher_profile/ProfileLeft";
import ProfileRight from "../teacher_profile/ProfileRight";

const Profile = () => {
  return (
    <>
    <TeacherNavBar/>
      <section className="flex h-[550px] bg-white pl-10">
      <ProfileLeft />
      <ProfileRight />
      </section>
    </>
  );
};

export default Profile;
