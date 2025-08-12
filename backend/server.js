import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.route.js';
import sendOtpRouter  from "./routes/sendOtp.route.js";
import verifyOtpRouter  from "./routes/verifyOtp.route.js";
import authRoutes from './routes/auth.route.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use("/api/user", sendOtpRouter);
app.use("/api/user", verifyOtpRouter);
app.use('/api/user', authRoutes);




// mongoose.connect(process.env.MONGODB_URI, {
// })
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
