import mongoose, { Schema } from 'mongoose';

const branchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

branchSchema.index({ institutionId: 1, name: 1 }, { unique: true });

export const Branch = mongoose.model('Branch', branchSchema);
