import mongoose, { Schema } from 'mongoose';

const sectionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    facultyIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
      },
    ],
  },
  { timestamps: true }
);

sectionSchema.index({ batchId: 1, name: 1 }, { unique: true });

export const Section = mongoose.model('Section', sectionSchema);
