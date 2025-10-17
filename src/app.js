import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Core middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).send("API is healthy"));

// Error handler
app.use(errorHandler);

export default app;
