import React, { useEffect } from "react";
import User from "../functions/reactQuery/User";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../styles/SidaBar";
import useAlert from "./common/Alert";

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
import { createPortal } from "react-dom";

const Side = () => {
  const user = User.get().data;
  const navigate = useNavigate();
  const logout = User.logout();

  const { type } = useParams();
  const currentPage = type ? parseInt(type) : -1;

  const { Alert: LogoutConfirm, openAlert: openLogoutConfirm } = useAlert();

  const makeK = (n: number | null) => {
    if (n === null) {
      return "-";
    }
    if (n > 1000) {
      return (n / 1000).toFixed(1) + "k";
    }
    return n;
  };

  const logoutConfirm = () => {
    openLogoutConfirm({
      mainText: "로그아웃 하시겠습니까?",
      onSuccess: () => {
        logout.mutate();
      }
    });
  };

  return (
    // 로그아웃 상태에서 접근시도 구현해야함. 싱글 포스트 뷰 때문에
    <SideBar.PCWrapper>
      {createPortal(<LogoutConfirm />, document.getElementById("modal_root") as HTMLElement)}

      <SideBar.HeaderWrapper>
        <button
          onClick={() => {
            navigate("/main/0");
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
              }}
            >
              <span id="nickname">{user?.nickname?.slice(0, 8)}</span>
              <span id="email">{user?.email}</span>
              <span id="usertext">{user?.usertext}</span>
            </div>

            {user?.level !== 0 && (
              <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={1} justifyContent="center">
                <button
                  className="info_box"
                  onClick={() => {
                    navigate("/main/4/cat/0");
                  }}
                >
                  <span>{makeK(user?.Posts?.length)}</span>
                  <span>Posts</span>
                </button>
                <button
                  className="info_box"
                  onClick={() => {
                    navigate("/main/4/cat/4");
                  }}
                >
                  <span>{makeK(user?.Followings?.length)}</span>
                  <span>Followings</span>
                </button>
                <button
                  className="info_box"
                  onClick={() => {
                    navigate("/main/4/cat/5");
                  }}
                >
                  <span>{makeK(user?.Followers?.length)}</span>
                  <span>Followers</span>
                </button>
              </Stack>
            )}
          </SideBar.UserInfoWrapper>
          <SideBar.MenuWrapper currentPage={currentPage + 1}>
            <Stack divider={<Divider orientation="horizontal" />} spacing={2} justifyContent="center">
              <div></div>
              <div id="buttons">
                <button
                  onClick={() => {
                    navigate("/main/0");
                  }}
                >
                  <HomeRoundedIcon />
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate("/main/1");
                  }}
                >
                  <LightbulbRoundedIcon />
                  Tip Board
                </button>
                <button
                  onClick={() => {
                    navigate("/main/2");
                  }}
                >
                  <ForumIcon />
                  Free Board
                </button>
                <button
                  onClick={() => {
                    navigate("/main/3");
                  }}
                >
                  <PhotoRoundedIcon />
                  Gallery
                </button>
                {user.level !== 0 && (
                  <button
                    onClick={() => {
                      navigate("/main/4/cat/0");
                    }}
                  >
                    <PersonRoundedIcon />
                    Profile
                  </button>
                )}
              </div>
              <div id="buttons">
                <button
                  id="logout"
                  onClick={() => {
                    logoutConfirm();
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
            }}
          >
            로그인
          </button>
        </SideBar.LogInWrapper>
      )}
    </SideBar.PCWrapper>
  );
};

export default Side;
