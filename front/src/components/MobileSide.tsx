import React, { useEffect, useState } from "react";
import User from "../functions/reactQuery/User";
import { useNavigate, useParams } from "react-router-dom";

import useAlert from "./common/Alert";
import SideBar from "../styles/SidaBar";
import { createPortal } from "react-dom";

//zustanc
import { useModalStack } from "../store/modalStack";

//mui
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import ExtensionIcon from "@mui/icons-material/Extension";
import ForumIcon from "@mui/icons-material/Forum";

interface Props {
  setMobileSideOpen: (b: boolean) => void;
}

const MobileSide = ({ setMobileSideOpen }: Props) => {
  const { push, pop, modalStack } = useModalStack();

  const user = User.getData();
  const navigate = useNavigate();
  const logout = User.logout();
  const [sideBarAnimation, setSideBarAnimation] = useState<"open" | "close" | "">("");

  const { type } = useParams();
  const currentPage = type ? parseInt(type) : -1;

  const { Alert: LogoutConfirm, openAlert: openLogoutConfirm } = useAlert();

  const makeK = (n: number | null) => {
    if (n === null) {
      return null;
    }
    if (n > 1000) {
      return (n / 1000).toFixed(1) + "k";
    }
    return n;
  };
  const makeShortNickname = (nick: string) => {
    if (nick?.length >= 11) return nick.slice(0, 10) + "...";
    else return nick;
  };
  const onClose = () => {
    setSideBarAnimation("close");
  };

  window.onpopstate = () => {
    if (modalStack[modalStack.length - 1] === "#sidebar") {
      onClose();
    }
  };

  useEffect(() => {
    push("#sidebar");
    setSideBarAnimation("open");

    return () => {
      pop();
    };
  }, []);

  return (
    <>
      {createPortal(<LogoutConfirm />, document.getElementById("modal_root") as HTMLElement)}
      {createPortal(
        <>
          <SideBar.BG
            animation={sideBarAnimation}
            onClick={() => {
              history.back();
            }}
            onTransitionEnd={(e) => {
              e.stopPropagation();
              if (sideBarAnimation === "close") {
                setMobileSideOpen(false);
              }
            }}
          ></SideBar.BG>
          <SideBar.MobileWrapper animation={sideBarAnimation}>
            <SideBar.HeaderWrapper>
              <button
                onClick={() => {
                  navigate("/main/0");
                  onClose();
                }}
              >
                <ExtensionIcon fontSize="inherit" />
                <span>God Lock</span>
              </button>
            </SideBar.HeaderWrapper>
            {user && (
              <>
                <SideBar.UserInfoWrapper>
                  <div
                    onClick={() => {
                      navigate("/main/4/cat/0");
                      onClose();
                    }}
                  >
                    {user.profilePic ? (
                      <SideBar.ProfilePic
                        crop={true}
                        src={user.profilePic}
                        altImg={`${user.profilePic.replace(/\/thumb\//, "/original/")}`}
                        alt="profilePic"
                      />
                    ) : (
                      <SideBar.ProfilePic crop={true} src="/img/defaultProfilePic.png" alt="profilePic" />
                    )}
                  </div>

                  <div
                    id="info_text_box"
                    onClick={() => {
                      navigate("/main/4/cat/0");
                      onClose();
                    }}
                  >
                    <span id="nickname">{makeShortNickname(user?.nickname)}</span>
                    <span id="email">{user?.email}</span>
                    <span id="usertext">{user?.usertext}</span>
                  </div>

                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" />}
                    spacing={1}
                    justifyContent="center"
                  >
                    <button
                      className="info_box"
                      onClick={() => {
                        navigate("/main/4/cat/3");
                        onClose();
                      }}
                    >
                      <span>{makeK(user?.Posts?.length)}</span>
                      <span>Posts</span>
                    </button>
                    <button
                      className="info_box"
                      onClick={() => {
                        navigate("/main/4/cat/1");
                        onClose();
                      }}
                    >
                      <span>{makeK(user?.Followings?.length)}</span>
                      <span>Followings</span>
                    </button>
                    <button
                      className="info_box"
                      onClick={() => {
                        navigate("/main/4/cat/2");
                        onClose();
                      }}
                    >
                      <span>{makeK(user?.Followers?.length)}</span>
                      <span>Followers</span>
                    </button>
                  </Stack>
                </SideBar.UserInfoWrapper>
                <SideBar.MenuWrapper currentPage={currentPage + 1}>
                  <Stack divider={<Divider orientation="horizontal" />} spacing={2} justifyContent="center">
                    <div id="buttons">
                      <button
                        onClick={() => {
                          navigate("/main/0");
                          onClose();
                        }}
                      >
                        <HomeRoundedIcon />
                        Home
                      </button>
                      <button
                        onClick={() => {
                          navigate("/main/1");
                          onClose();
                        }}
                      >
                        <LightbulbRoundedIcon />
                        Tip Board
                      </button>
                      <button
                        onClick={() => {
                          navigate("/main/2");
                          onClose();
                        }}
                      >
                        <ForumIcon />
                        Free Board
                      </button>
                      <button
                        onClick={() => {
                          navigate("/main/3");
                          onClose();
                        }}
                      >
                        <PhotoRoundedIcon />
                        Gallery
                      </button>
                      <button
                        onClick={() => {
                          navigate("/main/4/cat/0");
                          onClose();
                        }}
                      >
                        <PersonRoundedIcon />
                        Profile
                      </button>
                    </div>
                    <div>
                      <button
                        id="logout"
                        onClick={() => {
                          openLogoutConfirm({
                            mainText: "로그아웃 하시겠습니까?",
                            onSuccess: () => {
                              logout.mutate();
                            }
                          });
                        }}
                      >
                        <ExitToAppRoundedIcon />
                        Logout
                      </button>
                    </div>
                  </Stack>
                </SideBar.MenuWrapper>
              </>
            )}
            {!user && (
              <SideBar.LogInWrapper>
                <span>로그인이 필요합니다.</span>
                <button
                  onClick={() => {
                    navigate("/");
                    onClose();
                  }}
                >
                  로그인
                </button>
              </SideBar.LogInWrapper>
            )}
          </SideBar.MobileWrapper>
        </>,
        document.getElementById("front_component_root") as HTMLElement
      )}
    </>
  );
};

export default React.memo(MobileSide);
