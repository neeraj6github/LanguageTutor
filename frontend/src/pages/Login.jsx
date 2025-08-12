import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/config";
import gsap from "gsap";
import { FcGoogle } from "react-icons/fc";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.5-37.4-4.6-55.5H272.1v105h147.1c-6.3 33.7-25.4 62.3-54.3 81.5v67h87.7c51.4-47.2 81-116.8 81-198z" />
    <path fill="#34A853" d="M272.1 544.3c73.5 0 135.1-24.3 180.2-66.2l-87.7-67c-24.3 16.3-55.3 25.9-92.5 25.9-71.2 0-131.7-48-153.4-112.6h-89.4v70.7c44.7 89.3 137 149.2 242.8 149.2z" />
    <path fill="#FBBC05" d="M118.7 324.4c-10.8-32.1-10.8-66.7 0-98.8v-70.7h-89.4C4.4 216.2 0 246.7 0 278.4s4.4 62.2 29.3 123.5l89.4-70.7z" />
    <path fill="#EA4335" d="M272.1 107.2c39.9-.6 78.2 14.1 107.3 40.7l80.2-80.2C423.2 24.1 349.9-1 272.1 0 166.3 0 74 59.9 29.3 149.2l89.4 70.7c21.7-64.6 82.2-112.7 153.4-112.7z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 100,
      y: 50,
      duration: 0.6,
      ease: "power3.out",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-[#5e7ce2] to-[#4472ca] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3 bg-[#5e7ce2] shadow-md">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          AI Chat
        </h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-white/80">Home</Link>
          <Link to="/signup" className="hover:text-white/80">Signup</Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex justify-center items-center py-6">
        <div
          ref={formRef}
          className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-sm mt-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-[#5e7ce2]">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            onClick={sendData}
            className="bg-[#5e7ce2] hover:bg-[#4472ca] text-white font-semibold py-2 px-4 rounded w-full mb-3 transition duration-200"
          >
            Login
          </button>

        <button
  onClick={handleGoogleLogin}
  className="bg-white-200 text-black font-semibold py-2 px-4 border border-gray-300 rounded w-full flex items-center justify-center transition duration-200"
>
  <GoogleIcon />
  Continue with Google
</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
