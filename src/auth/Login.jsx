import academic from "../assets/academic.png";
import Background from "../modules/admin/Background";
import Form from "./Form";

const Login = () => {
  return (
    <Background>
      <div
        className="relative h-screen w-full rounded-3xl shadow-2xl bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${academic})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 p-4 sm:p-6 md:p-12 gap-6 items-center">
          {/* Text Content */}
          <div className="flex flex-col justify-center text-white text-center md:text-left px-3 sm:px-6">
            <h1 className="font-julius font-light text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-snug">
              Vidya Sarthi
            </h1>
            <h3 className="font-roboto font-medium text-base sm:text-lg md:text-3xl mt-2 sm:mt-3">
              Welcome to Vidya Sarthi
            </h3>
            <p className="font-roboto text-xs sm:text-sm md:text-lg lg:text-xl mt-2 sm:mt-3 max-w-xl mx-auto md:mx-0 leading-relaxed">
              A digital bridge between students and teachers, where teachers
              share knowledge and students access notes with ease.
            </p>
          </div>

          {/* Form */}
          <div className="flex justify-center items-center">
            <Form />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Login;
