import express from "express";
import cors from "cors";
import helmet from "helmet";
import records from "./routes/record.js";
import db from "./db/connection.js";

const PORT = process.env.PORT || 5050;

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic API information
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Records API is running",
  });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await db.command({ ping: 1 });

    res.status(200).json({
      status: "healthy",
      service: "employee-records-api",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      status: "unhealthy",
      service: "employee-records-api",
      database: "disconnected",
    });
  }
});

// Employee routes
app.use("/record", records);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down server...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));