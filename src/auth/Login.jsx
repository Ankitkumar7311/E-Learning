import academic from "../assets/academic.png";
import Background from "../modules/admin/Background";
import Form from "./Form";

const Login = () => {
  return (
    <Background>
      <div
        className="relative w-full min-h-screen flex flex-col lg:flex-row shadow-2xl bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${academic})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left p-6 sm:p-10 lg:p-16 text-white">
          <h1 className="font-julius font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-snug">
            Vidya Sarthi
          </h1>
          <h3 className="font-roboto font-medium text-base sm:text-lg md:text-xl lg:text-2xl mt-3">
            Welcome to Vidya Sarthi
          </h3>
          <p className="font-roboto text-sm sm:text-base md:text-lg lg:text-xl mt-3 max-w-md lg:max-w-xl leading-relaxed">
            A digital bridge between students and teachers, where teachers share
            knowledge and students access notes with ease.
          </p>
        </div>

        {/* Form Section */}
        <div className="relative z-10 flex-1 flex justify-center items-center px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-10">
          <Form />
        </div>
      </div>
    </Background>
  );
};

export default Login;
