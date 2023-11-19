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

//component
import UserProfile from "./common/UserProfile";
import InputPopup from "./common/PostInputPopup";

import Animation from "../styles/Animation";
import IsMobile from "../functions/IsMobile";
import User from "../functions/reactQuery/User";

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
  const level = 2;

  //useQuery
  const user = User.getData();
  const logout = User.logout();

  const handleScroll = async () => {
    // console.log(window.scrollY);
    if (window.scrollY > 2000) {
      setGoTopButton(true);
    } else {
      setGoTopButton(false);
    }
  };

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
      {isPostInputOpen && <InputPopup setIsPostInputOpen={setPostInputOpen} />}
      {isMobile ? (
        <MobileWrapper>
          <Header />
          <Children>{children}</Children>

          <MobileButtonWrapper isPostInputOpen={isPostInputOpen}>
            {goTopButton && (
              <button
                color="inherit"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                  })
                }
              >
                <ArrowUpwardIcon fontSize="medium" />
              </button>
            )}
            {
              //user level이 2이상이여야 공지사항 작성이 가능
              isMain && type == 0 && user?.level >= level && (
                <button
                  color="inherit"
                  onClick={() => {
                    if (isPostInputOpen === false) {
                      setPostInputOpen((c) => !c);
                    } else {
                      confirmAlert({
                        // title: "",
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
                  }}
                >
                  <PostAddIcon fontSize="medium" />
                </button>
              )
            }
            {
              //user level이 2미만일때 공지 외 게시글 작성 가능
              isMain && type != 0 && (
                <button
                  color="inherit"
                  onClick={() => {
                    if (isPostInputOpen === false) {
                      setPostInputOpen((c) => !c);
                    } else {
                      confirmAlert({
                        // title: "",
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
                  }}
                >
                  <PostAddIcon fontSize="medium" />
                </button>
              )
            }
          </MobileButtonWrapper>
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
          <SideWrapper>
            <div>
              {user && (
                <>
                  <Button color="inherit">
                    <Link to="/profile/0">
                      <PersonIcon fontSize="large" />
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
                            label: "취소",
                            onClick: () => console.log("로그아웃 취소")
                          },
                          {
                            label: "확인",
                            onClick: () => logout.mutate()
                          }
                        ],
                        keyCodeForClose: [8, 32]
                      });
                    }}
                  >
                    <LogoutIcon fontSize="large" />
                  </Button>
                </>
              )}
            </div>

            <div>
              <Button
                color="inherit"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                  });
                }}
              >
                <ArrowUpwardIcon fontSize="large" />
              </Button>

              {
                //user level이 2이상이여야 공지사항 작성이 가능
                isMain && type == 0 && user?.level >= level && (
                  <Button
                    color="inherit"
                    onClick={() => {
                      if (isPostInputOpen === false) {
                        setPostInputOpen((c) => !c);
                      } else {
                        confirmAlert({
                          // title: "",
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
                    }}
                  >
                    <PostAddIcon fontSize="large" />
                  </Button>
                )
              }
              {
                //user level이 2미만일때 공지 외 게시글 작성 가능
                isMain && type != 0 && (
                  <Button
                    color="inherit"
                    onClick={() => {
                      if (isPostInputOpen === false) {
                        setPostInputOpen((c) => !c);
                      } else {
                        confirmAlert({
                          // title: "",
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
                    }}
                  >
                    <PostAddIcon fontSize="large" />
                  </Button>
                )
              }
            </div>
          </SideWrapper>
        </PcWrapper>
      )}
    </>
  );
};

export default AppLayout;

const MobileButtonWrapper = styled.div<{ isPostInputOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;

  z-index: 1001;
  position: fixed;
  bottom: 20px;
  right: 20px;

  > button {
    width: 50px;
    height: 50px;

    padding: 0px;
    margin: 5px;
    border-radius: 100px;

    color: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
    /* background-color: #d5dbf0; */
    background-color: #f3e0f1;
  }
  > button:nth-child(1) {
    display: ${(props) => props.isPostInputOpen && "none"};
  }
  > button:nth-child(2) {
    display: flex;
    justify-content: center;
    align-items: center;
    display: ${(props) => props.isPostInputOpen && "none"};
  }
  > button:nth-child(3) {
    display: ${(props) => props.isPostInputOpen && "none"};
    * {
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
  margin-right: 70px;

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
