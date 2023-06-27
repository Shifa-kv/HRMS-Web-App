import React from "react";
import { Route, Navigate, Routes } from "react-router-dom"

type PrivateRouteProps = {
    children: React.ReactElement;
    isAuthenticated: boolean;
    isValidUsertype:boolean
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children,isValidUsertype }) => {
    return isAuthenticated && isValidUsertype ? children : (<Navigate to="/" />);
  };

export default PrivateRoute