import React, { useState } from "react";
import Header from "./common/Header";
import styled from "styled-components/macro";
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

  const level = 1;

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
                isMain && type == 0 && user?.level >= level && (
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
                isMain && type == 0 && user?.level >= level && (
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

    color: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
    background-color: #d5dbf0;
  }
  button:first-child {
    background-color: #d5dbf0;
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
  * {
    flex-shrink: 0;
  }
`;

const MobileWrapper = styled.div`
  background: rgb(246, 214, 229);
  background: linear-gradient(0deg, rgba(246, 214, 229, 1) 0%, rgba(202, 221, 244, 1) 100%);
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
  max-width: 400px;
  height: 100vh;

  background: rgb(246, 214, 229);
  background: linear-gradient(0deg, rgba(246, 214, 229, 1) 0%, rgba(202, 221, 244, 1) 100%);
  padding-bottom: 50px;

  box-shadow: 3px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;
const RightWrapper = styled.div`
  margin-left: 400px;

  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.02);

  /* @media screen and (max-width: 720px) {
    position: static;
  } */
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
