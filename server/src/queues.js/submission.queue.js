import { Queue } from 'bullmq';
import { redisConnection } from '../config/Redis.config.js';
import { logger } from '../config/logger.js';

// Define the queue name exactly as the worker will see it
export const submissionQueue = new Queue('code-submissions', {
  connection: redisConnection, // Use the central Redis config
});

export const addSubmissionToQueue = async (data) => {
  try {
    const job = await submissionQueue.add('execute-code', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: 100,
      removeOnFail: 1000,
    });
    logger.info(`[Queue] Job added: ${job.id}`);
    return job;
  } catch (error) {
    logger.error({ error }, '[Queue] Error adding to queue');
    throw error;
  }
};