import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { redisConnection } from '../config/Redis.config.js';
import { problemRepository } from '../repositories/problem.repository.js';

const deleteKeysByPattern = async (pattern) => {
  let cursor = '0';

  do {
    const [nextCursor, keys] = await redisConnection.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      100
    );

    if (keys.length) {
      await redisConnection.del(...keys);
    }

    cursor = nextCursor;
  } while (cursor !== '0');
};

const parseCached = async (cacheKey) => {
  const cached = await redisConnection.get(cacheKey);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch {
    await redisConnection.del(cacheKey);
    return null;
  }
};

export const problemService = {
  async getProblemBySlug({ slug, user }) {
    if (!slug) throw new ApiError(400, 'Problem slug is required');

    const normalized = slug.toLowerCase();
    const cacheKey = `problem:${normalized}`;

    const cached = await parseCached(cacheKey);
    if (cached) return new ApiResponse(200, cached, 'Problem fetched successfully (cached)');

    const problem = await problemRepository
      .findActiveBySlug(normalized)
      .select('-zipFilePath -testCases')
      .lean();

    if (!problem) throw new ApiError(404, 'Problem not found');

    if (problem.visibility === 'PRIVATE') {
      if (!user) throw new ApiError(403, 'Unauthorized access');
      if (
        problem.belongsTo &&
        problem.belongsTo.toString() !== user.institutionId?.toString()
      ) {
        throw new ApiError(403, 'You do not have access to this problem');
      }
    }

    if (problem.visibility === 'PUBLIC') {
      await redisConnection.set(cacheKey, JSON.stringify(problem), 'EX', 600);
    }

    return new ApiResponse(200, problem, 'Problem fetched successfully');
  },

  async listProblems({ page = 1, limit = 10, search = '' }) {
    const cacheKey = `problems:${page}:${limit}:${search}`;
    const cached = await parseCached(cacheKey);
    if (cached) return cached;

    const query = { isActive: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const [problems, totalMatching] = await problemRepository.listActive({
      query,
      page,
      limit,
    });

    const response = new ApiResponse(
      200,
      {
        problems,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMatching / limit),
          totalMatching,
          hasNextPage: page * limit < totalMatching,
        },
      },
      'Problems fetched successfully'
    );

    if (totalMatching > 0) {
      await redisConnection.set(cacheKey, JSON.stringify(response), 'EX', 600);
    }

    return response;
  },

  async createProblem(problemData, user) {
    if (!problemData?.title || !problemData?.slug) {
      throw new ApiError(400, 'Title and slug are required');
    }

    if (!user?._id) {
      throw new ApiError(401, 'Authenticated user is required to create a problem');
    }

    const normalizedSlug = problemData.slug.toLowerCase();
    const existing = await problemRepository.findBySlug(normalizedSlug);
    if (existing) throw new ApiError(409, 'Problem with this slug already exists');

    const created = await problemRepository.create({
      ...problemData,
      slug: normalizedSlug,
      createdBy: user._id,
      isActive: true,
    });

    await deleteKeysByPattern('problems:*');
    await redisConnection.del(`problem:${normalizedSlug}`);

    return new ApiResponse(201, created, 'Problem inserted successfully');
  },
};
