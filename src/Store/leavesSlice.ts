import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const leaveSlice = createSlice({
    name:'leavesData',
    initialState:InitialState.leaveData,
    reducers:{
        setUserLeaves:(state,action)=>{
            console.log('user leave data added to store');
            state.userLeaves = action.payload;
        },
        setLeavesTypes:(state,action)=>{
            console.log('user leave data added to store');
            state.leavesTypes = action.payload;
        }
    }
})

const {setUserLeaves, setLeavesTypes} = leaveSlice.actions;
export {setUserLeaves, setLeavesTypes}
export default leaveSlice.reducer

