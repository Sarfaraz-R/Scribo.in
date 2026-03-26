import Submission from '../modules/submission/submission.model.js';

export const submissionRepository = {
  createPending(data) {
    return Submission.create(data);
  },

  updateResultById(submissionId, payload) {
    return Submission.findByIdAndUpdate(submissionId, payload, { new: true });
  },

  findByProblemAndUser({ problemId, userId, limit = 50 }) {
    return Submission.find({ problemId, userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('status language runtime memory createdAt updatedAt');
  },

  findByIdForUser(submissionId, userId) {
    return Submission.findOne({ _id: submissionId, userId });
  },
};
