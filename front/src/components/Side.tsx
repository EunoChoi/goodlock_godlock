import React from "react";
import User from "../functions/reactQuery/User";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";

import Img from "./common/Img";

//mui
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import ExtensionIcon from "@mui/icons-material/Extension";

interface Props {
  close: (b: void) => void;
}

const Side = ({ close }: Props) => {
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
    if (nick?.length >= 11) return nick.slice(0, 10) + "...";
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
        <button
          onClick={() => {
            navigate("/main/0");
            close();
          }}
        >
          <ExtensionIcon fontSize="inherit" />
          <span>God Lock</span>
        </button>
      </HeaderWrapper>
      {user && (
        <>
          <UserInfoWrapper>
            <Link to="/profile/0">
              {user.profilePic ? (
                <ProfilePic
                  className=""
                  src={user.profilePic}
                  altImg={`${user.profilePic.replace(/\/thumb\//, "/original/")}`}
                  alt="profilePic"
                />
              ) : (
                <ProfilePic className="" src="/img/defaultProfilePic.png" altImg="" alt="profilePic" />
              )}
            </Link>

            <div
              id="info_text_box"
              onClick={() => {
                navigate("/profile/0");
                close();
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
                  close();
                }}
              >
                <span>{makeK(user?.Posts?.length)}</span>
                <span>Posts</span>
              </button>
              <button
                className="info_box"
                onClick={() => {
                  navigate("/profile/1");
                  close();
                }}
              >
                <span>{makeK(user?.Followings?.length)}</span>
                <span>Followings</span>
              </button>
              <button
                className="info_box"
                onClick={() => {
                  navigate("/profile/2");
                  close();
                }}
              >
                <span>{makeK(user?.Followers?.length)}</span>
                <span>Followers</span>
              </button>
            </Stack>
          </UserInfoWrapper>
          <MenuWrapper currentPage={currentPage + 1}>
            <Stack divider={<Divider orientation="horizontal" />} spacing={2} justifyContent="center">
              <div id="buttons">
                <button
                  onClick={() => {
                    navigate("/main/0");
                    close();
                  }}
                >
                  <HomeRoundedIcon />
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate("/main/1");
                    close();
                  }}
                >
                  <LightbulbRoundedIcon />
                  Tip Board
                </button>
                <button
                  onClick={() => {
                    navigate("/main/2");
                    close();
                  }}
                >
                  <PeopleRoundedIcon />
                  Free Board
                </button>
                <button
                  onClick={() => {
                    navigate("/main/3");
                    close();
                  }}
                >
                  <PhotoRoundedIcon />
                  Gallery
                </button>
                <button
                  onClick={() => {
                    navigate("/profile/0");
                    close();
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
                    close();
                  }}
                >
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
          <button
            onClick={() => {
              navigate("/");
              close();
            }}
          >
            로그인
          </button>
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

const ProfilePic = styled(Img)`
  width: 108px;
  height: 108px;
  object-fit: cover;

  border-radius: 100%;
  border: 2px solid rgba(0, 0, 0, 0.1);

  cursor: pointer;
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

  padding: 0 40px;

  display: flex;
  justify-content: start;
  align-items: center;
  button {
    display: flex;
    justify-content: center;
    align-items: center;

    color: #d5a8d0;
    font-size: 26px;
    span {
      margin-left: 4px;
      font-family: OAGothic-ExtraBold;
      color: rgba(0, 0, 0, 0.7);

      font-size: 24px;
      font-weight: 600;
    }
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
    cursor: pointer;
    span {
      margin: 4px 0;
    }
  }

  #nickname {
    font-size: 32px;
    font-weight: 600;

    max-width: 100%;
    white-space: nowrap;
    overflow-x: scroll;

    display: flex;
    justify-content: start;
    align-items: center;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    color: rgba(0, 0, 0, 0.7);
  }
  #email {
    font-size: 14px;
    font-weight: 500;

    color: rgba(0, 0, 0, 0.35);
  }
  #usertext {
    font-size: 17px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);

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

  padding: 0 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  #buttons {
    button {
      transition: 0.2s ease-in-out all;
    }
    button:hover {
      scale: 1.1;
    }
    button:nth-child(${(props) => props.currentPage}) {
      color: #d5a8d0;
    }
  }
  #logout {
    transition: 0.2s ease-in-out all;
  }
  #logout:hover {
    scale: 1.1;
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
