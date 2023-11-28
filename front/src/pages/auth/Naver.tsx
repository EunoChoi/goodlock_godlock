import React, { ReactElement } from "react";
import styled from "styled-components";
import axios from "axios";

import User from "../../functions/reactQuery/User";
import { useNavigate } from "react-router-dom";

const Naver = () => {
  const navigate = useNavigate();
  //kakao login
  const socialLogIn = User.socialLogIn();

  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;
  const NAVER_STATE_CODE = process.env.REACT_APP_NAVER_STATE_CODE;
  const REDIRECT_URI = process.env.REACT_APP_BASE_URL + "/auth/naver";
  const code = new URL(window.location.href).searchParams.get("code");

  if (code) {
    console.log(code);
    let getTokenUrl = "https://nid.naver.com/oauth2.0/token";
    getTokenUrl += `?grant_type=authorization_code`;
    getTokenUrl += `&client_id=${NAVER_CLIENT_ID}`;
    getTokenUrl += `&client_secret=${NAVER_CLIENT_SECRET}`;
    // getTokenUrl += `&redirect_uri=${REDIRECT_URI}`;
    getTokenUrl += `&code=${code}`;
    getTokenUrl += `&state=${NAVER_STATE_CODE}`;
    try {
      axios
        .post(
          "https://nid.naver.com/oauth2.0/token",
          {
            grant_type: "authorization_code",
            client_id: NAVER_CLIENT_ID,
            client_secret: NAVER_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code,
            state: NAVER_STATE_CODE
          },
          {
            headers: { "X-Naver-Client-Id": NAVER_CLIENT_ID, "X-Naver-Client-Secret": NAVER_CLIENT_SECRET }
          }
        )
        .then(async (res) => {
          console.log(res);
          // const access_token = res.data.access_token;
          // console.log("access_token 발급");
          // await axios
          //   .get("https://kapi.kakao.com/v2/user/me", {
          //     headers: {
          //       Authorization: `Bearer ${access_token}`
          //     }
          //   })
          //   .then((res) => {
          //     // console.log(res);
          //     const email = res.data.kakao_account.email;
          //     const profilePic = res.data.properties.profile_image;
          //     console.log(email, profilePic);
          //     socialLogIn.mutate({ email, profilePic });
          //   });
        });
    } catch (err) {
      navigate("/");
    }
  }

  return (
    <LoadingWrapper>
      <img src={`${process.env.PUBLIC_URL}/img/loading.png`}></img>
      <img src={`${process.env.PUBLIC_URL}/img/loading.gif`}></img>
    </LoadingWrapper>
  );
};

export default Naver;

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img:first-child {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
  img:nth-child(2) {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
`;
