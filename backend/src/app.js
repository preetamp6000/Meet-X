import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/usersroutes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());

// Enhanced JSON parsing with better error handling
app.use(express.json({ 
  limit: "40kb",
  verify: (req, res, buf, encoding) => {
    try {
      if (buf && buf.length > 0) {
        JSON.parse(buf.toString(encoding || 'utf8'));
      }
    } catch (e) {
      console.log("Invalid JSON received:", buf.toString());
      res.status(400).json({ 
        error: "Invalid JSON format",
        details: e.message,
        position: e.message.match(/position (\d+)/)?.[1] || 'unknown'
      });
      throw new Error("Invalid JSON");
    }
  }
}));

app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: "Invalid JSON in request body",
      solution: "Check for missing commas, unquoted keys, or trailing commas"
    });
  }
  next();
});

const start = async () => {
  try {
    // Remove or fix this line - it's incomplete
    // app.set("mongo_user")
    
    const connectionDb = await mongoose.connect("mongodb+srv://pritampatil6000:pritampatil6000@cluster0.ufctmmo.mongodb.net/?appName=Cluster0");
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
    
    server.listen(app.get("port"), () => {
      console.log("LISTENING ON PORT 8000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();