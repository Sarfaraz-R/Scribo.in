import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import jwt from 'jsonwebtoken';


let io;

export const initSocket = (httpServer) => {
  // 1. Setup Redis Adapter for horizontal scaling
  // const pubClient = createDuplicateConnection();
  // const subClient = createDuplicateConnection();

  io = new Server(httpServer, {
    // This adapter ensures messages reach the user even if they are on a different server instance
    // adapter: createAdapter(pubClient, subClient),
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  // 2. Authenticate using your AuthForge JWT logic
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      // Using your specific secret name from the snippet
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Ensure we use decoded._id as per your AuthForge schema
      socket.userId = decoded._id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // 3. Handle Connections [Step 1 & 2 in your diagram]
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Create a private room for this specific user
    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

/**
 * Step 10: Helper function to emit results back to the client
 * @param {string} event - e.g., 'CODE_RESULT'
 * @param {string} userId - The target user's ID
 * @param {object} data - The execution results/output
 */
export const sendResultToClient = (event, userId, data) => {
  if (io) {
    // Emits to the private room we created in the connection step
    io.to(userId).emit(event, data);
  }
};
