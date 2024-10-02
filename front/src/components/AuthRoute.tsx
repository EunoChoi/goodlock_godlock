import React, { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";
import User from "../functions/reactQuery/User";
import { toast } from "react-toastify";

interface AuthRouteProps {
  component: ReactElement;
  accessType: string;
}

const AuthRoute = ({ accessType, component }: AuthRouteProps) => {
  const navigate = useNavigate();

  if (accessType === "admin") {
    //for admin page
  }
  if (accessType === "login") {
    //need login auth page
    const { isSuccess, isError, isLoading, failureCount } = User.getForAuth();

    if (isSuccess) {
      return <>{component}</>;
    } else if (failureCount >= 2) {
      console.log("유저 정보를 불러오지 못했습니다.");
      navigate("/");
      // setTimeout(() => {
      //   toast.error("로그인이 필요합니다.");
      // }, 100);
    } else if (isLoading) {
      return <Loading />;
    }
  }

  return <>{component}</>;
};
export default AuthRoute;
