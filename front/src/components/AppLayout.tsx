import React, { useCallback, useEffect, useState } from "react";
import Header from "./common/Header";
import styled from "styled-components/macro";
import { useParams } from "react-router-dom";
import Animation from "../styles/Animation";

//mui
import PostAddIcon from "@mui/icons-material/PostAdd";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MenuIcon from "@mui/icons-material/Menu";

//component
import InputPopup from "./common/PostInputPopup";
import PCSide from "./PCSide";
import IsMobile from "../functions/IsMobile";
import User from "../functions/reactQuery/User";
import Bot from "./chatbot/Bot";
import MobileSide from "./MobileSide";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = IsMobile();

  const [isPostInputOpen, setPostInputOpen] = useState(false);
  const params = useParams();
  const postType = params?.type && parseInt(params?.type);
  const [goTopButton, setGoTopButton] = useState<boolean>(false);

  const [mobileSideOpen, setMobileSideOpen] = useState<boolean>(false);
  const [mobileButtonVisible, setMobileButtonVisible] = useState<boolean>(false);

  //공지사항 작성 가능 레벨
  const level = 10;

  //useQuery
  const user = User.get().data;
  const isUserPostOk: boolean = postType === 1 || postType === 2;
  const isAdminPostOk: boolean = postType === 0 && user?.level >= level ? true : false;

  const sideOpen = () => {
    history.pushState({ page: "modal" }, "", "");
    setMobileSideOpen(true);
  };
  const InputEditOpen = () => {
    history.pushState({ page: "modal" }, "", "");
    setPostInputOpen(true);
  };
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const handleScroll = async () => {
      if (window.scrollY > 48) {
        setMobileButtonVisible(true);
      } else {
        setMobileButtonVisible(false);
      }
      if (window.scrollY > 2000) {
        setGoTopButton(true);
      } else {
        setGoTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isPostInputOpen || mobileSideOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isPostInputOpen, mobileSideOpen]);

  return (
    <>
      {isPostInputOpen && <InputPopup setPostInputOpen={setPostInputOpen} />}

      {isMobile ? (
        <MobileWrapper>
          {mobileSideOpen && <MobileSide setMobileSideOpen={setMobileSideOpen} />}

          {mobileButtonVisible && (
            <BotWrapper>
              <Bot />
            </BotWrapper>
          )}

          <ButtonWrapper isPostInputOpen={isPostInputOpen}>
            {goTopButton && (
              <button id="mobileTop" color="inherit" onClick={() => scrollTop()}>
                <ArrowUpwardIcon fontSize="medium" />
              </button>
            )}
            {
              //user level이 10이상이여야 공지사항 작성이 가능
              mobileButtonVisible && isAdminPostOk && (
                <button id="mobileAddPost" color="inherit" onClick={() => InputEditOpen()}>
                  <PostAddIcon fontSize="medium" />
                </button>
              )
            }
            {mobileButtonVisible && isUserPostOk && (
              <button id="mobileAddPost" color="inherit" onClick={() => InputEditOpen()}>
                <PostAddIcon fontSize="medium" />
              </button>
            )}
            {isMobile && (
              <button
                id="menuButton"
                color="inherit"
                onClick={() => {
                  sideOpen();
                }}
              >
                <MenuIcon fontSize="medium" />
              </button>
            )}
          </ButtonWrapper>

          <Children>{children}</Children>
          <Header />
        </MobileWrapper>
      ) : (
        <PcWrapper>
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
              isAdminPostOk && (
                <button color="inherit" onClick={() => InputEditOpen()}>
                  <PostAddIcon fontSize="medium" />
                </button>
              )
            }
            {isUserPostOk && (
              <button color="inherit" onClick={() => InputEditOpen()}>
                <PostAddIcon fontSize="medium" />
              </button>
            )}
            {isMobile && (
              <button
                id="menuButton"
                color="inherit"
                onClick={() => {
                  sideOpen();
                }}
              >
                <MenuIcon fontSize="medium" />
              </button>
            )}
          </ButtonWrapper>
          <LeftWrapper>
            <PCSide />
          </LeftWrapper>
          <RightWrapper>
            <Children id="scrollWrapper">{children}</Children>
          </RightWrapper>
        </PcWrapper>
      )}
    </>
  );
};

export default AppLayout;

const BotWrapper = styled.div`
  .rsc-header-close-button {
    display: none !important;
  }
  .rsc-float-button {
    animation: ${Animation.smoothAppear} 0.3s ease-in-out;

    width: 48px;
    height: 48px;

    background-color: #f3e0f1 !important;

    transition: 0.3s ease-in-out all;

    @media (orientation: portrait) {
      right: 18px;
      bottom: calc(24px + 48px + 6px);
    }
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: #c7d7ff !important;
      }
    }

    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    border: solid 2px rgba(0, 0, 0, 0.05);
  }
  .rsc-container {
    @media (orientation: landscape) and (max-height: 480px) {
      height: 320px;
    }
    @media (orientation: portrait) and (max-width: 480px) {
      top: 0 !important;
      bottom: auto;
    }
  }
  .rsc-content {
    @media (orientation: landscape) and (max-height: 480px) {
      height: calc(320px - 56px - 56px);
    }
  }
  .rsc-footer {
    /*  */
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
  bottom: calc(32px + 48px + 12px);
  right: 32px;
  @media (orientation: portrait) {
    right: 18px;
    bottom: calc(24px);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    bottom: calc(36px);
  }
  #mobileTop {
    /* margin-bottom: calc(48px + 6px); */
  }
  #mobileAddPost {
    margin-bottom: calc(48px + 6px);
  }
  #menuButton {
    @media (orientation: landscape) and (max-height: 480px) {
      display: none;
    }
  }
  > button {
    animation: ${Animation.smoothAppear} 0.3s ease-in-out;
    transition: 0.3s ease-in-out all;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: #c7d7ff;
      }
    }

    width: 48px;
    height: 48px;

    padding: 0px;
    margin-top: 12px;
    border-radius: 100px;

    @media (orientation: portrait) and (max-width: 480px) {
      margin-top: 6px;
    }

    color: rgba(0, 0, 0, 0.6);
    /* box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2); */
    border: solid 2px rgba(0, 0, 0, 0.05);

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
  background-color: white;

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
  top: 0;
  left: 0;

  width: 280px;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  z-index: 4000;
`;
const RightWrapper = styled.div`
  margin-left: 280px;
  width: calc(100vw - 280px);

  flex-grow: 1;
  -webkit-box-flex: 1;
`;
