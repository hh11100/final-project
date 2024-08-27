import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from 'jose';

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, { path: '/api/socket',addTrailingSlash: false });

  io.use(async (socket, next) => {
    const { token } = socket.handshake.auth;

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      socket.auth = payload;
      return next();
    } catch (error) {
      console.log("Authentication failed:", error);
      return next(new Error("invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("join", (data) => {
      if (socket.conversationId) {
        socket.leave(socket.conversationId);
      }

      const { conversationId } = data;
      socket.conversationId = conversationId;
      socket.join(conversationId);

      console.log(`Client joined conversation: ${conversationId}`);
    });

    socket.on("typing", (data) => {
      console.log("Typing:", data);
      const { userId, conversationId } = data;

      socket.to(conversationId).emit("typing", { userId });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      socket.leave(socket.conversationId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
