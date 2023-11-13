import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";

//components
import PopupBox from "../components/startPage/PopupBox";

//mui
import Carousel from "react-material-ui-carousel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import MenuBookIcon from "@mui/icons-material/MenuBook";

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
      {/* <BG alt="startPage_2" src={`${process.env.PUBLIC_URL}/img/startPage_4.jpg`}></BG> */}
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
        <div>
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
        </div>
        <div>
          <StartImg alt="start_image" src={`${process.env.PUBLIC_URL}/img/start_image.png`}></StartImg>
        </div>
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
  font-size: 24px;
  white-space: pre-line;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;

  line-height: 36px;
  text-align: start;

  margin: 64px 0;
  @media screen and (max-width: 720px) {
    margin: 48px 0;
  }
`;

const Title = styled.span`
  /* text-transform: uppercase; */
  font-family: Pretendard-bold;
  > div {
    line-height: 80px;
    font-size: 72px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
    @media screen and (max-width: 720px) {
      font-size: 72px;
      line-height: 64px;
    }
    span:nth-child(2) {
      font-size: 48px;
      color: rgba(0, 0, 0, 0.4);
      @media screen and (max-width: 720px) {
        /* font-size: 64px; */
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
  @media screen and (max-width: 720px) {
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
  @media screen and (max-width: 720px) {
    flex-direction: column;
  }

  > div:nth-child(1) {
    width: 45vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;

    padding-left: 10vw;
    padding-top: 20vh;
    @media screen and (max-width: 720px) {
      width: 100vw;
      height: 70vh;
      height: calc(var(--vh, 1vh) * 65);
    }
  }
  > div:nth-child(2) {
    width: 55vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: end;
    padding-bottom: 20vh;
    @media screen and (max-width: 720px) {
      justify-content: end;
      align-items: start;
      width: 100vw;
      height: 30vh;
      height: calc(var(--vh, 1vh) * 35);
    }
  }

  animation: ${Animation.smoothAppear} 1s;
`;

const StartImg = styled.img`
  width: 90%;
  height: 70%;
  object-fit: contain;
  @media screen and (max-width: 720px) {
    width: 60%;
    height: 25vh;
    height: calc(var(--vh, 1vh) * 25);
    margin-right: 24px;
  }
`;

const StartButton = styled.button`
  z-index: 10;
  font-size: 20px;
  color: white;
  color: rgba(0, 0, 0, 0.7);
  text-transform: uppercase;

  padding: 12px 24px;

  background-color: #f4f6b1;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.15);

  cursor: pointer;
`;
