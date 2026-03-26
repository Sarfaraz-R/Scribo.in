import mongoose, { Schema } from 'mongoose';

const subjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
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
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

subjectSchema.index({ institutionId: 1, code: 1 }, { unique: true });
subjectSchema.index({ branchId: 1, batchId: 1, name: 1 });

export const Subject = mongoose.model('Subject', subjectSchema);
