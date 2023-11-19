import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//mui
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import IsMobile from "../../functions/IsMobile";
import User from "../../functions/reactQuery/User";

const Header = () => {
  const isMobile = IsMobile();

  const [mountToggle, setMountToggle] = useState(false);
  const navigate = useNavigate();

  //useQuery
  const user = User.getData();

  const { type } = useParams();
  let currentPage = type ? parseInt(type) : -1;
  if (window.location.pathname.split("/")[1] === "profile") currentPage = 3;

  // console.log(window.visualViewport?.height);
  const handleScroll = async () => {
    const preY = window.scrollY;
    setTimeout(() => {
      // console.log("currentY : ", window.scrollY);
      // console.log("preY : ", preY);
      if (preY === window.scrollY) {
        // console.log("스크롤 멈춤");
      } else if (preY < window.scrollY) {
        // console.log("스크롤 내려가는 중");
        setMountToggle(false);
      } else {
        // console.log("스크롤 올라가는 중");
        setMountToggle(false);
      }
    }, 100);
  };
  useEffect(() => {
    window.addEventListener("scroll", () => handleScroll());
    return () => {
      window.removeEventListener("scroll", () => handleScroll());
    };
  }, []);

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
            <HeaderMenuButton
              onClick={() => {
                setMountToggle((c) => !c);
              }}
            >
              <MenuIcon fontSize="inherit" />
            </HeaderMenuButton>

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
              {/* <Link to="/main/0">GoodLock GodLock</Link> */}
              <Link to="/main/0">굿 락 갓 락</Link>
            </HeaderLogoMobile>

            <MyProfile onClick={() => navigate("/profile/0")}>
              <PersonIcon></PersonIcon>
              {/* {prevY} */}
            </MyProfile>
          </HeaderFixedWrapper>
          <HeaderExtendedWrapper currentPage={currentPage + 1}>
            <span onClick={() => setMountToggle(false)}>
              <Link to="/main/0">홈</Link>
            </span>
            <span onClick={() => setMountToggle(false)}>
              <Link to="/main/1">팁&설정</Link>
            </span>
            <span onClick={() => setMountToggle(false)}>
              <Link to="/main/2">소통</Link>
            </span>
          </HeaderExtendedWrapper>
          <HeaderMobileLand currentPage={currentPage + 1}>
            <span>
              <Link to="/main/0">홈</Link>
            </span>
            <span>
              <Link to="/main/1">팁&설정</Link>
            </span>
            <span>
              <Link to="/main/2">소통</Link>
            </span>
            <span>
              <Link to="/profile/0">내 정보</Link>
            </span>
          </HeaderMobileLand>
        </MobileHeaderWrapper>
      ) : (
        //pc header
        <PcHeaderWrapper mountToggle={mountToggle}>
          <Link to="/main/0">
            <HeaderLogo
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth"
                })
              }
            >
              굿 락 갓 락{/* GoodLock GodLock */}
            </HeaderLogo>
          </Link>

          {user && (
            <HeaderLink currentPage={currentPage + 1}>
              <span>
                <Link to="/main/0">홈</Link>
              </span>
              <span>
                <Link to="/main/1">팁&설정</Link>
              </span>
              <span>
                <Link to="/main/2">소통</Link>
              </span>
            </HeaderLink>
          )}
        </PcHeaderWrapper>
      )}
    </>
  );
};

export default Header;

const MyProfile = styled.div`
  width: 15%;
  display: flex;
  justify-content: end;
  align-items: center;
  @media (orientation: landscape) and (max-height: 480px) {
    display: none;
  }
`;

const PcHeaderWrapper = styled.div<{ mountToggle: boolean }>`
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* padding: 24px; */
  font-size: 1.6em;
  /* font-weight: 600; */
  /* color: rgba(0, 0, 0, 0.34); */
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  width: 100%;
  height: 25vh;
`;

const MobileHeaderWrapper = styled.div<{ mountToggle: boolean }>`
  position: fixed;
  z-index: 999;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;

  padding: 4px 12px;
  height: auto;
  width: 100vw;

  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);

  background-color: #c8daf3;
  background-color: ${(props) => props.mountToggle && " #e3ecf9"};
  box-shadow: ${(props) => props.mountToggle && "0px 3px 3px rgba(0, 0, 0, 0.2)"};
  /* background-color: ${(props) => props.mountToggle && "rgba(0,0,0,0)"};
  backdrop-filter: ${(props) => props.mountToggle && "blur(12px)"}; */

  transition: 0.2s all ease-in-out;

  > div:nth-child(2) {
    span {
      transition: all ease-in-out 0.3s;
      font-size: 0px;
      padding: 0px;
      opacity: 0;
      opacity: ${(props) => props.mountToggle && "1"};
      font-size: ${(props) => props.mountToggle && "20px"};
      padding: ${(props) => props.mountToggle && "8px"};
      &:first-child {
        padding-top: ${(props) => props.mountToggle && "16px"};
      }
      &:last-child {
        padding-bottom: ${(props) => props.mountToggle && "16px"};
      }
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    position: fixed;
    z-index: 999;
    top: 0px;

    background-color: #e3ecf9;

    width: 20vw;
    height: 100vh;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
  }
`;

const HeaderFixedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media (orientation: landscape) and (max-height: 480px) {
    margin-top: 32px;
    justify-content: center;
  }
`;

const HeaderMenuButton = styled.button`
  display: flex;
  justify-content: start;
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
  font-size: 29px;
  width: 15%;
  @media (orientation: landscape) and (max-height: 480px) {
    display: none;
  }
`;
const HeaderMobileLand = styled.div<{ currentPage: number | undefined }>`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 70vh;

  span:nth-child(${(props) => props.currentPage}) {
    color: rgba(0, 0, 0, 0.55);
    font-weight: 600;
  }
  span {
    font-weight: 500;
    /* font-weight: 600; */
    margin: 8px;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    display: flex;
  }
`;
const HeaderExtendedWrapper = styled.div<{ currentPage: number | undefined }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  color: white;
  color: rgba(0, 0, 0, 0.4);
  width: 100%;

  span {
    font-weight: 500;
    /* font-weight: 600; */
  }

  span:nth-child(${(props) => props.currentPage}) {
    color: rgba(0, 0, 0, 0.55);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    display: none;
  }
`;

const HeaderLogo = styled.span`
  font-family: OAGothic-ExtraBold;

  text-align: center;
  /* color: white; */
  color: rgba(0, 0, 0, 0.7);
  /* font-size: 30px; */
  font-size: 42px;
  font-weight: 600;
  /* letter-spacing: 12px; */
  /* font-weight: 600; */
`;

const HeaderLogoMobile = styled.span`
  font-family: OAGothic-ExtraBold;

  width: 70%;
  text-align: center;
  color: white;
  color: rgba(0, 0, 0, 0.6);

  font-size: 24px;
  font-weight: 600;
  @media (orientation: landscape) and (max-height: 480px) {
    width: 100%;
  }
`;

const HeaderLink = styled.div<{ currentPage: number | undefined }>`
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.4);
  width: 100%;

  span {
    font-weight: 500;
    /* font-weight: 600; */
    white-space: nowrap;
    flex-shrink: 0;
    width: 35%;
    padding-bottom: 5px;
    transition: all ease-in-out 0.6s;
    text-align: center;
  }
  span:first-child,
  span:nth-child(3) {
    width: 25%;
  }
  span:nth-child(${(props) => props.currentPage}) {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
  }
`;
