import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api.ts";
const store=configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,       
    },
    middleware:(getDeafultMiddleWare)=>getDeafultMiddleWare().concat(api.middleware),
})

export type RootState=ReturnType<typeof store.getState>;
export default store;