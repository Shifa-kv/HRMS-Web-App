import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const noticeSlice = createSlice({
    name:'notice',
    initialState:InitialState.notice,
    reducers:{
        setNotice:(state,action)=>{
            state.status = true;
            state.data = {
                [action.payload?.name]:
                {
                    message:[action.payload?.msg],
                    code:action.payload?.code,
                    time:action.payload?.time,
                }
            }
        },
        delNotice:(state,action)=>{
            state.status = false;
            delete state.data?.[action.payload];
        }
    }
});

const {setNotice,delNotice} = noticeSlice.actions;
export {setNotice,delNotice}
export default noticeSlice.reducer
