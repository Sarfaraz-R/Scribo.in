import { Problem } from '../models/Problem.models.js';

export const problemRepository = {
  findActiveBySlug(slug) {
    return Problem.findOne({ slug, isActive: true });
  },

  listActive({ query, page, limit }) {
    const skip = (page - 1) * limit;
    return Promise.all([
      Problem.find(query)
        .select('title slug difficulty tags company visibility belongsTo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Problem.countDocuments(query),
    ]);
  },

  findBySlug(slug) {
    return Problem.findOne({ slug });
  },

  create(data) {
    return Problem.create(data);
  },
};
