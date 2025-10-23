import { createSlice } from "@reduxjs/toolkit";
type UserResponseType = {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  hd: string;
  name: string;
  picture: string;
  sub: string;
};
type UserType = {
  user: UserResponseType | null;
  csrfToken: string | null;
};
const initialState: UserType = { user: null, csrfToken: null };
const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setCsrfToken: (state, { payload }) => {
      state.csrfToken = payload;
    },
  },
});
export const { setUser, setCsrfToken } = userSlice.actions;
export default userSlice.reducer;
