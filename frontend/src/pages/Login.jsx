import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/config";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";

const GoogleIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-18.6-1.5-37.4-4.6-55.5H272.1v105h147.1c-6.3 33.7-25.4 62.3-54.3 81.5v67h87.7c51.4-47.2 81-116.8 81-198z"
    />
    <path
      fill="#34A853"
      d="M272.1 544.3c73.5 0 135.1-24.3 180.2-66.2l-87.7-67c-24.3 16.3-55.3 25.9-92.5 25.9-71.2 0-131.7-48-153.4-112.6h-89.4v70.7c44.7 89.3 137 149.2 242.8 149.2z"
    />
    <path
      fill="#FBBC05"
      d="M118.7 324.4c-10.8-32.1-10.8-66.7 0-98.8v-70.7h-89.4C4.4 216.2 0 246.7 0 278.4s4.4 62.2 29.3 123.5l89.4-70.7z"
    />
    <path
      fill="#EA4335"
      d="M272.1 107.2c39.9-.6 78.2 14.1 107.3 40.7l80.2-80.2C423.2 24.1 349.9-1 272.1 0 166.3 0 74 59.9 29.3 149.2l89.4 70.7c21.7-64.6 82.2-112.7 153.4-112.7z"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef(null);

  // Optional: simple fade-in without GSAP or keep as you want
  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = 0;
      formRef.current.style.transform = "translateY(50px)";
      setTimeout(() => {
        formRef.current.style.transition = "all 0.6s ease-out";
        formRef.current.style.opacity = 1;
        formRef.current.style.transform = "translateY(0)";
      }, 50);
    }
  }, []);

  const validateInputs = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email.");
      return false;
    }
    if (pass.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const sendData = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      console.log("Login successful", userCredential.user);
      navigate("/chat");
    } catch (err) {
      console.error(err.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login successful", result.user);
      navigate("/chat");
    } catch (err) {
      console.error("Google login failed", err.message);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#973aa8] via-[#6411ad] to-[#3a0ca3] text-white">
      <Navbar />

      <div className="flex justify-center items-center py-12 px-4">
        <div
          ref={formRef}
          className="bg-white text-[#3a0ca3] p-8 rounded-xl shadow-xl w-full max-w-sm mt-6"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#6411ad]">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-[#6411ad] rounded focus:outline-none focus:ring-2 focus:ring-[#973aa8]"
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-3 mb-4 border border-[#6411ad] rounded focus:outline-none focus:ring-2 focus:ring-[#973aa8]"
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            onClick={sendData}
            className="bg-[#6411ad] hover:bg-[#4e2789] text-white font-semibold py-3 rounded w-full mb-4 transition duration-200"
          >
            Login
          </button>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-white text-[#6411ad] border border-[#6411ad] w-full py-3 rounded hover:bg-[#f0e9ff] transition duration-200 font-semibold"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[#6411ad] text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold underline hover:text-[#973aa8]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
