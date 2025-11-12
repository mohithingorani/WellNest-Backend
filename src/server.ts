  import express, { Router } from "express";
  import cors from "cors";
  import therapistRoutes from "./routes/therapistRoutes";
  import userRoutes from "./routes/userRoutes";
  import adminRoutes from "./routes/adminRoutes";
  import aiRoutes from "./routes/aiRoutes"
  import dotenv from "dotenv";
  const router = Router();
  dotenv.config(); 
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));

  // Routes
  app.use("/therapist", therapistRoutes);
  app.use("/user", userRoutes);
  app.use("/admin", adminRoutes);
  app.use("/ai",aiRoutes);
  const port = process.env.PORT || 3000;

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
