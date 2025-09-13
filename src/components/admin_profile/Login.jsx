import academic from "../../assets/academic.png";
import Background from "./Background";
import Form from "./Form";

const Login = () => {
  return (
    <Background>
      <div
        className="relative h-screen w-full rounded-3xl shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${academic})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>

        {/* Text Content */}
        <div className="absolute mt-[10px] ml-[50px] w-full md:w-1/2 p-6 text-white h-full flex flex-col justify-center">
          <h1 className="font-julius font-light text-5xl md:text-6xl lg:text-7xl leading-snug">
            Vidya Sarthi
          </h1>
          <h3 className="font-roboto font-medium text-xl md:text-3xl mt-3">
            Welcome to Vidya Sarthi
          </h3>
          <p className="font-roboto text-sm md:text-lg lg:text-xl mt-3 max-w-xl leading-relaxed">
            A digital bridge between students and teachers, where teachers
            share knowledge and students access notes with ease.
          </p>
        </div>

        {/* Form */}
        <Form />
      </div>
    </Background>
  );
};

export default Login;
