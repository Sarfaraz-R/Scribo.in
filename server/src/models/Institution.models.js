import mongoose, { Schema } from 'mongoose';
import { status, statusEnum } from '../constants/constants.js';

const InstitutionSchema = new Schema(
  {
    // Identity & Routing
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortName: { type: String }, // e.g., "RNSIT"
    code: { type: String, unique: true, sparse: true }, //
    domain: { type: String, lowercase: true },

    // Multi-Tenant Relationships
    superAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    }, // Points to the primary institution owner
    adminUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Configuration Sub-Docs
    subscription: {
      plan: {
        type: String,
        enum: ['trial', 'basic', 'pro', 'enterprise'],
        default: 'trial',
      },
      status: {
        type: String,
        enum: statusEnum,
        default: status.pending,
      },
      expiresAt: { type: Date },
    },

    // featureFlags: {
    //   proctoring: { type: Boolean, default: false },
    //   plagiarismCheck: { type: Boolean, default: false },
    //   customBranding: { type: Boolean, default: false },
    //   advancedAnalytics: { type: Boolean, default: false },
    // },

    branding: {
      logoUrl: { type: String, default: '' },
      primaryColor: { type: String, default: '#f97316' },
    },

    // Metadata & Stats
    //     //   currentSemester: String,
    //     //   currentSemester: String,
    //     //   currentSemester: String,
    //     //   currentSemester: String,
    //     //   currentSemester: String,
    //   academicYear: String,
    // },

    stats: {
      totalStudents: { type: Number, default: 0 },
      totalFaculty: { type: Number, default: 0 },
      totalTests: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const InstitutionModel = mongoose.model("Institution",InstitutionSchema);

