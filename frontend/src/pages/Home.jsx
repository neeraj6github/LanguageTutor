import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#973aa8] via-[#6411ad] to-[#3a0ca3] flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center tracking-tight">
          Welcome to <span className="text-yellow-300">TextTune</span>
        </h1>

        <p className="text-lg md:text-xl text-center max-w-xl mb-6 text-yellow-100/90">
          TextTune is your intelligent chatbot companion that helps you check grammar, translate text, and practice languages with ease.
        </p>

        <p className="text-center max-w-md mb-10 text-yellow-100/70 italic">
          Get started by logging in or signing up below!
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-300 hover:bg-yellow-400 text-[#1f2d4d] font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-white hover:bg-gray-100 text-[#1f2d4d] font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
