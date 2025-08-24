import Backgroud from "../components/Background";
import picBg from "../asset/home.png"

const HomePage = () => {



  return (
    <Background>
      <div className="font-sans">

      
        <header className="h-24 w-full">
         
        </header>

  
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="p-3  rounded-3xl">
            <div
              className="relative h-[65vh] bg-cover bg-center rounded-2xl"
              style={{ backgroundImage: `url(${picBg})` }}
            >
            
            </div>
          </div>


          <div className="w-full max-w-4xl mx-auto px-6 text-center py-16 md:py-20">
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              Explore your options and make informed decisions with our comprehensive guide to universities around the world. Discover top-ranked institutions, explore diverse programs, and connect with like-minded individuals to build your academic future. With easy-to-use search tools, in-depth profiles, and trusted ratings and reviews, we provide everything you need to make the right choice for your academic journey. Start your search today and find your perfect fit!
            </p>

            <button
              className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              GET STARTED
            </button>
          </div>

        </main>
      </div>
    </Background>
  );
};

export default HomePage;