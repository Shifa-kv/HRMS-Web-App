import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const userSlice = createSlice({
    name:'user',
    initialState:InitialState.auth,
    reducers:{
        setUser:(state,action)=>{
            console.log('user updated:',state.type,state.uname);
            return {...action.payload,isAuthenticated:true}
        },
        unsetUser:(state)=>{
            return InitialState.auth
        }
    }
})
const {setUser,unsetUser} = userSlice.actions;
export default userSlice.reducer;
export {setUser,unsetUser}