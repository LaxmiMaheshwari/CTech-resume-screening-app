import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MatchScoreResponse } from '../types/resume';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}` }),
  endpoints: (builder) => ({
    uploadResume: builder.mutation<{ message: string }, FormData>({
      query: (formData) => ({
        url: 'screen_resume',
        method: 'POST',
        body: formData,
      }),
    }),
    getMatchScore: builder.query<MatchScoreResponse, void>({
      query: () => 'match-score',
    }),
    getUser: builder.query({
      query: () => `user`,
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useGetMatchScoreQuery,
  useGetUserQuery
} = apiSlice;
