import React from "react";
import Background from "./Background";
import picBg from "../../assets/home.png";

const HomePage = () => {
  return (
    <Background>
    
      <main className="h-screen w-full flex flex-col justify-center items-center relative px-6">
      
        <div
          className="h-2/3 w-full bg-cover bg-center rounded-2xl"
          style={{ backgroundImage: `url(${picBg})` }}
        ></div>

       
        <div className="max-w-4xl text-center py-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Explore your options and make informed decisions with our
            comprehensive guide to universities around the world. Discover
            top-ranked institutions, explore diverse programs, and connect
            with like-minded individuals to build your academic future.
            With easy-to-use search tools, in-depth profiles, and trusted
            ratings and reviews, we provide everything you need to make the
            right choice for your academic journey. Start your search today
            and find your perfect fit!
          </p>
        </div>

     
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg">
            GET STARTED
          </button>
        </div>
      </main>
    </Background>
  );
};

export default HomePage;
