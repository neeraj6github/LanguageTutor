import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; 

  const handleVerify = async () => {

    if (!email) {
      alert("No email found. Please go back and sign up again.");
      return;
    }

    try {

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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 text-purple-700">Verify OTP</h1>

      <input
        type="text"
        placeholder="Enter the OTP sent to your email"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-72"
      />

      <button
        onClick={handleVerify}
        className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default VerifyOtp;
