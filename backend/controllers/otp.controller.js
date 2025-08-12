import { transporter } from "../utils/sendEmail.js";

export const otpStore = {};

export const sendOtp = async (req, res) => {
  const { email, otp, signupType } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (signupType === "google") {

    return res.status(200).json({ message: "Google signup - OTP not required" });

   
  }

  if (!otp) {
    return res.status(400).json({ error: "OTP is required for manual signup" });
  }

  try {
    otpStore[email] = otp;

    const mailOptions = {
      from: `"Ai-ChitChat" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your email (OTP)",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
     console.log(" Email sent to", email); 
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP." });
  }
};
