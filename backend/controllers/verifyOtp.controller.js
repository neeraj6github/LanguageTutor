import { otpStore } from "./otp.controller.js";  


export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: "Email and OTP are required." });
  }

  const savedOtp = otpStore[email];  
  if (!savedOtp) {
    return res.status(400).json({ success: false, error: "OTP not found. Please request a new one." });
  }

  if (savedOtp !== otp) {
    return res.status(400).json({ success: false, error: "Invalid OTP." });
  }

  
  delete otpStore[email];

  return res.status(200).json({ success: true, message: "OTP verified successfully." });
};
