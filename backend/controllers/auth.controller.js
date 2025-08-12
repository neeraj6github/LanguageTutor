import User from "../models/User.model.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, uid, signupType, password } = req.body;
      console.log("Signup request body:", req.body); 

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

     const newUser = new User({
      name,
      username,
      email,
      uid,
      signupType,
    });

    if (signupType === "manual" && password) {
      newUser.password = password;
    }

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
