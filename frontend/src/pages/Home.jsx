import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const buttonsRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.from(titleRef.current, {
      y: -50,
      opacity: 100,
      duration: 0.8,
    })
      .from(subtitleRef.current, {
        y: 20,
        opacity: 100,
        duration: 0.6,
      }, "-=0.4")
      .from(buttonsRef.current.children, {
        opacity: 100,
        y: 20,
        stagger: 0.2,
        duration: 0.5,
      }, "-=0.3");
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#5e7ce2] to-[#4472ca] flex flex-col items-center justify-center text-white px-4">
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl font-extrabold mb-4 text-center tracking-tight"
        >
          Welcome to <span className="text-yellow-200">Ai-ChitChat</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-center max-w-xl mb-6 text-white/90"
        >
          Your intelligent chatbot companion. Where would you like to begin?
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-300 hover:bg-yellow-400 text-[#1f2d4d] font-semibold py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-white hover:bg-gray-100 text-[#1f2d4d] font-semibold py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
