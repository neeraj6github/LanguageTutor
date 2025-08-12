import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";


const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.5-37.4-4.6-55.5H272.1v105h147.1c-6.3 33.7-25.4 62.3-54.3 81.5v67h87.7c51.4-47.2 81-116.8 81-198z" />
    <path fill="#34A853" d="M272.1 544.3c73.5 0 135.1-24.3 180.2-66.2l-87.7-67c-24.3 16.3-55.3 25.9-92.5 25.9-71.2 0-131.7-48-153.4-112.6h-89.4v70.7c44.7 89.3 137 149.2 242.8 149.2z" />
    <path fill="#FBBC05" d="M118.7 324.4c-10.8-32.1-10.8-66.7 0-98.8v-70.7h-89.4C4.4 216.2 0 246.7 0 278.4s4.4 62.2 29.3 123.5l89.4-70.7z" />
    <path fill="#EA4335" d="M272.1 107.2c39.9-.6 78.2 14.1 107.3 40.7l80.2-80.2C423.2 24.1 349.9-1 272.1 0 166.3 0 74 59.9 29.3 149.2l89.4 70.7c21.7-64.6 82.2-112.7 153.4-112.7z" />
  </svg>
);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        y: 50,
        opacity: 100,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSignup = async () => {
    if (loading) return;

    if (!name || !username || !email || !pass) {
      alert("Please fill all fields");
      return;
    }

    if (pass.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      const uid = user.uid;
      const otp = generateOtp();

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.post(`${backendUrl}/api/user/send-otp`, {
        name,
        username,
        email,
        uid,
        otp,
        signupType: "manual",
      });

      alert("OTP sent! Please check your email.");
      navigate("/verify-otp", { state: { uid, email } });
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const name = user.displayName || "";
      const email = user.email;
      const uid = user.uid;
      const username = email.split("@")[0];

          const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.post(`${backendUrl}/api/user/signup`, {
        name,
        username,
        email,
        uid,
        signupType: "google",
      });

      alert("Signup successful with Google!");
      navigate("/login");
    } catch (err) {
      console.error("Google Signup Error:", err);
      alert(err.message || "Google Signup failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-[#5e7ce2] to-[#4472ca] min-h-[calc(100vh-56px)] pt-2 px-4 flex justify-center items-start">
        <div
          ref={formRef}
          className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mt-2"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-[#5e7ce2]">
            Create an Account
          </h1>

          <input
            className="border p-2 mb-3 w-full rounded focus:ring-2 focus:ring-[#5e7ce2]"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 mb-3 w-full rounded focus:ring-2 focus:ring-[#5e7ce2]"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border p-2 mb-3 w-full rounded focus:ring-2 focus:ring-[#5e7ce2]"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 mb-4 w-full rounded focus:ring-2 focus:ring-[#5e7ce2]"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-[#5e7ce2] text-white w-full py-2 rounded hover:bg-[#3d5fc3] transition-all duration-200 font-semibold"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="my-4 text-center text-gray-500 font-medium">OR</div>

          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center bg-white text-gray-700 border border-gray-300 w-full py-2 rounded hover:bg-gray-100 transition duration-200 font-semibold"
          >
            <GoogleIcon />
            Sign Up with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
