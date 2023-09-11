import React from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import Axios from "../../apis/Axios";
import { useQuery } from "@tanstack/react-query";

const UserProfile = () => {
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  return (
    <ProfileWrapper>
      <UserTitle>
        <Link to="/profile/0">
          {user?.profilePic ? (
            <ProfilePic alt="profile_Pic" src={`${BACK_SERVER}/${user.profilePic}`} />
          ) : (
            <ProfilePic alt="profile_Pic" src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`} />
          )}
        </Link>
        <span>{user?.nickname}</span>
        <span>{user?.email}</span>
        {user?.usertext !== null ? <span>{user?.usertext}</span> : <span>-</span>}
      </UserTitle>

      <UserSub>
        <Link to="/profile/2">
          <span>{user?.Posts?.length}</span>
          <span>게시글</span>
        </Link>
      </UserSub>
      <UserSub>
        <Link to="/profile/2">
          <span>{user?.Liked?.filter((v: any) => v.type === 1).length}</span>
          <span>관심 공고</span>
        </Link>
      </UserSub>
      <UserSub>
        <Link to="/profile/1">
          <span>{user?.Followings?.length}</span>
          <span>팔로잉</span>
        </Link>
      </UserSub>
      <UserSub>
        <Link to="/profile/1">
          <span>{user?.Followers?.length}</span>
          <span>팔로워</span>
        </Link>
      </UserSub>
      <div></div>
    </ProfileWrapper>
  );
};

export default UserProfile;

const ProfileWrapper = styled.div`
  width: 100%;
  height: calc(100% - 200px);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 4fr 1fr 1fr;

  padding: 0px 20px;

  @media screen and (max-width: 720px) {
    display: none;
  }
`;

const ProfilePic = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 150px;

  /* display: flex;
  justify-content: center;
  align-items: center; */
  object-fit: cover;

  background-color: white;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
`;

const UserTitle = styled.div`
  padding: 20px 0px;
  grid-column: 1 / 3;
  grid-row: 1 / 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  * {
    margin: 5px;
    &:nth-child(2) {
      font-size: 2em;
      /* font-weight: 600; */
      color: rgba(0, 0, 0, 0.6);
      /* color: white; */
    }
    &:nth-child(3) {
      font-size: 1.25em;
      color: rgba(0, 0, 0, 0.5);
    }
    &:nth-child(4) {
      font-size: 1.2em;
      /* color: rgba(255, 255, 255, 0.9); */
      color: white;
      color: rgba(0, 0, 0, 0.4);
      text-align: center;
      line-height: 1.3em;

      /* font-weight: 600; */
      /* text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); */
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
      /* font-weight: 600; */
    }
    span:nth-child(2) {
      font-size: 1.2em;
      /* font-weight: 600; */
      color: rgba(0, 0, 0, 0.4);
    }
  }
`;
