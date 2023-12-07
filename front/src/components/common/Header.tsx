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

const Header = () => {
  const [mountToggle, setMountToggle] = useState(false);

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
    <>
      <MobileHeaderWrapper mountToggle={mountToggle}>
        <HeaderLogoMobile
          onClick={() => {
            setMountToggle(false);
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth"
            });
          }}
        >
          {/* <Logo src="/img/loading.png"></Logo> */}
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
              <LightbulbRoundedIcon></LightbulbRoundedIcon>Tips
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
    </>
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

const MobileHeaderWrapper = styled.div<{ mountToggle: boolean }>`
  position: fixed;
  z-index: 999;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 48px;
  width: 100vw;

  /* padding-left: 4vw; */
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);

  background-color: #fff;
  background-color: #c8daf3;

  @media (orientation: landscape) and (max-height: 480px) {
    position: fixed;
    z-index: 999;
    top: 0px;

    align-items: center;

    background-color: #e3ecf9;

    width: 20vw;
    height: 100vh;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
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

  padding-left: 10px;

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

  color: rgba(0, 0, 0, 0.6);

  font-size: 24px;
  font-weight: 600;
`;
