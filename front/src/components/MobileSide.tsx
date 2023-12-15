import React, { useEffect, useState } from "react";
import User from "../functions/reactQuery/User";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import SideBar from "../styles/SidaBar";

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
  const user = User.getData();
  const navigate = useNavigate();
  const logout = User.logout();
  const [sideBarAnimation, setSideBarAnimation] = useState<"open" | "close" | "">("");

  const { type } = useParams();
  let currentPage = type ? parseInt(type) : -1;
  if (window.location.pathname.split("/")[1] === "profile") currentPage = 4;

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
  const logoutConfirm = () => {
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
      ]
    });
  };

  useEffect(() => {
    setSideBarAnimation("open");

    const closeAnimation = () => {
      setSideBarAnimation("close");
    };

    window.addEventListener("popstate", closeAnimation);
    return () => {
      window.removeEventListener("popstate", closeAnimation);
    };
  }, []);

  return (
    // 로그아웃 상태에서 접근시도 구현해야함. 싱글 포스트 뷰 때문에
    <>
      <SideBar.BG
        animation={sideBarAnimation}
        onClick={() => {
          history.back();
        }}
        onTransitionEnd={() => {
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
                  navigate("/profile/0");
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
                  navigate("/profile/0");
                  onClose();
                }}
              >
                <span id="nickname">{makeShortNickname(user?.nickname)}</span>
                <span id="email">{user?.email}</span>
                <span id="usertext">{user?.usertext}</span>
              </div>

              <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={1} justifyContent="center">
                <button
                  className="info_box"
                  onClick={() => {
                    navigate("/profile/3");
                    onClose();
                  }}
                >
                  <span>{makeK(user?.Posts?.length)}</span>
                  <span>Posts</span>
                </button>
                <button
                  className="info_box"
                  onClick={() => {
                    navigate("/profile/1");
                    onClose();
                  }}
                >
                  <span>{makeK(user?.Followings?.length)}</span>
                  <span>Followings</span>
                </button>
                <button
                  className="info_box"
                  onClick={() => {
                    navigate("/profile/2");
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
                      navigate("/profile/0");
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
                      logoutConfirm();
                      onClose();
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
    </>
  );
};

export default MobileSide;
