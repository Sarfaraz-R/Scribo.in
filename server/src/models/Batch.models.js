import mongoose, { Schema } from 'mongoose';

const batchSchema = new Schema(
  {
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    startYear: { type: Number, required: true, min: 2000, max: 2100 },
    endYear: { type: Number, required: true, min: 2001, max: 2105 },
  },
  { timestamps: true }
);

batchSchema.index(
  { branchId: 1, startYear: 1, endYear: 1 },
  { unique: true, name: 'uniq_batch_per_branch' }
);

export const Batch = mongoose.model('Batch', batchSchema);
