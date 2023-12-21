import React, { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";

interface AuthRouteProps {
  component: ReactElement;
  accessType: string;
}

const AuthRoute = ({ accessType, component }: AuthRouteProps) => {
  const navigate = useNavigate();

  if (accessType === "admin") {
    //need admin auth page
  }
  if (accessType === "login") {
    //need login auth page
    const { isLoading } = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
      refetchOnWindowFocus: true,
      // staleTime: 5 * 60 * 1000,
      onSuccess: () => {
        // console.log("유저 정보 불러오기 성공");
        return <>{component}</>;
      },
      onError: () => {
        console.log("유저 정보를 불러오지 못했습니다.");
        navigate("/");
        location.reload();
      }
    });
    if (isLoading) return <Loading></Loading>;
  }

  return <>{component}</>;
};
export default AuthRoute;
