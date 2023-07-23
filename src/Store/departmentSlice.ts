import { createSlice } from "@reduxjs/toolkit"
import { InitialState } from "./types"

const departmentSlice = createSlice({
    name:'department',
    initialState:InitialState.department,
    reducers:{
        setDepartment:(state,action)=>{
            console.log('departments added to store');
            return action.payload
        }
    }
})

const {setDepartment} = departmentSlice.actions;

export default departmentSlice.reducer;
export {setDepartment}