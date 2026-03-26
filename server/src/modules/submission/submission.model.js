import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Matches your AuthForge user model
      required: true,
      index: true, // Optimized for Step 10 lookups
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['cpp', 'python', 'java', 'javascript', 'sql'], // Matches frontend and assignment languages
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: [
        'Pending',
        'Accepted',
        'Wrong Answer',
        'TLE',
        'Runtime Error',
        'Internal Error',
      ],
    },
    // The following fields are populated in Step 8/9 by the Worker
    output: {
      type: String,
      default: '',
    },
    runtime: {
      type: String, // e.g., "12ms"
      default: null,
    },
    memory: {
      type: String, // e.g., "14MB"
      default: null,
    },
    executionTime: {
      type: Number,
      default: null,
    },
    memoryUsed: {
      type: Number,
      default: null,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      default: null,
      index: true,
    },
    jobId: {
      type: String, // Store the BullMQ job ID for tracking
    },
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ studentId: 1, createdAt: -1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
