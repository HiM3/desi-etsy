import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  return user && token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
