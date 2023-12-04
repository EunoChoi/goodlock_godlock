import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import styled from "styled-components/macro";
import { Link, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

//mui
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

//component
import UserProfile from "./common/UserProfile";
import InputPopup from "./common/PostInputPopup";

import Animation from "../styles/Animation";
import IsMobile from "../functions/IsMobile";
import User from "../functions/reactQuery/User";
import Bot from "./common/Bot";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = IsMobile();

  const [isPostInputOpen, setPostInputOpen] = useState(false);
  const params = useParams();
  const type = params?.type && parseInt(params?.type);
  const isMain = window.location.pathname.split("/")[1] === "main";
  const [goTopButton, setGoTopButton] = useState<boolean>(false);

  //공지사항 작성 가능 레벨
  const level = 10;

  //useQuery
  const user = User.getData();

  const modalClose = () => {
    history.back();
    setPostInputOpen(false);
  };
  const handleScroll = async () => {
    if (window.scrollY > 2000) {
      setGoTopButton(true);
    } else {
      setGoTopButton(false);
    }
  };
  const InputEditOpenCloseToggle = () => {
    if (isPostInputOpen === false) {
      const url = document.URL + "/modal";
      history.pushState({ page: "modal" }, "", url);
      setPostInputOpen(true);
    } else {
      confirmAlert({
        message: "게시글 작성을 중단하시겠습니까?",
        buttons: [
          {
            label: "취소",
            onClick: () => console.log("취소")
          },
          {
            label: "확인",
            onClick: () => setPostInputOpen((c) => !c)
          }
        ]
      });
    }
  };
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  window.addEventListener("popstate", () => {
    setPostInputOpen(false);
  });

  useEffect(() => {
    window.addEventListener("scroll", () => handleScroll());
    return () => {
      window.removeEventListener("scroll", () => handleScroll());
    };
  }, []);

  useEffect(() => {
    if (isPostInputOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isPostInputOpen]);

  return (
    <>
      {isPostInputOpen && <InputPopup modalClose={modalClose} />}
      <BotWrapper>
        <Bot />
      </BotWrapper>
      <ButtonWrapper isPostInputOpen={isPostInputOpen}>
        {goTopButton && (
          <button color="inherit" onClick={() => scrollTop()}>
            <ArrowUpwardIcon fontSize="medium" />
          </button>
        )}
        {
          //user level이 10이상이여야 공지사항 작성이 가능
          isMain && type == 0 && user?.level >= level && (
            <button color="inherit" onClick={() => InputEditOpenCloseToggle()}>
              <PostAddIcon fontSize="medium" />
            </button>
          )
        }
        {isMain && type != 0 && (
          <button color="inherit" onClick={() => InputEditOpenCloseToggle()}>
            <PostAddIcon fontSize="medium" />
          </button>
        )}
        <button color="inherit">
          <Link to="/profile/0">
            <PersonIcon fontSize="large" />
          </Link>
        </button>
      </ButtonWrapper>
      {isMobile ? (
        <MobileWrapper>
          <Children>{children}</Children>
          <Header />
        </MobileWrapper>
      ) : (
        <PcWrapper>
          <LeftWrapper>
            <Header />
            <UserProfile />
          </LeftWrapper>
          <RightWrapper>
            <Children id="scrollWrapper">{children}</Children>
          </RightWrapper>
          {/* <SideWrapper>
            <div>
              {user && (
                <>
                  <Button color="inherit">
                    <Link to="/profile/0">
                      <PersonIcon fontSize="large" />
                    </Link>
                  </Button>
                  <Button color="inherit" onClick={() => logoutConfrim()}>
                    <LogoutIcon fontSize="large" />
                  </Button>
                </>
              )}
            </div>

            <div>
              <Button color="inherit" onClick={() => scrollTop()}>
                <ArrowUpwardIcon fontSize="large" />
              </Button>

              {
                //user level이 10이상이여야 공지사항 작성이 가능
                isMain && type == 0 && user?.level >= level && (
                  <Button color="inherit" onClick={() => InputEditOpenCloseToggle()}>
                    <PostAddIcon fontSize="large" />
                  </Button>
                )
              }
              {isMain && type != 0 && (
                <Button color="inherit" onClick={() => InputEditOpenCloseToggle()}>
                  <PostAddIcon fontSize="large" />
                </Button>
              )}

              <Button
                color="inherit"
                onClick={() => {
                  // setChatBotOpen((c) => !c);
                }}
              >
                <SmartToyIcon fontSize="large" />
              </Button>
            </div>
          </SideWrapper> */}
        </PcWrapper>
      )}
    </>
  );
};

export default AppLayout;

const BotPCWrapper = styled.div`
  z-index: 999;
  width: auto;
  height: auto;
  position: fixed;
  bottom: 20px;
  right: 90px;

  * {
    font-weight: 600 !important;
  }

  animation: ${Animation.smoothAppear} 0.3s;
`;

const BotWrapper = styled.div`
  .rsc-float-button {
    background-color: #f3e0f1 !important;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  }
  .rsc-container {
    /* height: auto; */
    @media (orientation: landscape) and (max-height: 480px) {
      height: 320px;
    }
  }
  .rsc-content {
    @media (orientation: landscape) and (max-height: 480px) {
      height: calc(320px - 56px - 56px);
    }
  }
  .rsc-footer {
    /* @media (orientation: landscape) and (max-height: 480px) {
      display: none;
    } */
  }
  * {
    z-index: 1000;
    font-weight: 600 !important;
  }
`;

const ButtonWrapper = styled.div<{ isPostInputOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;

  z-index: 999;
  position: fixed;
  bottom: calc(32px + 56px + 12px);
  right: 32px;

  > button {
    width: 56px;
    height: 56px;

    padding: 0px;
    margin-top: 12px;
    border-radius: 100px;

    color: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
    /* background-color: #d5dbf0; */
    background-color: #f3e0f1;
    /* background-color: #dfbadc; */
  }
  > button:nth-child(1) {
    display: flex;
    justify-content: center;
    align-items: center;
    display: ${(props) => props.isPostInputOpen && "none"};
  }
  > button:nth-child(2) {
    display: flex;
    justify-content: center;
    align-items: center;
    display: ${(props) => props.isPostInputOpen && "none"};
  }
  > button:nth-child(3) {
    display: flex;
    justify-content: center;
    align-items: center;
    display: ${(props) => props.isPostInputOpen && "none"};
  }
`;
const Children = styled.div`
  animation: ${Animation.smoothAppear} 0.7s;

  min-height: 100vh;

  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  @media (orientation: landscape) and (max-height: 480px) {
    padding-left: 20vw;
  }
`;

const MobileWrapper = styled.div`
  background-color: #c8daf3;

  height: auto;

  .scroll {
    overflow: hidden;
  }
`;
const PcWrapper = styled.div`
  display: flex;
`;

const LeftWrapper = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;

  /* min-width: 350px; */
  width: 400px;
  width: 30vw;
  height: 100vh;

  background: rgb(201, 220, 243);
  background: linear-gradient(180deg, rgba(201, 220, 243, 1) 0%, rgba(234, 216, 233, 1) 100%);

  padding-bottom: 50px;

  box-shadow: 3px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;
const RightWrapper = styled.div`
  margin-left: 30vw;
  /* margin-right: 70px; */

  flex-grow: 1;
  -webkit-box-flex: 1;
`;

const SideWrapper = styled.div`
  position: fixed;
  right: 0px;
  top: 0px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 70px;
  height: 100vh;
  padding: 20px;
  color: rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0.25);
  background-color: #bfbfbf;
  /* background-color: #e0daec; */

  box-shadow: -3px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;
