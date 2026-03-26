import { asyncHandler } from '../utils/asyncHandler';
import api from './api';

// export const getAllInstitutions = asyncHandler(async ({difficulty , tag , page }) => {
//   const { data } = await api.post('/problems', payload);
//   return data;
// });

export const getProblems = asyncHandler(async (search, currentPage) => {
      console.log(
        "fetching problems with search:",
        search,
        "and page:",
        currentPage,
      );

  const { data } = await api.get(
    `/problems?page=${currentPage}&search=${search}`

  );
      console.log(
        "fetching problems with search:",
        search,
        "and page:",
        currentPage,
      );

  return data;
});

export const getProblemBySlug = asyncHandler(async (problemSlug) => {
  console.log("fecting problem by slug:", problemSlug);
  const { data } = await api.get(`/problems/${problemSlug}`);
  console.log("Fetched problem:", data);
  return data;
});
