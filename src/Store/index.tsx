import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import loadingSlice from "./loadingSlice";
import noticeSlice from "./noticeSlice";
import departmentSlice from "./departmentSlice";

const Store = configureStore({
    reducer: {
        user : userSlice,
        loading : loadingSlice,
        notice : noticeSlice,
        department: departmentSlice,
    }
});
export default Store