import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { prisma } from "./db/db.config.js";
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;
    if (!projectId) {
      return next(new Error("Project ID is required"));
    }

    socket.project = await prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!socket.project) {
      return next(new Error("Project not found"));
    }

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;

    // Check if the user belongs to the project
    const userProject = await prisma.userProjects.findFirst({
      where: {
        userId: socket.user.id,
        projectId: socket.project.id,
      },
    });

    if (!userProject) {
      return next(new Error("User does not belong to this project"));
    }

    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.join(socket.project.id);

  socket.on("project-message", (data) => {
    socket.broadcast.to(socket.project.id).emit("project-message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
