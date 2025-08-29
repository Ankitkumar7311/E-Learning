import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

let Profile = () => {
  return (
    <>
      <section className="h-[550px] bg-[white] flex pl-10">
        <ProfileLeft />
        <ProfileRight />
      </section>
    </>
  );
};
export default Profile;
