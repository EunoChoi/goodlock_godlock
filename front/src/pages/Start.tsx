import React, { useState } from "react";
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

  const text = ["사랑이 부족한 이 시대 \n 공감과 위로가 전해지기를", "소개 멘트 2", "소개 멘트 3"];

  return (
    <>
      <BG alt="startPage_2" src={`${process.env.PUBLIC_URL}/img/startPage_4.jpg`}></BG>
      {!popupOpen && (
        <StartWrapper>
          <Title>narang</Title>
          <CarouselWrapper>
            <Carousel indicators={true} autoPlay={true} animation="slide">
              {text.map((v, i) => (
                <TextBox key={v + i}>
                  <span>
                    {i === 0 && <FavoriteIcon fontSize="large" />}
                    {i === 1 && <EscalatorWarningIcon fontSize="large" />}
                    {i === 2 && <MenuBookIcon fontSize="large" />}
                  </span>
                  <span>{v}</span>
                </TextBox>
              ))}
            </Carousel>
          </CarouselWrapper>

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
        </StartWrapper>
      )}
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
  width: 100%;
  height: 170px;

  font-size: 28px;
  font-weight: 400;
  white-space: pre-line;
  color: white;
  text-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  > span {
    line-height: 32px;
  }
  > span:nth-child(2) {
    margin-top: 32px;
  }

  @media screen and (max-width: 720px) {
    font-size: 24px;
  }
`;
const CarouselWrapper = styled.div`
  width: 100%;
  height: 200px;
`;
const Title = styled.span`
  font-size: 48px;
  font-weight: 600;
  text-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
  color: white;
  text-transform: uppercase;
`;

const BG = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  filter: brightness(0.75);
`;

const StartWrapper = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;

  width: 80%;
  height: 60%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  animation: ${Animation.smoothAppear} 1s;
`;

const StartButton = styled.button`
  font-size: 32px;
  font-weight: 600;
  color: white;
  width: 200px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(2px);

  border: solid 5px white;
  cursor: pointer;
`;
