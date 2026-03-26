import mongoose, { Schema } from 'mongoose';

const completedProblemSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      default: null,
    },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const testAttemptSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
      index: true,
    },
    score: { type: Number, default: 0 },
    completedProblems: {
      type: [completedProblemSchema],
      default: [],
    },
    startedAt: { type: Date, required: true, index: true },
    submittedAt: { type: Date, default: null, index: true },
    state: {
      type: String,
      enum: ['IN_PROGRESS', 'SUBMITTED'],
      default: 'IN_PROGRESS',
      index: true,
    },
  },
  { timestamps: true }
);

testAttemptSchema.index({ studentId: 1, testId: 1 }, { unique: true });

export const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
