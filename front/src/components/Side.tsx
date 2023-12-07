import React from "react";
import User from "../functions/reactQuery/User";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

//mui
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

const Side = () => {
  const user = User.getData();
  const navigate = useNavigate();
  const logout = User.logout();

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
    if (nick.length >= 11) return nick.slice(0, 10) + "...";
    else return nick;
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

  return (
    // 로그아웃 상태에서 접근시도 구현해야함. 싱글 포스트 뷰 때문에
    <Wrapper>
      <HeaderWrapper>
        <button onClick={() => navigate("/main/0")}>
          <Logo src="/img/loading.png"></Logo>
          <span>God Lock</span>
        </button>
      </HeaderWrapper>
      {user && (
        <>
          <UserInfoWrapper>
            <ProfilePic src={user.profilePic} onClick={() => navigate("/profile/0")} />

            <div id="info_text_box">
              <span id="nickname">{makeShortNickname(user?.nickname)}</span>
              <span id="email">{user?.email}</span>
              <span id="usertext">{user?.usertext}</span>
            </div>

            <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={1} justifyContent="center">
              <button className="info_box" onClick={() => navigate("/profile/3")}>
                <span>{makeK(user?.Posts.length)}</span>
                <span>Posts</span>
              </button>
              <button className="info_box" onClick={() => navigate("/profile/1")}>
                <span>{makeK(user?.Followings.length)}</span>
                <span>Followings</span>
              </button>
              <button className="info_box" onClick={() => navigate("/profile/2")}>
                <span>{makeK(user?.Followers.length)}</span>
                <span>Followers</span>
              </button>
            </Stack>
          </UserInfoWrapper>
          <MenuWrapper currentPage={currentPage + 1}>
            <Stack divider={<Divider orientation="horizontal" />} spacing={2} justifyContent="center">
              <div id="buttons">
                <button onClick={() => navigate("/main/0")}>
                  <HomeRoundedIcon />
                  Home
                </button>
                <button onClick={() => navigate("/main/1")}>
                  <LightbulbRoundedIcon />
                  Tips
                </button>
                <button onClick={() => navigate("/main/2")}>
                  <PeopleRoundedIcon />
                  Free Board
                </button>
                <button onClick={() => navigate("/main/3")}>
                  <PhotoRoundedIcon />
                  Gallery
                </button>
                <button onClick={() => navigate("/profile/0")}>
                  <PersonRoundedIcon />
                  Profile
                </button>
              </div>
              <div>
                <button onClick={() => logoutConfirm()}>
                  <ExitToAppRoundedIcon />
                  Logout
                </button>
              </div>
            </Stack>
          </MenuWrapper>
        </>
      )}
      {!user && (
        <LogInWrapper>
          <span>로그인이 필요합니다.</span>
          <button onClick={() => navigate("/")}>로그인</button>
        </LogInWrapper>
      )}
    </Wrapper>
  );
};

export default Side;

const LogInWrapper = styled.div`
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    font-size: 22px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
  button {
    font-size: 24px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);

    padding: 6px 24px;

    border: 2px solid rgba(0, 0, 0, 0.05);
    border-radius: 50px;
    background-color: #c7d7ff;

    margin-top: 24px;
  }
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;

  margin-right: 8px;

  border-radius: 100%;
  border: 2px solid rgba(0, 0, 0, 0.05);
`;

const ProfilePic = styled.img`
  width: 108px;
  height: 108px;
  object-fit: cover;

  border-radius: 100%;
  border: 2px solid rgba(0, 0, 0, 0.05);
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.05);
  background-color: #f2f2f2;
  border-right: rgba(0, 0, 0, 0.02) solid 2px;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  height: 10%;
  /* border: 1px solid white; */

  padding: 0 20px;

  display: flex;
  justify-content: start;
  align-items: center;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    font-family: OAGothic-ExtraBold;

    font-size: 24px;
    font-weight: 400;

    color: rgba(0, 0, 0, 0.8);
  }
`;
const UserInfoWrapper = styled.div`
  width: 100%;
  height: 45%;
  /* border: 1px solid white; */

  padding: 0 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  #info_text_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      margin: 4px 0;
    }
  }

  #nickname {
    font-size: 24px;
    font-weight: 600;

    color: rgba(0, 0, 0, 0.7);
  }
  #email {
    font-size: 14px;
    font-weight: 500;

    color: rgba(0, 0, 0, 0.5);
  }
  #usertext {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);

    text-align: center;
  }
  .info_box {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span:first-child {
      font-weight: 600;
      font-size: 18px;

      color: rgba(0, 0, 0, 0.7);
    }
    span:nth-child(2) {
      font-weight: 500;
      font-size: 13px;

      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
const MenuWrapper = styled.div<{ currentPage: number | undefined }>`
  width: 100%;
  height: 45%;
  /* border: 1px solid white; */

  padding: 0 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  #buttons {
    button:nth-child(${(props) => props.currentPage}) {
      color: #d5a8d0;
    }
  }

  div {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    button {
      display: flex;
      justify-content: center;
      align-items: center;

      font-weight: 600;
      font-size: 18px;

      margin: 8px 0;
      * {
        margin-right: 8px;
      }

      color: rgba(0, 0, 0, 0.7);
    }
  }
`;
