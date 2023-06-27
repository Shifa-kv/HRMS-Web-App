import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const userSlice = createSlice({
    name:'user',
    initialState:InitialState.auth,
    reducers:{
        setUser:(state,action)=>{
            state.id = action.payload.id;
            state.uname = action.payload.name;
            state.type = action.payload.type;
            state.isAuthenticated = true;
            console.log('user updated:',state.type,state.uname);
        },
        unsetUser:(state)=>{
            return InitialState.auth
        }
    }
})
const {setUser,unsetUser} = userSlice.actions;
export default userSlice.reducer;
export {setUser,unsetUser}