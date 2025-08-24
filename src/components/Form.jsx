import cardpic from "../assets/card.png";

let Form = () => {
  return (
    <>
      <section
        className=" absolute top-14 left-132 h-95 w-100  px-5 py-2 pr-20 bg-contain bg-no-repeat    font-montserrat text-[#202020]"
        style={{ backgroundImage: `url(${cardpic})` }}
      >
        <h1 className="font-roboto font-medium text-[25px]/[45px]  ">Login</h1>
        <hr className="w-[200px] h-[15px]" />
        <h4 className="font-montserrat font-normal text-[20px]/[9px] ">
          Welcome onboard with us!
        </h4>
        <br />
        <form action="" className=" text-[20px]">
          <label htmlFor="" className=" text-[20px]/[40px] font-medium ">
            Email ID
          </label>{" "}
          <br />
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter you username"
            className="bg-[#D8E7F5] w-79 rounded-xl px-5 py-1"
          />{" "}
          <br />
          <label htmlFor="" className=" text-[20px]/[40px] font-medium ">
            Password
          </label>{" "}
          <br />
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter your password"
            className="bg-[#D8E7F5] w-79 rounded-xl px-5 py-1"
          />{" "}
          <br />
          <button className="h-10 absolute left-55 top-63 text-[15px]/[0px] text-[#202020] ">
            Forgot password?
          </button>
          <br />
          <button className="bg-[#F3B300] px-33 py-1 rounded-xl font-semibold text-xl  hover:bg-yellow-600 shadow ">
            LogIn{" "}
          </button>
          <br />
          <span className=" text-center text-[17px]">
            <p>
              Dont’t have an account?{" "}
              <b>
                {" "}
                Signup as a <br /> student
              </b>{" "}
            </p>{" "}
            <br />
          </span>
        </form>
      </section>
    </>
  );
};
export default Form;
