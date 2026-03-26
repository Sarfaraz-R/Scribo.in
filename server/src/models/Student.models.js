import mongoose, { Schema } from 'mongoose';

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
      index: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    solvedProblems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    testHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TestAttempt',
      },
    ],
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

studentSchema.index({ institutionId: 1, email: 1 }, { unique: true });
studentSchema.index({ institutionId: 1, rollNumber: 1 }, { unique: true });
studentSchema.index({ branchId: 1, batchId: 1, sectionId: 1 });

export const Student = mongoose.model('Student', studentSchema);
