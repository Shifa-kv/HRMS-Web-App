export type RootState = {
  isLoading: boolean
  auth: User
  notice:{    
    status:boolean,
    data?:{
      [key:string]:Notice
    }
  }
};
type User = {
  isAuthenticated:boolean;
  id: number;
  type?: string;
  uname?: string;
}
export type Notice = {
  message?:[string]
  code?:number,  //1:error,2:warning,3:success
  time?:number // in seconds
}

const InitialState: RootState = {
  isLoading:true,
  auth: {
    isAuthenticated:false,
    id: 0
  },
  notice: {
    status:false,
  }
};

export { InitialState };
