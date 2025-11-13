import express, { Router } from "express";
import cors from "cors";
import therapistRoutes from "./routes/therapistRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import aiRoutes from "./routes/aiRoutes";
import dotenv from "dotenv";
import prisma from "./prisma";
dotenv.config();
const app = express();

//Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// API Routes
app.use("/therapist", therapistRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/ai", aiRoutes);
const port = process.env.PORT || 3000;

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("Database connection failed: ", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🔄 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server,error", error);
  process.exit(1);
});
