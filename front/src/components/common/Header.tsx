import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Animation from "../../styles/Animation";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Axios from "../../apis/Axios";

import { useRef } from "react";

//mui
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const isMobile = useMediaQuery({ maxWidth: 720 });
  const [mountToggle, setMountToggle] = useState(false);

  const { type } = useParams();
  let currentPage = type ? parseInt(type) : -1;
  if (window.location.pathname.split("/")[1] === "profile") currentPage = 3;

  useEffect(() => {
    if (!isMobile) {
      setMountToggle(false);
    }
  }, [isMobile]);

  return (
    <>
      {isMobile ? (
        //mobile header
        <MobileHeaderWrapper mountToggle={mountToggle}>
          <HeaderFixedWrapper>
            <RowDiv>
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
                <Link to="/main/0">NARANG</Link>
              </HeaderLogoMobile>
              <HeaderMenuButton
                onClick={() => {
                  setMountToggle((c) => !c);
                }}
              >
                <MenuIcon fontSize="large" />
              </HeaderMenuButton>
            </RowDiv>
          </HeaderFixedWrapper>
          {mountToggle && (
            <HeaderExtendedWrapper currentPage={currentPage + 1}>
              <span onClick={() => setMountToggle(false)}>
                <Link to="/main/0">메인</Link>
              </span>
              <span onClick={() => setMountToggle(false)}>
                <Link to="/main/1">모집공고</Link>
              </span>
              <span onClick={() => setMountToggle(false)}>
                <Link to="/main/2">소통</Link>
              </span>
              <span onClick={() => setMountToggle(false)}>
                <Link to="/profile/0">프로필</Link>
              </span>
            </HeaderExtendedWrapper>
          )}
        </MobileHeaderWrapper>
      ) : (
        //pc header
        <PcHeaderWrapper mountToggle={mountToggle}>
          <Link to="/main/0">
            <HeaderLogo>NARANG</HeaderLogo>
          </Link>

          <HeaderLink currentPage={currentPage + 1}>
            <span>
              <Link to="/main/0">메인</Link>
            </span>
            <span>
              <Link to="/main/1">모집공고</Link>
            </span>
            <span>
              <Link to="/main/2">소통</Link>
            </span>
          </HeaderLink>
        </PcHeaderWrapper>
      )}
    </>
  );
};

export default Header;

const RowDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const PcHeaderWrapper = styled.div<{ mountToggle: boolean }>`
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 24px;
  font-size: 1.6em;
  /* font-weight: 600; */
  /* color: rgba(0, 0, 0, 0.34); */
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  width: 100%;
  height: 200px;
`;

const MobileHeaderWrapper = styled.div<{ mountToggle: boolean }>`
  position: fixed;
  z-index: 999;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  padding: 4px 16px;

  height: auto;
  width: 100vw;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);

  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  background-color: ${(props) => props.mountToggle && "rgba(255, 255, 255, 0.6)"};
  box-shadow: ${(props) => props.mountToggle && "0px 5px 5px rgba(0, 0, 0, 0.2)"};
  backdrop-filter: ${(props) => props.mountToggle && "blur(20px)"};

  transition: 0.2s all ease-in-out;
`;

const HeaderFixedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const HeaderMenuButton = styled.button`
  color: white;
  color: rgba(0, 0, 0, 0.6);
`;
const HeaderExtendedWrapper = styled.div<{ currentPage: number | undefined }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  * {
    padding: 7px;
  }
  font-size: 20px;
  /* font-weight: 600; */
  color: white;
  color: rgba(0, 0, 0, 0.4);
  width: 100%;

  span:nth-child(${(props) => props.currentPage}) {
    /* color: #a09ce0; */
    color: rgba(0, 0, 0, 0.55);
  }
`;

const HeaderLogo = styled.span`
  text-align: center;
  /* color: white; */
  color: rgba(0, 0, 0, 0.8);
  font-size: 48px;
  /* font-weight: 600; */
`;

const HeaderLogoMobile = styled.span`
  width: auto;
  color: white;
  color: rgba(0, 0, 0, 0.6);

  font-size: 28px;
  /* font-weight: 600; */
`;

const HeaderLink = styled.div<{ currentPage: number | undefined }>`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.5);

  * {
    margin: 5px;
    flex-shrink: 0;
  }
  span {
    padding-bottom: 5px;
    transition: all ease-in-out 0.6s;
  }
  span:nth-child(${(props) => props.currentPage}) {
    color: rgba(0, 0, 0, 0.7);
    /* font-weight: 800; */
  }
`;
