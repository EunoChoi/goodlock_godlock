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

  //google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        })
        .then((res) => res.data);

      console.log(userInfo);

      const email = userInfo.email;
      const profilePic = userInfo.picture;
      socialLogIn.mutate({ email, profilePic });

      googleLogout();
    }
  });

  //kakao login
  const kakaoLogin = () => {
    const REST_KEY = process.env.REACT_APP_KAKAO_REST_KEY;
    const REDIRECT_URI = process.env.REACT_APP_BASE_URL;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
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
