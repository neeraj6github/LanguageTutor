import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async () => {
    if (!email) {
      alert("No email found. Please go back and sign up again.");
      return;
    }

    if (otp.trim().length === 0) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        alert("OTP verified! Signup completed.");
        navigate("/login");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Something went wrong during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#973aa8] via-[#6411ad] to-[#3a0ca3] px-4">
      <div className="bg-yellow-100/10 p-8 rounded-xl shadow-lg max-w-md w-full text-center backdrop-blur-md">
        <h1 className="text-3xl font-semibold mb-6 text-yellow-300">Verify OTP</h1>

        <input
          type="text"
          placeholder="Enter the OTP sent to your email"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border border-yellow-300 bg-yellow-100/20 text-yellow-50 p-3 rounded mb-6 w-full text-center text-lg placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded font-semibold text-[#1f2d4d] transition ${
            loading
              ? "bg-yellow-200 cursor-not-allowed"
              : "bg-yellow-300 hover:bg-yellow-400"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
