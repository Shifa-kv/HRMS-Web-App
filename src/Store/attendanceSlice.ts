import { createSlice } from "@reduxjs/toolkit"
import { InitialState } from "./types"

const attendanceSlice = createSlice({
    name:'attendance',
    initialState:InitialState.attendance,
    reducers:{
        setAttendance:(state,action)=>{
            console.log('attendance data updated');
            return action.payload
        }
    }
})

const {setAttendance} = attendanceSlice.actions;

export default attendanceSlice.reducer;
export {setAttendance}