import { jest } from '@jest/globals';

const redisConnectionMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  scan: jest.fn(),
};

const problemRepositoryMock = {
  findActiveBySlug: jest.fn(),
  listActive: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
};

jest.unstable_mockModule('../../config/Redis.config.js', () => ({
  redisConnection: redisConnectionMock,
}));

jest.unstable_mockModule('../../repositories/problem.repository.js', () => ({
  problemRepository: problemRepositoryMock,
}));

const { problemService } = await import('../../services/problem.service.js');
const { ApiError } = await import('../../utils/ApiError.js');

describe('problemService insert and fetch flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    redisConnectionMock.get.mockResolvedValue(null);
    redisConnectionMock.set.mockResolvedValue('OK');
    redisConnectionMock.del.mockResolvedValue(1);
    redisConnectionMock.scan.mockResolvedValue(['0', []]);
  });

  it('inserts a problem and clears cached problem lists', async () => {
    const payload = {
      title: 'Two Sum',
      slug: 'Two-Sum',
      description: 'Find indices of two numbers that add up to target.',
      difficulty: 'EASY',
      inputFormat: 'nums and target',
      outputFormat: 'indices',
      tags: ['Array', 'HashMap'],
    };

    const user = { _id: 'user-123' };
    const createdProblem = {
      _id: 'problem-123',
      ...payload,
      slug: 'two-sum',
      createdBy: user._id,
      isActive: true,
    };

    problemRepositoryMock.findBySlug.mockResolvedValue(null);
    problemRepositoryMock.create.mockResolvedValue(createdProblem);
    redisConnectionMock.scan
      .mockResolvedValueOnce(['1', ['problems:1:10:', 'problems:1:10:array']])
      .mockResolvedValueOnce(['0', []]);

    const response = await problemService.createProblem(payload, user);

    expect(problemRepositoryMock.create).toHaveBeenCalledWith({
      ...payload,
      slug: 'two-sum',
      createdBy: user._id,
      isActive: true,
    });
    expect(redisConnectionMock.del).toHaveBeenNthCalledWith(
      1,
      'problems:1:10:',
      'problems:1:10:array'
    );
    expect(redisConnectionMock.del).toHaveBeenNthCalledWith(2, 'problem:two-sum');
    expect(response.statusCode).toBe(201);
    expect(response.data.slug).toBe('two-sum');
  });

  it('fetches problems from repository when cache is empty', async () => {
    const storedProblems = [
      {
        _id: 'problem-123',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'EASY',
        tags: ['Array'],
        company: ['Google'],
      },
    ];

    problemRepositoryMock.listActive.mockResolvedValue([storedProblems, 1]);

    const response = await problemService.listProblems({
      page: 1,
      limit: 10,
      search: '',
    });

    expect(problemRepositoryMock.listActive).toHaveBeenCalledWith({
      query: { isActive: true },
      page: 1,
      limit: 10,
    });
    expect(redisConnectionMock.set).toHaveBeenCalledTimes(1);
    expect(response.data.problems).toEqual(storedProblems);
    expect(response.data.pagination.totalMatching).toBe(1);
  });

  it('rejects insert when authenticated user is missing', async () => {
    await expect(
      problemService.createProblem(
        {
          title: 'Two Sum',
          slug: 'two-sum',
        },
        null
      )
    ).rejects.toBeInstanceOf(ApiError);
  });
});