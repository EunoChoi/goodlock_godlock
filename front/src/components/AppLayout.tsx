import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import styled from "styled-components/macro";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

//mui
import PostAddIcon from "@mui/icons-material/PostAdd";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MenuIcon from "@mui/icons-material/Menu";

//component
import InputPopup from "./common/PostInputPopup";
import Side from "./Side";
import Animation from "../styles/Animation";
import IsMobile from "../functions/IsMobile";
import User from "../functions/reactQuery/User";
import Bot from "./chatbot/Bot";

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

  //공지사항 작성 가능 레벨
  const level = 10;

  //useQuery
  const user = User.getData();
  const isUserPostOk: boolean = postType !== undefined && postType !== 0 && postType !== 3;
  const isAdminPostOk: boolean = postType === 0 && user.level >= level ? true : false;

  const modalClose = () => {
    history.back();
    setPostInputOpen(false);
  };
  const sideclose = () => {
    setMobileSideOpen(false);
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
    if (isPostInputOpen || mobileSideOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isPostInputOpen, mobileSideOpen]);

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
          isAdminPostOk && (
            <button color="inherit" onClick={() => InputEditOpenCloseToggle()}>
              <PostAddIcon fontSize="medium" />
            </button>
          )
        }
        {isUserPostOk && (
          <button color="inherit" onClick={() => InputEditOpenCloseToggle()}>
            <PostAddIcon fontSize="medium" />
          </button>
        )}
        {isMobile && (
          <button
            id="menuButton"
            color="inherit"
            onClick={() => {
              setMobileSideOpen((c) => !c);
            }}
          >
            <MenuIcon fontSize="medium" />
          </button>
        )}
      </ButtonWrapper>

      {isMobile ? (
        <MobileWrapper>
          {mobileSideOpen && (
            <MobileSideBG
              onClick={() => {
                setMobileSideOpen(false);
              }}
            >
              <MobileSide onClick={(e) => e.stopPropagation()}>
                <Side close={sideclose} />
              </MobileSide>
            </MobileSideBG>
          )}
          <Children>{children}</Children>
          <Header />
        </MobileWrapper>
      ) : (
        <PcWrapper>
          <LeftWrapper>
            <Side close={sideclose} />
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

const MobileSideBG = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  z-index: 2000;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const MobileSide = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  z-index: 2002;

  width: 80vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  animation: ${Animation.smoothAppearLeftToRight} 0.4s ease-out;
`;

const BotWrapper = styled.div`
  .rsc-float-button {
    width: 48px;
    height: 48px;
    background-color: #f3e0f1 !important;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    border: solid 2px rgba(0, 0, 0, 0.05);
  }
  .rsc-container {
    /* height: auto; */
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
  bottom: calc(32px + 48px + 12px);
  right: 32px;
  #menuButton {
    @media (orientation: landscape) and (max-height: 480px) {
      display: none;
    }
  }
  > button {
    &:hover {
      background-color: #c7d7ff;
    }
    width: 48px;
    height: 48px;

    padding: 0px;
    margin-top: 12px;
    border-radius: 100px;

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

  z-index: 100;
`;
const RightWrapper = styled.div`
  margin-left: 280px;
  width: calc(100vw - 280px);

  flex-grow: 1;
  -webkit-box-flex: 1;
`;
