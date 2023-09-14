import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import Axios from "../apis/Axios";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useFetcher, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";
import ProfileChangePopup from "../components/common/ProfileChangePopup";
import InfiniteScroll from "react-infinite-scroll-component";

//style
import Animation from "../styles/Animation";

//mui
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Badge from "@mui/material/Badge";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useMediaQuery } from "react-responsive";

interface userProps {
  email: string;
  id: number;
  nickname: string;
}
interface imageProps {
  src: string;
}
interface postProps {
  User: userProps;
  Images: imageProps[];
  content: string;
  createdAt: string;
}
interface user {
  nickname: string;
  id: number;
  profilePic: string;
}
interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

const UserInfo = () => {
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const queryClient = useQueryClient();
  const params = useParams();
  const categoryNum = params.cat ? parseInt(params.cat) : 0;
  const id = params.id ? parseInt(params.id) : 0;

  const navigate = useNavigate();
  const scrollTarget = useRef<HTMLInputElement>(null);

  //useQuery, useInfiniteQuery
  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;
  const { data: targetUser, refetch } = useQuery(
    ["targetUser"],
    () => Axios.get("user/info", { params: { id } }).then((res) => res.data),
    {
      onError: () => {
        // location.reload();
        navigate("/404");
      }
    }
  );
  const likedPosts = useInfiniteQuery(
    ["userLikedPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/user/liked", { params: { id, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const infoPosts = useInfiniteQuery(
    ["userInfoPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/user", { params: { id, type: 1, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const commPosts = useInfiniteQuery(
    ["userCommPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/user", { params: { id, type: 2, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  //useMutation
  const follow = useMutation(() => Axios.patch(`user/${targetUser.id}/follow`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["targetUser"]);
      toast.success("팔로우 완료");
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const unFollow = useMutation(() => Axios.delete(`user/${targetUser.id}/follow`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["targetUser"]);
      toast.success("언팔로우 완료");
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });

  useEffect(() => {
    if (user?.id == id) {
      navigate("/profile/0");
    } else {
      refetch();
      likedPosts.refetch();
      infoPosts.refetch();
      commPosts.refetch();
    }
  }, [id]);

  const isFollowed = targetUser?.Followers?.find((v: any) => v.id === user.id);
  const isMobile = useMediaQuery({ maxWidth: 720 });

  const category = ["팔로잉", "팔로워", "모집공고", "소통글", "관심 공고"];

  console.log(scrollTarget.current?.scrollHeight);
  return (
    <AppLayout>
      <>
        <UserInfoWrapper ref={scrollTarget}>
          <ProfilePicWrapper>
            {targetUser?.profilePic ? (
              <ProfilePic width={200} alt="userProfilePic" src={`${BACK_SERVER}/${targetUser?.profilePic}`} />
            ) : (
              <ProfilePic
                width={200}
                alt="userProfilePic"
                src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
              />
            )}
          </ProfilePicWrapper>
          <span>{targetUser?.nickname}</span>
          <span>{targetUser?.email}</span>
          <span>{targetUser?.usertext}</span>
          <span>
            팔로잉 {targetUser?.Followings?.length} • 팔로워 {targetUser?.Followers?.length} • 게시글{" "}
            {targetUser?.Posts?.length}
          </span>
          {isFollowed ? (
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                confirmAlert({
                  // title: "",
                  message: "언팔로우 하시겠습니까?",
                  buttons: [
                    {
                      label: "취소",
                      onClick: () => console.log("취소")
                    },
                    {
                      label: "확인",
                      onClick: () => unFollow.mutate()
                    }
                  ]
                });
              }}
            >
              unfollow
            </Button>
          ) : (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                confirmAlert({
                  // title: "",
                  message: "팔로우 하시겠습니까?",
                  buttons: [
                    {
                      label: "취소",
                      onClick: () => console.log("취소")
                    },
                    {
                      label: "확인",
                      onClick: () => follow.mutate()
                    }
                  ]
                });
              }}
            >
              follow
            </Button>
          )}
        </UserInfoWrapper>

        <MenuWrapper>
          {category.map((v, i) => (
            <Pill
              catNum={categoryNum}
              key={"catNum" + i}
              onClick={() => {
                if (isMobile) {
                  window.scrollTo({
                    top: scrollTarget.current?.scrollHeight,
                    left: 0,
                    behavior: "smooth"
                  });
                } else {
                  window.scrollTo({
                    top: scrollTarget.current?.scrollHeight,
                    left: 0,
                    behavior: "smooth"
                  });
                }

                setTimeout(() => {
                  navigate(`/userinfo/${targetUser?.id}/cat/${i}`);
                }, 0);
              }}
            >
              {v}
            </Pill>
          ))}
        </MenuWrapper>
        {categoryNum === 0 && (
          <ContentWrapper>
            <ContentBox>
              <ListWrapper>
                <ListTitle>
                  <Badge badgeContent={user?.Followings?.length} color="info" max={999} showZero>
                    <InsertEmoticonRoundedIcon fontSize="inherit" />
                  </Badge>
                  <div>팔로잉</div>
                </ListTitle>
                <List>
                  {targetUser?.Followings?.length === 0 ? (
                    <EmptyUserNoti>
                      <span>팔로잉 목록이 존재하지 않습니다.</span>
                    </EmptyUserNoti>
                  ) : (
                    targetUser?.Followings?.map((v: user, i: number) => (
                      <ListItem key={v.nickname + i}>
                        <div>
                          <Link to={`/userinfo/${v?.id}/cat/0`}>
                            {v.profilePic ? (
                              <ProfilePic width={32} alt="ProfilePic" src={`${BACK_SERVER}/${v.profilePic}`} />
                            ) : (
                              <ProfilePic
                                width={32}
                                alt="defaultProfilePic"
                                src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                              />
                            )}
                          </Link>
                        </div>
                        <span>{v.nickname}</span>
                      </ListItem>
                    ))
                  )}
                </List>
              </ListWrapper>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 1 && (
          <ContentWrapper>
            <ContentBox>
              <ListWrapper>
                <ListTitle>
                  <Badge badgeContent={user?.Followers?.length} color="info" max={999} showZero>
                    <InsertEmoticonOutlinedIcon fontSize="inherit" />
                  </Badge>
                  <div>팔로워</div>
                </ListTitle>
                <List>
                  {targetUser?.Followers?.length === 0 ? (
                    <EmptyUserNoti>
                      <span>팔로워 목록이 존재하지 않습니다.</span>
                    </EmptyUserNoti>
                  ) : (
                    targetUser?.Followers?.map((v: user, i: number) => (
                      <ListItem key={v.nickname + i}>
                        <div>
                          <Link to={`/userinfo/${v?.id}/cat/0`}>
                            {v.profilePic ? (
                              <ProfilePic width={32} alt="ProfilePic" src={`${BACK_SERVER}/${v.profilePic}`} />
                            ) : (
                              <ProfilePic
                                width={32}
                                alt="ProfilePic"
                                src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                              />
                            )}
                          </Link>
                        </div>
                        <span>{v.nickname}</span>
                      </ListItem>
                    ))
                  )}
                </List>
              </ListWrapper>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 2 && (
          <ContentWrapper>
            <Posts>
              {infoPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {infoPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  hasMore={infoPosts.hasNextPage || false}
                  loader={
                    <LoadingIcon>
                      <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                    </LoadingIcon>
                  }
                  next={() => infoPosts.fetchNextPage()}
                  dataLength={infoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {infoPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
        {categoryNum === 3 && (
          <ContentWrapper>
            <Posts>
              {commPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {commPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  hasMore={commPosts.hasNextPage || false}
                  loader={
                    <LoadingIcon>
                      <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                    </LoadingIcon>
                  }
                  next={() => commPosts.fetchNextPage()}
                  dataLength={commPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {commPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
        {categoryNum === 4 && (
          <ContentWrapper>
            <Posts>
              {likedPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {likedPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  hasMore={likedPosts.hasNextPage || false}
                  loader={
                    <LoadingIcon>
                      <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                    </LoadingIcon>
                  }
                  next={() => likedPosts.fetchNextPage()}
                  dataLength={likedPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {likedPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
      </>
    </AppLayout>
  );
};

export default UserInfo;

const ListTitle = styled.div`
  font-size: 60px;
  color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div {
    margin-top: 5px;
    font-size: 20px;
    /* font-weight: 600; */
    color: rgba(0, 0, 0, 0.7);
  }
  @media screen and (max-width: 720px) {
    font-size: 40px;
    > div {
      font-size: 18px;
    }
  }
`;

const Pill = styled.div<{ catNum: number }>`
  transition: all ease-in-out 0.5s;
  height: 32px;
  margin-right: 12px;
  padding: 6px 20px;
  border-radius: 100px;

  font-size: 18px;

  display: flex;
  align-items: center;
  cursor: pointer;

  color: #464b53;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);

  background-color: #e0d9eb;
  &:nth-child(${(props) => props.catNum + 1}) {
    background-color: #d5dbf1;
  }

  @media screen and (max-width: 720px) {
    margin-right: 8px;
    background-color: white;

    &:last-child {
      margin-right: 0;
    }
    &:nth-child(${(props) => props.catNum + 1}) {
      background-color: #f2e1f6;
    }
  }
`;
const ProfilePicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  * {
    flex-shrink: 0;
  }
  @media screen and (max-width: 720px) {
  }
`;

const UserInfoWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding-top: 40px;
  width: 500px;
  height: 60vh;

  > span {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    margin: 4px 0;
  }
  > span:nth-child(2) {
    margin-top: 32px;
    font-size: 32px;
    color: rgba(0, 0, 0, 0.8);
  }
  > span:nth-child(3) {
    font-size: 24px;
    color: rgba(0, 0, 0, 0.7);
  }
  > span:nth-child(5) {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 720px) {
    width: 92vw;
    margin-top: 36px;
  }
  button {
    /* margin-left: 10px; */
    margin-bottom: 48px;
    border: 2px rgba(0, 0, 0, 0.6) solid;
    color: rgba(0, 0, 0, 0.6);
  }
`;
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const MenuWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: auto;
  width: 504px;

  padding: 4px 2px;
  margin-top: 32px;

  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  @media screen and (max-width: 720px) {
    width: 100%;
    padding-left: 4vw;
    padding-right: 4vw;
  }
`;
const ContentWrapper = styled.div`
  animation: ${Animation.smoothAppear} 0.7s;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 100%;
  height: auto;
  min-height: calc(100vh - 72px);

  padding-top: 24px;
  padding-bottom: 24px;
  @media screen and (max-width: 720px) {
    //header : 36px;
    //buttons area : 72px;
    min-height: calc(100vh - 36px - 72px);
    /* min-height: 100vh; */
  }
`;
const ContentBox = styled.div`
  width: 500px;
  height: 550px;
  padding: 20px;
  margin-bottom: 24px;
  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  * {
    flex-shrink: 0;
  }
  button {
    color: #aaa7d4;
  }
  @media screen and (max-width: 720px) {
    width: 92vw;
    /* background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px); */
  }
`;
const LoadingIcon = styled.div`
  display: flex;
  justify-content: center;
`;

const EmptyNoti = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 72px;
  color: rgba(0, 0, 0, 0.5);
  /* font-weight: 600; */
  span {
    margin-top: 20px;
    font-size: 24px;
  }
`;
const EmptyUserNoti = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  white-space: nowrap;

  font-size: 48px;
  color: rgba(0, 0, 0, 0.5);
  /* font-weight: 600; */
  span {
    margin-top: 20px;
    font-size: 18px;
  }
`;

const List = styled.div`
  padding: 20px;
  width: 80%;
  height: 0;

  flex-grow: 1;
  -webkit-box-flex: 1;

  overflow-y: scroll;
`;
const ListItem = styled.div`
  width: 100%;
  padding: 5px 0px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      margin-left: 10px;
    }
  }
  > button {
    min-width: 0;
  }
`;
const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  @media screen and (max-width: 720px) {
    width: 90%;
    height: 95%;
  }
`;
const ProfilePic = styled.img<{ width: number }>`
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.width + "px"};
  border-radius: ${(props) => props.width + "px"};

  object-fit: cover;
  background-color: #fff;

  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  padding-top: 4px;

  width: 100%;
  height: auto;
  * {
    flex-shrink: 0;
  }
  > div {
    animation: ${Animation.smoothAppear} 0.7s;
  }
`;
