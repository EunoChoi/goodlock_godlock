import React, { useEffect, useState } from "react";
import LogInSignUp from "../../styles/LogInSignUp";
import { ANIMATION_APPEAR, ANIMATION_DISAPPEAR } from "../../styles/Animation";
import styled from "styled-components";
import { googleLogout } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

import axios from "axios";

//mui
import CancelIcon from "@mui/icons-material/Cancel";
import IsMobile from "../../functions/IsMobile";
import User from "../../functions/reactQuery/User";

interface AppLayoutProps {
  popupOpen: boolean;
  setPopupOpen: (b: boolean) => void;
  children: React.ReactNode;
}

const PopupBox: React.FC<AppLayoutProps> = ({ popupOpen, setPopupOpen, children }: AppLayoutProps) => {
  const [animation, setAnimation] = useState(ANIMATION_APPEAR);
  const isMobile = IsMobile();

  const socialLogIn = User.socialLogIn();
  const KAKAO_REST_KEY = process.env.REACT_APP_KAKAO_REST_KEY;
  const REDIRECT_URI_KAKAO = process.env.REACT_APP_BASE_URL + "/auth/kakao";

  const GOOGLE_CLIENT_KEY = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const REDIRECT_URI_GOOGLE = process.env.REACT_APP_BASE_URL + "/auth/google";

  //google login
  const googleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_KEY}&redirect_uri=${REDIRECT_URI_GOOGLE}&response_type=code&scope=email profile&prompt=select_account`;
  };

  //kakao login
  const kakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${REDIRECT_URI_KAKAO}&response_type=code&prompt=select_account`;
  };

  return (
    <>
      {popupOpen && (
        <LogInSignUp.Background
          animation={animation}
          onClick={() => {
            setAnimation(ANIMATION_DISAPPEAR);
            setTimeout(() => {
              setPopupOpen(false);
            }, 400);
          }}
        >
          <LogInSignUp.Box onClick={(e) => e.stopPropagation()}>
            {children}
            <LogInSignUp.Bar />
            <SNSLoginWrapper>
              <SNSLoginButton color="white" onClick={() => googleLogin()}>
                <Logo src={`${process.env.PUBLIC_URL}/img/google.png`} alt="google" />
              </SNSLoginButton>

              <SNSLoginButton color="#FAE100" onClick={() => kakaoLogin()}>
                <Logo src={`${process.env.PUBLIC_URL}/img/kakao.png`} alt="kakao" />
              </SNSLoginButton>

              <SNSLoginButton color="#02C73C">
                <Logo src={`${process.env.PUBLIC_URL}/img/naver.png`} alt="naver" />
              </SNSLoginButton>
            </SNSLoginWrapper>
          </LogInSignUp.Box>
          {isMobile && (
            <CancelBtn>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          )}
        </LogInSignUp.Background>
      )}
    </>
  );
};

export default PopupBox;

const SNSLoginWrapper = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 32px 0;
`;
const SNSLoginButton = styled.button<{ color: string }>`
  width: 54px;
  height: 54px;
  border-radius: 54px;

  border: 1px solid rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${(props) => props.color};
  color: black;
  margin: 0 8px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
`;
const Logo = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
`;
const CancelBtn = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  color: rgba(0, 0, 0, 0.8);
  @media (orientation: landscape) and (max-height: 480px) {
    display: none;
  }
`;
