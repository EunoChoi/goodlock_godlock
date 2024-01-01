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
import ForumIcon from "@mui/icons-material/Forum";

const Header = () => {
  const { type } = useParams();
  let currentPage = type ? parseInt(type) : -1;
  if (window.location.pathname.split("/")[1] === "profile") currentPage = 4;

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
        <ExtensionIcon fontSize="inherit" />
        <Link to="/main/0">
          <span>God Lock</span>
        </Link>
      </HeaderLogoMobile>

      <HeaderLocation>
        {currentPage === 0 && <HomeRoundedIcon fontSize="inherit" />}
        {currentPage === 1 && <LightbulbRoundedIcon fontSize="inherit" />}
        {currentPage === 2 && <ForumIcon fontSize="inherit" />}
        {currentPage === 3 && <PhotoRoundedIcon fontSize="inherit" />}
        {currentPage === 4 && <PersonRoundedIcon fontSize="inherit" />}
      </HeaderLocation>

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
          <LinkCenter to="/main/4/cat/0">
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

const MobileHeaderWrapper = styled.div`
  position: fixed;
  z-index: 999;
  top: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 48px;
  width: 100vw;
  padding: 0 4vw;

  background-color: #fff;

  @media (orientation: portrait) and (max-width: 480px) {
    /* background-color: white; */
  }

  @media (orientation: landscape) and (max-height: 480px) {
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding: 0;

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
  font-size: 18px;

  color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 70vh;

  padding-left: 8px;

  span:nth-child(${(props) => props.currentPage}) {
    color: rgba(0, 0, 0, 0.55);
    color: #d5a8d0;
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

const HeaderLocation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  color: #d5a8d0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 22px;
  font-weight: 600;

  @media (orientation: landscape) and (max-height: 480px) {
    display: none;
  }
`;
const HeaderLogoMobile = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d5a8d0;
  span {
    margin-left: 4px;
    font-family: OAGothic-ExtraBold;
    color: rgba(0, 0, 0, 0.7);

    font-size: 20px;
    font-weight: 600;
  }

  @media (orientation: landscape) and (max-height: 480px) {
    margin-left: 0;
  }
`;
