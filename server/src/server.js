import { initSocket } from './socket/socket.manager.js';
import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/Db.config.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const port = env.PORT || 3000;
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${port} is already in use. Waiting for it to free...`);
    process.exit(1);
  } else {
    logger.error({ err }, 'Server error');
    process.exit(1);
  }
});

connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      logger.info(`Server listening on PORT : ${port}`);
    });
  })
  .catch((err) => {
    logger.error({ err }, 'DB connection failed');
    process.exit(1);
  });

// ✅ Nodemon sends SIGUSR2 to restart — close server first, then exit
process.once('SIGUSR2', () => {
  logger.warn('Nodemon restart - closing server...');
  httpServer.close(() => {
    logger.info('Server closed, restarting...');
    process.kill(process.pid, 'SIGUSR2');
  });

  // Force exit after 3s if close hangs (e.g. open sockets)
  setTimeout(() => {
    logger.warn('Force exit after timeout');
    process.exit(0);
  }, 3000).unref();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down');
  httpServer.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down');
  httpServer.close(() => process.exit(0));
});
