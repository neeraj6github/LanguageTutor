// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import chatRoutes from "./routes/chat.route.js";
import sendOtpRouter from "./routes/sendOtp.route.js";
import verifyOtpRouter from "./routes/verifyOtp.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();

// Allowed origins for local + production
app.use(cors({
  origin: '*', // Allow all origins temporarily for debugging
  credentials: true
})); // Remove undefined

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// API routes
app.use("/api/chat", chatRoutes);
app.use("/api/user", sendOtpRouter);
app.use("/api/user", verifyOtpRouter);
app.use("/api/user", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
