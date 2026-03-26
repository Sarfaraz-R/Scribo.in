import mongoose, { Schema } from 'mongoose';

const exampleSchema = new Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const constraintSchema = new Schema(
  {
    description: { type: String },
  },
  { _id: false }
);

const limitsSchema = new Schema(
  {
    timeLimit: { type: Number, default: 5000 }, // in ms
    memoryLimit: { type: Number, default: 256 }, // in MB
  },
  { _id: false }
);

// ─────────────────────────────
// EMBEDDED TEST CASE SCHEMA
// Each test case stores raw input/output strings.
// Input format: first line = number of test cases (t),
// followed by t blocks of problem-specific input.
// e.g.:
//   3
//   5
//   1 2 3 4 5
//   2
//   10 20
//   1
//   7
// ─────────────────────────────
const testCaseSchema = new Schema(
  {
    input: { type: String, required: true }, // full stdin string
    output: { type: String, required: true }, // expected stdout string
    tier: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    }, // 1=sample/easy, 2=medium, 3=hard/edge
    isSample: { type: Boolean, default: false }, // mirrors the examples shown in UI
  },
  { _id: true }
);

const problemSchema = new Schema(
  {
    // ─────────────────────────────
    // BASIC INFO
    // ─────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String, // markdown supported
      required: true,
    },

    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
      required: true,
      index: true,
    },

    tags: [String],
    starterCode: {
      cpp: { type: String, default: '' },
      java: { type: String, default: '' },
      python: { type: String, default: '' },
      javascript: { type: String, default: '' },
    },

    // ─────────────────────────────
    // PROBLEM FORMAT
    // ─────────────────────────────
    inputFormat: {
      type: String,
      required: true,
    },

    outputFormat: {
      type: String,
      required: true,
    },

    company: [String],
    constraints: [constraintSchema],
    limits: limitsSchema,
    examples: [exampleSchema],
    editorial: String,
    points: Number,

    // ─────────────────────────────
    // TEST CASES (embedded directly in the problem document)
    // Use this for problems with a manageable number of test cases.
    // For large sets, keep zipFilePath as a fallback.
    // ─────────────────────────────
    testCases: {
      type: [testCaseSchema],
      default: [],
    },
    hiddenTestCases: {
      type: [testCaseSchema],
      default: [],
    },

    // Optional: zip fallback for very large test suites
    zipFilePath: {
      type: String,
    },

    // ─────────────────────────────
    // MULTI-TENANT SUPPORT
    // ─────────────────────────────
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      default: null,
    },

    visibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PUBLIC',
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    institutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    timeLimit: {
      type: Number,
      default: 2000,
    },
    memoryLimit: {
      type: Number,
      default: 256,
    },
  },
  { timestamps: true }
);

problemSchema.index({ institutionId: 1, difficulty: 1, createdAt: -1 });

export const Problem = mongoose.model('Problem', problemSchema);
