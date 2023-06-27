import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import loadingSlice from "./loadingSlice";
import noticeSlice from "./noticeSlice";

const Store = configureStore({
    reducer: {
        user : userSlice,
        loading : loadingSlice,
        notice : noticeSlice
    }
});
export default Store