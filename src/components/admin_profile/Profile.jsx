import AdminNavBar from "../navbars/AdminNavBar";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

const Profile = () => {
  return ( <>
    <AdminNavBar/>
    <section className="flex h-[550px] bg-white pl-10">
    
      <ProfileLeft />
      <ProfileRight />
    </section>

    </>
  );
};

export default Profile;
