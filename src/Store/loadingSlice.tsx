import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const loadingSlice = createSlice({
    name:'loading',
    initialState:InitialState,
    reducers:{
        setLoading:(state,action)=>{
            state.isLoading = action.payload
            console.log('Loading set to ',action.payload)
        }
    }
})
const {setLoading} = loadingSlice.actions;
export {setLoading}
export default loadingSlice.reducer;