import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MatchScoreResponse } from '../../../types/resume';

interface MatchState {
  data: MatchScoreResponse | null;
}

const initialState: MatchState = {
  data: null,
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setMatchData: (state, action: PayloadAction<MatchScoreResponse>) => {
      state.data = action.payload;
    },
    clearMatchData: (state) => {
      state.data = null;
    },
  },
});

export const { setMatchData, clearMatchData } = matchSlice.actions;
export default matchSlice.reducer;
