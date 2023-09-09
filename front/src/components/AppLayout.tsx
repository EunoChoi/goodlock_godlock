import React, { useState } from "react";
import Header from "./common/Header";
import styled from "styled-components";
import Axios from "../apis/Axios";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useMediaQuery } from "react-responsive";
import { useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

//mui
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

//component
import UserProfile from "./common/UserProfile";
import InputPopup from "./common/PostInputPopup";

interface AppLayoutProps {
  children: React.ReactNode;
}
interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery({ maxWidth: 720 });
  const [isPostInputOpen, setPostInputOpen] = useState(false);
  const params = useParams();
  const type = params?.type && parseInt(params?.type);
  const isMain = window.location.pathname.split("/")[1] === "main";

  //useQuery
  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  const logout = useMutation(() => Axios.get("user/logout"), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const [top, setTop] = useState<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      setTop(el?.scrollTop ? el?.scrollTop : 0);
    };
    const element = scrollRef.current;
    element?.addEventListener("scroll", handleScroll);
    return () => {
      element?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      {isPostInputOpen && <InputPopup scrollRef={scrollRef} setIsPostInputOpen={setPostInputOpen} />}
      {isMobile ? (
        <MobileWrapper>
          <Header top={top} />
          <Children id="scrollWrapper" ref={scrollRef}>
            {children}
          </Children>
          {isMain && (
            <MobileButtonWrapper>
              <button
                color="inherit"
                onClick={() =>
                  scrollRef.current?.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                  })
                }
              >
                <ArrowUpwardIcon fontSize="medium" />
              </button>
              {
                //user level이 2이상이여야 공지사항 작성이 가능
                isMain && type == 0 && user?.level >= 2 && (
                  <button color="inherit" onClick={() => setPostInputOpen((c) => !c)}>
                    <PostAddIcon fontSize="medium" />
                  </button>
                )
              }
              {
                //user level이 2미만일때 공지 외 게시글 작성 가능
                isMain && type != 0 && (
                  <button color="inherit" onClick={() => setPostInputOpen((c) => !c)}>
                    <PostAddIcon fontSize="medium" />
                  </button>
                )
              }
            </MobileButtonWrapper>
          )}
        </MobileWrapper>
      ) : (
        <PcWrapper>
          <LeftWrapper>
            <Header top={top} />
            <UserProfile />
          </LeftWrapper>
          <RightWrapper>
            <Children id="scrollWrapper" ref={scrollRef}>
              {children}
            </Children>
          </RightWrapper>
          <SideWrapper>
            <TopButtons>
              <Button color="inherit">
                <Link to="/profile/0">
                  <SettingsIcon fontSize="large" />
                </Link>
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  confirmAlert({
                    // title: "",
                    message: "로그아웃 하시겠습니까?",
                    buttons: [
                      {
                        label: "확인",
                        onClick: () => logout.mutate()
                      },
                      {
                        label: "취소",
                        onClick: () => console.log("로그아웃 취소")
                      }
                    ],
                    keyCodeForClose: [8, 32]
                  });
                }}
              >
                <LogoutIcon fontSize="large" />
              </Button>
            </TopButtons>

            <BottomButtons>
              {isMain && (
                <Button
                  color="inherit"
                  onClick={() => {
                    scrollRef.current?.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth"
                    });
                  }}
                >
                  <ArrowUpwardIcon fontSize="large" />
                </Button>
              )}
              {
                //user level이 2이상이여야 공지사항 작성이 가능
                isMain && type == 0 && user?.level >= 2 && (
                  <Button color="inherit" onClick={() => setPostInputOpen((c) => !c)}>
                    <PostAddIcon fontSize="large" />
                  </Button>
                )
              }
              {
                //user level이 2미만일때 공지 외 게시글 작성 가능
                isMain && type != 0 && (
                  <Button color="inherit" onClick={() => setPostInputOpen((c) => !c)}>
                    <PostAddIcon fontSize="large" />
                  </Button>
                )
              }
            </BottomButtons>
          </SideWrapper>
        </PcWrapper>
      )}
    </>
  );
};

export default AppLayout;

const TopButtons = styled.div``;
const BottomButtons = styled.div``;

const MobileButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 999;
  position: fixed;
  bottom: 20px;
  right: 20px;

  button {
    width: 50px;
    height: 50px;

    padding: 0px;
    margin: 5px;

    border-radius: 100px;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.4);
    background-color: #bebee7;
    color: white;
  }
  button:first-child {
    background-color: #e0abc2;
  }
`;

const Children = styled.div`
  height: 100vh;
  overflow: scroll;

  display: flex;
  flex-direction: column;
  align-items: center;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  * {
    flex-shrink: 0;
  }
  /* > div:last-child {
    margin-bottom: 120px;
  } */
  /* @media screen and (max-width: 720px) {
    > div:last-child {
      margin-bottom: 120px;
    }
  } */
`;

const MobileWrapper = styled.div`
  background: rgb(238, 174, 202);
  background: linear-gradient(
    180deg,
    rgba(238, 174, 202, 0.5087375160024947) 0%,
    rgba(148, 187, 233, 0.4975330342097777) 100%
  );
  height: 100vh;
  .scroll {
    overflow: hidden;
  }
`;
const PcWrapper = styled.div`
  display: flex;
`;

const LeftWrapper = styled.div`
  min-width: 350px;
  max-width: 400px;
  background: rgb(238, 174, 202);
  background: linear-gradient(
    180deg,
    rgba(238, 174, 202, 0.5087375160024947) 0%,
    rgba(148, 187, 233, 0.4975330342097777) 100%
  );
  padding-bottom: 50px;

  box-shadow: 3px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;
const RightWrapper = styled.div`
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.02);
`;

const SideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 70px;
  padding: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.25);
  /* background-color: #e0daec; */

  box-shadow: -3px 0px 10px rgba(0, 0, 0, 0.2);
`;
