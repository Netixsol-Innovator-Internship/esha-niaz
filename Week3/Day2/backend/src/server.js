// require("dotenv").config()
require('dotenv').config();

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Import routes
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

// Import Swagger documentation
const swaggerSetup = require("./docs/swagger")

const app = express()


// Connect to MongoDB
connectDB()

// Middleware


// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // Allow Postman/curl
//     if (
//       origin.includes("esha-week3-day3-task-frontend.vercel.app") || 
//       origin.includes("esha-week2-day2-task-backend.vercel.app") ||
//       origin.includes("vercel.app") // allow all Vercel preview deployments
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (curl, Postman, Swagger in same domain)

    const allowed = [
      "https://esha-week3-day3-task-frontend.vercel.app",
      "https://esha-week2-day2-task-backend.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ];

    // Allow if explicitly in list OR is any vercel.app subdomain
    if (allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));



app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Task Manager API is running!",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/users", authRoutes)
app.use("/api/tasks", taskRoutes)

// Swagger Documentation
swaggerSetup(app)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error)

  res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
})

module.exports = app
