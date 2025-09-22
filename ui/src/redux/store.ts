import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api.ts';
import matchReducer from './features/match/matchSlice';


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
     match: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
