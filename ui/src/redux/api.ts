import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import type {
  ResumePayloadType,
  ResumeResponseType,
} from "../types/resume";


const baseQuery = fetchBaseQuery({
  baseUrl:  import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const csrfRequiredEndpoints = [
      "promptResponse",
      "submitFeedback",
      "applicationFeedback",
      "visualizeOption",
    ];
    // const csrfToken = (getState() as RootState).loginUser.csrfToken;
    // if (csrfToken && csrfRequiredEndpoints.includes(endpoint)) {
    //   headers.set("X-CSRFToken", csrfToken);
    // }
  },
});


const baseQueryWithRedirection: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const queryResponse = await baseQuery(args, api, extraOptions);
  const { error, meta } = queryResponse;
  // const { user } = (api.getState() as RootState).loginUser;
  const SESSION_EXPIRED = error && meta?.response?.status === 401;
  // const BAD_GATEWAY = error && meta?.response?.status === 502;
  // if (SESSION_EXPIRED && user) {
  //   api.dispatch(setUser(null));
  //   alert("Session Expired.Please sign in again");
  //   window.location.href =
  //     "https://ctechbot-dot-ctech-growthopscore.el.r.appspot.com/signin";
  // }
  return queryResponse;
};


export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRedirection,
  tagTypes: ["Prompts"],
  endpoints: (builder) => ({
    // getCsrfToken: builder.query({
    //   query: () => `getCsrfToken`,
    // }),
    // getUser: builder.query({
    //   query: () => `user`,
    // }),
    getRecentPrompts: builder.query({
      query: () => `getRecentPrompts`,
      providesTags: ["Prompts"],
    }),
    screenResume: builder.mutation<ResumeResponseType, ResumePayloadType>({
      query: (body) => ({
        url: `screen_resume`,
        method: "POST",
        body,
      }),
      // invalidatesTags: ["Prompts"],
    })
  }),
});

export const {
  useGetRecentPromptsQuery,
  useScreenResumeMutation,
} = api;
