import mongoose, { Schema } from 'mongoose';

const testSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
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
    sectionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        index: true,
      },
    ],
    problemIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    duration: { type: Number, required: true, min: 5 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED'],
      default: 'SCHEDULED',
      index: true,
    },
  },
  { timestamps: true }
);

testSchema.index({ institutionId: 1, subjectId: 1, startTime: -1 });

export const Test = mongoose.model('Test', testSchema);
