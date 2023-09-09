import React, { useState } from "react";
import styled from "styled-components";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FullPage, Slide } from "react-full-page";

//components
import EmptyPopup from "../components/startPage/EmptyPopup";

//styles
import FullCoverImg from "../styles/FullCoverImg";
import RelativeWrapper from "../styles/RelativeWrapper";
import CenterBox from "../styles/CenterBox";
import SignUp from "../components/startPage/SignUp";
import LogIn from "../components/startPage/LogIn";
import Animation from "../styles/Animation";
import { useQuery } from "@tanstack/react-query";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [toggle, setToggle] = useState(true); //login - signup toggle

  const { data: isLoggedIn } = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data));
  const navigate = useNavigate();

  return (
    <FullPage>
      <Slide>
        <RelativeWrapper>
          <StartSubTextWrapper>
            <StartSubText>사랑이 부족한 이 시대</StartSubText>
            <StartSubText>공감과 위로가 전해지기를</StartSubText>
          </StartSubTextWrapper>
          <StartMainText>나랑문학</StartMainText>
          <FullCoverImg alt="startPage_1" src={`${process.env.PUBLIC_URL}/img/startPage_3.jpg`}></FullCoverImg>
        </RelativeWrapper>
      </Slide>
      <Slide>
        <RelativeWrapper>
          {!popupOpen && (
            <CenterBox>
              <StartSubText>나랑문학 소개 글 들어갈 공간</StartSubText>
              <GoButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isLoggedIn) navigate("/main/0");
                  else setPopupOpen(true);
                }}
              >
                함께 하기
              </GoButton>
            </CenterBox>
          )}
          {popupOpen && (
            <>
              <EmptyPopup popupOpen={popupOpen} setPopupOpen={setPopupOpen}>
                {toggle && <LogIn setToggle={setToggle} setPopupOpen={setPopupOpen}></LogIn>}
                {!toggle && <SignUp setToggle={setToggle}></SignUp>}
              </EmptyPopup>
            </>
          )}
          <FullCoverImg alt="startPage_2" src={`${process.env.PUBLIC_URL}/img/startPage_2.jpg`}></FullCoverImg>
        </RelativeWrapper>
      </Slide>
    </FullPage>
  );
};

export default Start;

const StartMainText = styled.span`
  position: absolute;
  bottom: 20%;
  left: 10%;
  font-size: 122px;
  font-weight: 600;
  text-shadow: 10px 10px 10px rgba(0, 0, 0, 0.4);
  color: white;

  animation: ${Animation.smoothAppear} 1s;
  @media screen and (max-width: 720px) {
    font-size: 80px;
  }
`;
const StartSubTextWrapper = styled.span`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 20%;
  left: 10%;

  animation: ${Animation.smoothAppear} 1s;
`;
const StartSubText = styled.span`
  font-size: 48px;
  font-weight: 600;
  text-shadow: 10px 10px 10px rgba(0, 0, 0, 0.4);
  color: white;
  margin-bottom: 16px;
  @media screen and (max-width: 720px) {
    font-size: 32px;
  }
`;
const GoButton = styled.button`
  font-size: 32px;
  font-weight: 600;
  color: white;
  width: 200px;
  padding: 10px;
  margin-top: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid 5px white;
  /* border-radius: 16px; */
  cursor: pointer;
`;
