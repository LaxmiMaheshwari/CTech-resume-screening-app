import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MatchScoreResponse } from '../types/resume';
import { setUser } from "./features/userSlice";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";


const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const csrfRequiredEndpoints = [
      "promptResponse",
      "submitFeedback",
      "applicationFeedback",
      "visualizeOption",
    ];
    const csrfToken = (getState() as RootState).loginUser.csrfToken;
    if (csrfToken && csrfRequiredEndpoints.includes(endpoint)) {
      headers.set("X-CSRFToken", csrfToken);
    }
  },
});


const baseQueryWithRedirection: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const queryResponse = await baseQuery(args, api, extraOptions);
  const { error, meta } = queryResponse;
  const { user } = (api.getState() as RootState).loginUser;
  const SESSION_EXPIRED = error && meta?.response?.status === 401;
  // const BAD_GATEWAY = error && meta?.response?.status === 502;
  if (SESSION_EXPIRED && user) {
    api.dispatch(setUser(null));
    alert("Session Expired.Please sign in again");
    window.location.href =
      "https://resume-screening-dev-dot-b2c-de.uc.r.appspot.com/signin";
  }
  return queryResponse;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  // baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}` }),
    baseQuery: baseQueryWithRedirection,
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
