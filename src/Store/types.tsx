import { Timestamp } from "../Firebase/Config";

export type RootState = {
  isLoading: boolean
  auth: User
  notice: {
    status: boolean,
    data?: {
      [key: string]: Notice
    }
  }
  department?: department | null
  attendance:attendance
  leaveData:{
    userLeaves:{[key: string]: any } | null
    leavesTypes:{} | null
  }
  
};
type User = {
  isAuthenticated: boolean;
  id: string;
  type?: string;
  uname?: string;
}
export type Notice = {
  message?: [string]
  code?: number,  //1:error,2:warning,3:success
  time?: number // in seconds
}
type department = [{
  id?: string,
  title?: string
}]
type attendance = {
  allowCheckin: boolean,
  attnd_id?: string,
  time_in?: string,
  time_out?: string
}

const InitialState: RootState = {
  isLoading: true,
  auth: {
    isAuthenticated: false,
    id: ''
  },
  notice: {
    status: false,
  },
  department: null,
  attendance:{
    allowCheckin:false
  },
  leaveData:{
    userLeaves: null,
    leavesTypes:null
  } 
};

export { InitialState };
