import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import loadingSlice from "./loadingSlice";
import noticeSlice from "./noticeSlice";
import departmentSlice from "./departmentSlice";
import attendanceSlice from "./attendanceSlice";

const Store = configureStore({
    reducer: {
        user : userSlice,
        loading : loadingSlice,
        notice : noticeSlice,
        department: departmentSlice,
        attendance: attendanceSlice
    }
});
export default Store