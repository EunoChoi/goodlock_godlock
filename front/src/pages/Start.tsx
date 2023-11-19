import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";

//components
import PopupBox from "../components/startPage/PopupBox";

//styles
import SignUp from "../components/startPage/SignUp";
import LogIn from "../components/startPage/LogIn";
import Animation from "../styles/Animation";

const Start = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [toggle, setToggle] = useState(true); //login - signup toggle

  const { data: isLoggedIn } = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data));
  const navigate = useNavigate();

  const text = "굿락 팁&설정 공유 플랫폼";
  useEffect(() => {
    setToggle(true);
  }, [popupOpen]);

  return (
    <>
      <BG />
      <BG2 />
      <Footer>
        <span>문의 : pixel@kakao.com</span>
        <span>
          <a href="https://kr.freepik.com/free-vector/student-with-laptop-studying-on-online-course_7732666.htm#from_view=detail_author">
            ❖ Freepik, pch.vector
          </a>
        </span>
      </Footer>
      <StartWrapper>
        <Title>
          <div>
            <span>G</span>
            <span>ood Lock</span>
          </div>
          <div>
            <span>G</span>
            <span>od Lock</span>
          </div>
        </Title>
        <TextBox>{text}</TextBox>
        <StartButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isLoggedIn) navigate("/main/0");
            else setPopupOpen(true);
          }}
        >
          함께하기
        </StartButton>

        <StartImg alt="start_image" src={`${process.env.PUBLIC_URL}/img/start_image.png`}></StartImg>
      </StartWrapper>
      {popupOpen && (
        <>
          <PopupBox popupOpen={popupOpen} setPopupOpen={setPopupOpen}>
            {toggle && <LogIn setToggle={setToggle} setPopupOpen={setPopupOpen}></LogIn>}
            {!toggle && <SignUp setToggle={setToggle}></SignUp>}
          </PopupBox>
        </>
      )}
    </>
  );
};

export default Start;

const TextBox = styled.div`
  /* font-family: OAGothic-ExtraBold; */

  font-size: 24px;
  white-space: pre-line;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;

  line-height: 36px;
  text-align: start;

  margin: 64px 0;

  @media (orientation: portrait) or (max-height: 480px) {
    margin: 48px 0;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    margin: 36px 0;
  }
`;

const Title = styled.span`
  > div {
    margin-left: -10px;

    span:nth-child(1) {
      font-family: OAGothic-ExtraBold;
      font-size: 96px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.7);
      @media (orientation: portrait) or (max-height: 480px) {
        font-size: 72px;
      }
    }
    span:nth-child(2) {
      /* font-family: OAGothic-ExtraBold; */
      font-size: 72px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.4);
      @media (orientation: portrait) or (max-height: 480px) {
        font-size: 60px;
      }
    }
  }
`;

const BG = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: #c7d7ff;
`;
const BG2 = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 30vh;
  @media (orientation: portrait) or (max-height: 480px) {
    height: 20vh;
  }

  background-color: rgba(0, 0, 0, 0.2);
`;
const Footer = styled.div`
  z-index: 19;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 32px;

  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 12px;

  span {
    margin-left: 16px;
  }
`;

const StartWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  padding-left: 10vw;
  @media (orientation: portrait) or (max-height: 480px) {
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }

  animation: ${Animation.smoothAppear} 1s;
`;

const StartImg = styled.img`
  position: fixed;
  right: 5vw;
  bottom: calc(var(--vh, 1vh) * 12);

  width: 50%;
  height: 50%;
  object-fit: contain;
  @media (orientation: portrait) or (max-height: 480px) {
    width: 70%;
    height: calc(var(--vh, 1vh) * 25);
    /* margin-right: 24px; */
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 50%;
    height: 70%;
  }
`;

const StartButton = styled.button`
  /* font-family: OAGothic-ExtraBold; */

  z-index: 99;
  font-size: 20px;
  color: white;
  color: rgba(0, 0, 0, 0.7);
  text-transform: uppercase;

  padding: 12px 24px;
  font-weight: 600;

  border-radius: 6px;

  background-color: #f4f6b1;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.15);

  cursor: pointer;
`;
