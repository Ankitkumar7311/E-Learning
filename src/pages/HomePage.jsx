import React, { useState, useEffect, useRef } from "react";
import Background from "../modules/admin/Background";
import picBg from "../assets/background.jpg";
import { useNavigate } from "react-router-dom";

/**
 * A custom React hook to create a looping typewriter effect with a backspace/delete animation.
 * @param {string} text The full text to be typed out.
 * @param {number} typingSpeed The speed in milliseconds between each character when typing.
 * @param {number} deletingSpeed The speed in milliseconds between each character when deleting.
 * @param {number} delay The pause in milliseconds after typing or deleting is complete.
 * @returns {{displayedText: string, isTyping: boolean}} The text to display and the active animation status.
 */
const useTypewriter = (text, typingSpeed = 50, deletingSpeed = 75, delay = 2000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);
  const index = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleAnimation = () => {
      if (!isDeleting.current) {
        // --- Typing forward ---
        if (index.current < text.length) {
          setIsAnimating(true);
          setDisplayedText((prev) => prev + text.charAt(index.current));
          index.current++;
          timeoutRef.current = setTimeout(handleAnimation, typingSpeed);
        } else {
          // --- Pause and switch to deleting ---
          setIsAnimating(false);
          timeoutRef.current = setTimeout(() => {
            isDeleting.current = true;
            handleAnimation();
          }, delay);
        }
      } else {
        // --- Deleting backward ---
        if (index.current > 0) {
          setIsAnimating(true);
          setDisplayedText((prev) => prev.slice(0, -1));
          index.current--;
          timeoutRef.current = setTimeout(handleAnimation, deletingSpeed);
        } else {
          // --- Pause and switch back to typing ---
          setIsAnimating(false);
          timeoutRef.current = setTimeout(() => {
            isDeleting.current = false;
            handleAnimation();
          }, delay / 2);
        }
      }
    };

    // --- Start the animation loop after an initial delay ---
    // This ensures the first letter appears with the same timing as the rest.
    timeoutRef.current = setTimeout(handleAnimation, typingSpeed);

    // Cleanup on component unmount
    return () => clearTimeout(timeoutRef.current);
  }, [text, typingSpeed, deletingSpeed, delay]);

  return { displayedText, isTyping: isAnimating };
};


const HomePage = () => {
  const navigate = useNavigate();
  const titleText = "A Future-Ready Platform for Modern Academic Institutions";
  const { displayedText, isTyping } = useTypewriter(titleText);

  return (
    <Background>
      {/* CSS for the blinking cursor animation */}
      <style>
        {`
          @keyframes blink {
            50% { opacity: 0; }
          }
          .cursor-blink {
            animation: blink 1s step-end infinite;
          }
        `}
      </style>

      <main className="h-screen w-full flex flex-col justify-center items-center relative px-4 sm:px-6">
        {/* --- Hero Image Section --- */}
        <div 
          className="h-1/2 md:h-2/3 w-full bg-cover bg-center rounded-2xl shadow-xl flex items-center relative overflow-hidden" 
          style={{ backgroundImage: `url(${picBg})` }}
        >
          {/* Overlay for a clearer background */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Text Container */}
          <div className="relative z-10 w-1/2 px-6 sm:px-8 md:px-12">
            <h1 
                className="font-bold text-left text-yellow-50 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight" 
                style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}
            >
              {displayedText}
              
              {/* Blinking cursor effect */}
              {isTyping && <span className="cursor-blink inline-block ml-2 w-1 h-8 sm:h-10 md:h-12 lg:h-14 bg-white"></span>}
            </h1>
          </div>
        </div>

        {/* --- Description Section --- */}
        <div className="max-w-4xl text-center py-6">
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Welcome to a complete information management solution engineered to meet
            the diverse needs of your entire academic community. Our system provides
            a centralized and secure environment to seamlessly manage every aspect of
            college life, from admissions and fee collection to attendance tracking and course management.
          </p>
        </div>

        {/* --- Call to Action --- */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => navigate("/signup")}
            className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg transform hover:scale-105"
          >
            GET STARTED
          </button>
        </div>
      </main>
    </Background>
  );
};

export default HomePage;