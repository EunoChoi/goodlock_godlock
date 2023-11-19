import React from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import Axios from "../../apis/Axios";
import { useQuery } from "@tanstack/react-query";
import User from "../../functions/reactQuery/User";

const UserProfile = () => {
  const user = User.getData();

  return user ? (
    <ProfileWrapper>
      <UserTitle>
        <Link to="/profile/0">
          {user?.profilePic ? (
            <ProfilePic
              alt="userProfilePic"
              src={`${user.profilePic}`}
              onError={(e) => {
                e.currentTarget.src = `${user.profilePic.replace(/\/thumb\//, "/original/")}`;
              }}
            />
          ) : (
            <ProfilePic alt="userProfilePic" src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`} />
          )}
        </Link>
        <span>{user?.nickname}</span>
        <span>{user?.email}</span>
        {user?.usertext !== null ? <span>{user?.usertext}</span> : <span>-</span>}
      </UserTitle>

      <GridWrapper>
        <UserSub>
          <Link to="/profile/4">
            <span>{user?.Posts?.filter((v: any) => v.type === 2).length}</span>
            <span>소통글</span>
          </Link>
        </UserSub>
        <UserSub>
          <Link to="/profile/3">
            <span>{user?.Posts?.filter((v: any) => v.type === 1).length}</span>
            <span>팁&설정</span>
          </Link>
        </UserSub>
        <UserSub>
          <Link to="/profile/1">
            <span>{user?.Followings?.length}</span>
            <span>팔로잉</span>
          </Link>
        </UserSub>
        <UserSub>
          <Link to="/profile/2">
            <span>{user?.Followers?.length}</span>
            <span>팔로워</span>
          </Link>
        </UserSub>
      </GridWrapper>
    </ProfileWrapper>
  ) : (
    <LoginBtnWrapper>
      <span>로그인 후 이용 가능합니다</span>
      <button>
        <Link to="/">로그인</Link>
      </button>
    </LoginBtnWrapper>
  );
};

export default UserProfile;

const LoginBtnWrapper = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > span:first-child {
    color: rgba(0, 0, 0, 0.7);
    font-weight: 600;
    margin-bottom: 32px;
  }
  button {
    background-color: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
    color: #9a93b6;
    border-radius: 100px;
    padding: 8px 28px;
    font-size: 18px;
  }
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;
const ProfileWrapper = styled.div`
  width: 100%;
  height: 75vh;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0px 20px;

  @media (orientation: portrait) or (max-height: 480px) {
    display: none;
  }
`;

const ProfilePic = styled.img`
  height: 150px;
  height: 20vh;
  width: 150px;
  width: 20vh;
  border-radius: 150px;

  object-fit: cover;

  background-color: white;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
`;

const UserTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  height: 35vh;

  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  * {
    &:nth-child(2) {
      font-size: 2em;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 600;
    }
    &:nth-child(3) {
      font-size: 1.25em;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.5);
    }
    &:nth-child(4) {
      font-size: 1.2em;

      color: white;
      color: rgba(0, 0, 0, 0.4);
      text-align: center;
    }
  }
`;

const UserSub = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  * {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    span:nth-child(1) {
      color: white;
      color: rgba(0, 0, 0, 0.6);
      font-size: 1.6em;
      font-weight: 500;
    }
    span:nth-child(2) {
      font-size: 1.2em;
      color: rgba(0, 0, 0, 0.4);
    }
  }
`;
