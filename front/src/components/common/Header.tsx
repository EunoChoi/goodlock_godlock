import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

//mui
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExtensionIcon from "@mui/icons-material/Extension";

const Header = () => {
  const { type } = useParams();
  let currentPage = type ? parseInt(type) : -1;
  if (window.location.pathname.split("/")[1] === "profile") currentPage = 4;

  // const handleScroll = async () => {
  //   const preY = window.scrollY;
  //   setTimeout(() => {
  //     // console.log("currentY : ", window.scrollY);
  //     // console.log("preY : ", preY);
  //     if (preY === window.scrollY) {
  //       // console.log("스크롤 멈춤");
  //     } else if (preY < window.scrollY) {
  //       // console.log("스크롤 내려가는 중");
  //       setMountToggle(false);
  //     } else {
  //       // console.log("스크롤 올라가는 중");
  //       setMountToggle(false);
  //     }
  //   }, 100);
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", () => handleScroll());
  //   return () => {
  //     window.removeEventListener("scroll", () => handleScroll());
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!isMobile) {
  //     setMountToggle(false);
  //   }
  // }, [isMobile]);

  return (
    <MobileHeaderWrapper>
      <HeaderLogoMobile
        onClick={() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        }}
      >
        <ExtensionIcon style={{ color: "#D5A8D0", fontSize: "28px", marginRight: "4px" }}></ExtensionIcon>
        <Link to="/main/0">God Lock</Link>
      </HeaderLogoMobile>

      <HeaderMobileLand currentPage={currentPage + 1}>
        <span>
          <LinkCenter to="/main/0">
            <HomeRoundedIcon></HomeRoundedIcon>Home
          </LinkCenter>
        </span>
        <span>
          <LinkCenter to="/main/1">
            <LightbulbRoundedIcon></LightbulbRoundedIcon>Tip Post
          </LinkCenter>
        </span>
        <span>
          <LinkCenter to="/main/2">
            <PeopleRoundedIcon></PeopleRoundedIcon>Free Board
          </LinkCenter>
        </span>
        <span>
          <LinkCenter to="/main/3">
            <PhotoRoundedIcon></PhotoRoundedIcon>Gallery
          </LinkCenter>
        </span>
        <span>
          <LinkCenter to="/profile/0">
            <PersonRoundedIcon></PersonRoundedIcon>Profile
          </LinkCenter>
        </span>
      </HeaderMobileLand>
    </MobileHeaderWrapper>
  );
};

export default Header;

const LinkCenter = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    margin-right: 8px;
  }
`;

const Logo = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;

  margin-right: 8px;

  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const MobileHeaderWrapper = styled.div`
  position: fixed;
  z-index: 999;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  height: 48px;
  width: 100vw;

  background-color: #fff;
  background-color: #c8daf3;

  @media (orientation: portrait) and (max-width: 480px) {
    background-color: white;
  }

  @media (orientation: landscape) and (max-height: 480px) {
    position: fixed;
    z-index: 999;
    top: 0px;
    > span {
      font-size: 20px !important;
    }

    align-items: center;

    background-color: #e3ecf9;
    background-color: whitesmoke;
    border-right: 2px solid rgba(0, 0, 0, 0.05);

    width: 20vw;
    height: 100vh;
    /* box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2); */
  }
`;

const HeaderMobileLand = styled.div<{ currentPage: number | undefined }>`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  font-size: 20px;

  color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 70vh;

  padding-left: 8px;

  span:nth-child(${(props) => props.currentPage}) {
    color: rgba(0, 0, 0, 0.55);
    font-weight: 600;
  }
  span {
    font-weight: 500;
    margin: 8px;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    display: flex;
  }
`;

const HeaderLogoMobile = styled.span`
  font-family: OAGothic-ExtraBold;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: 4vw;

  color: rgba(0, 0, 0, 0.7);

  font-size: 24px;
  font-weight: 600;

  @media (orientation: landscape) and (max-height: 480px) {
    margin-left: 0;
  }
`;
