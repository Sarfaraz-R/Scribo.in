import mongoose, { Schema } from 'mongoose';

const facultySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    branches: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
      },
    ],
  },
  { timestamps: true }
);

facultySchema.index({ institutionId: 1, email: 1 }, { unique: true });

export const Faculty = mongoose.model('Faculty', facultySchema);
