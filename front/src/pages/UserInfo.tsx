import React, { useEffect, useRef } from "react";
import styled from "styled-components/macro";
import Axios from "../apis/Axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";
import InfiniteScroll from "react-infinite-scroll-component";

//style
import Animation from "../styles/Animation";

//mui
import Badge from "@mui/material/Badge";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import User from "../functions/reactQuery/User";
import CircularProgress from "@mui/material/CircularProgress";

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

const UserInfo = () => {
  const params = useParams();
  const categoryNum = params.cat ? parseInt(params.cat) : 0;
  const id = params.id ? parseInt(params.id) : 0;

  const navigate = useNavigate();
  const scrollTarget = useRef<HTMLDivElement>(null);
  const category = ["Followings", "Followers", "Tip Posts", "Free Posts", "Bookmark Posts"];

  const user = User.getData();
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

  const isFollowed = targetUser?.Followers?.find((v: any) => v.id === user.id);

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
  const follow = User.follow();
  const unFollow = User.unFollow();

  useEffect(() => {
    if (history.state.page === "modal") {
      history.back();
    }
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    refetch();
    likedPosts.refetch();
    infoPosts.refetch();
    commPosts.refetch();
  }, [id]);
  useEffect(() => {
    if (categoryNum >= 0 && categoryNum < 5) {
      console.log("올바른 링크 접근");
    } else {
      navigate("/404");
    }
  }, [categoryNum]);

  return (
    <AppLayout>
      <Wrapper>
        <UserInfoWrapper ref={scrollTarget}>
          {targetUser?.profilePic ? (
            <Pic
              alt="userProfilePic"
              src={`${targetUser?.profilePic}`}
              onError={(e) => {
                e.currentTarget.src = `/img/defaultProfilePic.png`;
              }}
            />
          ) : (
            <Pic width={150} alt="userProfilePic" src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`} />
          )}

          <span>{targetUser?.nickname}</span>
          <span id="email">{targetUser?.email}</span>
          <span>{targetUser?.usertext ? targetUser?.usertext : "-"}</span>
          <span>
            Followings {targetUser?.Followings?.length} • Followers {targetUser?.Followers?.length} • Free Posts{" "}
            {targetUser?.Posts?.filter((v: any) => v.type === 2).length}
          </span>
          {isFollowed ? (
            <FollowButton
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
                      onClick: () => unFollow.mutate({ userId: targetUser?.id })
                    }
                  ]
                });
              }}
            >
              unfollow
            </FollowButton>
          ) : (
            <FollowButton
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
                      onClick: () => follow.mutate(targetUser?.id)
                    }
                  ]
                });
              }}
            >
              follow
            </FollowButton>
          )}
        </UserInfoWrapper>

        <MenuWrapper>
          {category.map((v, i) => (
            <Pill
              catNum={categoryNum}
              key={"catNum" + i}
              onClick={() => {
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });

                setTimeout(() => {
                  navigate(`/userinfo/${targetUser?.id}/cat/${i}`);
                }, 1);
              }}
            >
              {v}
            </Pill>
          ))}
        </MenuWrapper>
        {categoryNum === 0 && (
          <ContentWrapper>
            <ContentBox>
              <ListTitle>
                <Badge badgeContent={user?.Followings?.length} color="info" max={999} showZero>
                  <InsertEmoticonRoundedIcon fontSize="inherit" />
                </Badge>
                <div>Followings</div>
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
                            <ProfilePic width={32} alt="ProfilePic" src={`${v.profilePic}`} />
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
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 1 && (
          <ContentWrapper>
            <ContentBox>
              <ListTitle>
                <Badge badgeContent={user?.Followers?.length} color="info" max={999} showZero>
                  <InsertEmoticonOutlinedIcon fontSize="inherit" />
                </Badge>
                <div>Followers</div>
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
                            <ProfilePic width={32} alt="ProfilePic" src={`${v.profilePic}`} />
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
                    <LoadingIconWrapper>
                      <CircularProgress size={96} color="inherit" />
                    </LoadingIconWrapper>
                  }
                  next={() => infoPosts.fetchNextPage()}
                  dataLength={infoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {infoPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
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
                    <LoadingIconWrapper>
                      <CircularProgress size={96} color="inherit" />
                    </LoadingIconWrapper>
                  }
                  next={() => commPosts.fetchNextPage()}
                  dataLength={commPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {commPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
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
                    <LoadingIconWrapper>
                      <CircularProgress size={96} color="inherit" />
                    </LoadingIconWrapper>
                  }
                  next={() => likedPosts.fetchNextPage()}
                  dataLength={likedPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {likedPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
      </Wrapper>
    </AppLayout>
  );
};

export default UserInfo;

const Wrapper = styled.div`
  animation: ${Animation.smoothAppear} 1s ease-in-out;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3e0f1;
  margin: 32px 0;
`;

const Pic = styled.img`
  /* position: absolute;
  right: 0px; */
  background-color: white;
  width: 190px;
  height: 190px;
  border-radius: 12px;
  /* box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2); */
  border: 3px solid rgba(0, 0, 0, 0.1);
  object-fit: cover;

  /* @media (orientation: portrait) or (max-height: 480px) {
    width: 200px;
    height: 200px;
  } */
`;

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
  @media (orientation: portrait) or (max-height: 480px) {
    font-size: 40px;
    > div {
      font-size: 18px;
    }
  }
`;

const Pill = styled.button<{ catNum: number }>`
  height: 32px;
  margin-right: 12px;
  padding: 6px 20px;
  border-radius: 100px;

  font-weight: 500;
  font-size: 18px;

  display: flex;
  align-items: center;
  cursor: pointer;

  /* box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3); */
  border: solid 2px rgba(0, 0, 0, 0.05);

  color: #464b53;
  background-color: #e3ecf9;
  &:nth-child(${(props) => props.catNum + 1}) {
    background-color: #f3e0f1;
  }

  @media (orientation: portrait) or (max-height: 480px) {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const UserInfoWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  /* padding-top: 40px; */
  width: 500px;
  height: 500px;

  #email {
    margin-top: 8px;
  }

  > span {
    color: rgba(0, 0, 0, 0.6);
  }
  > span:nth-child(2) {
    font-weight: 600;
    margin-top: 32px;
    font-size: 48px;
    color: rgba(0, 0, 0, 0.8);
  }
  > span:nth-child(3) {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.7);
  }
  > span:nth-child(4) {
    font-size: 22px;
    margin-top: 24px;
    /* padding: 0 12px; */
  }
  > span:nth-child(5) {
    font-size: 20px;
    margin-top: 24px;
    margin-bottom: 24px;
  }

  @media (orientation: portrait) or (max-height: 480px) {
    width: 92vw;
    margin-top: 36px;
    > span:nth-child(2) {
      font-size: 36px;
    }
    > span:nth-child(3) {
      font-size: 24px;
    }
    > span:nth-child(4) {
      font-size: 22px;
    }
    > span:nth-child(5) {
      font-size: 18px;
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 300px;
    height: auto;
    padding-left: 0;
    margin-top: 0;
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;
const FollowButton = styled.button`
  cursor: pointer;
  text-transform: uppercase;

  font-size: 14px;
  height: 36px;
  width: 108px;
  border: 3px rgba(0, 0, 0, 0.6) solid;
  border-radius: 6px;

  /* margin-bottom: 24px; */

  color: rgba(0, 0, 0, 0.6);

  transition: all ease-in-out 0.3s;
  &:hover {
    transform: scale(1.05);
  }
  @media (orientation: portrait) or (max-height: 480px) {
    /* margin-bottom: 48px; */
  }
`;

const MenuWrapper = styled.div`
  position: sticky;
  top: 0px;
  z-index: 85;
  /* background: rgb(255, 255, 255);
  background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(245, 245, 245, 1) 11%, rgba(245, 245, 245, 1) 100%); */
  background-color: #fff;

  display: flex;
  justify-content: start;
  align-items: center;
  height: auto;
  width: 500px;

  padding: 36px 0;

  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  @media (orientation: portrait) or (max-height: 480px) {
    top: 48px;
    top: 46px;
    width: 100%;
    padding-left: 4vw;
    padding-right: 4vw;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 300px;
    padding-left: 4px;
    top: 0;
  }
`;
const ContentWrapper = styled.div`
  animation: ${Animation.smoothAppear} 1s ease-in-out;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 100%;
  height: auto;
  min-height: calc(100vh - 104px);
  /* min-height: calc(100vh - 124px); */

  /* padding-top: 24px; */
  padding-bottom: 24px;
  @media (orientation: portrait) or (max-height: 480px) {
    //haeder height : 48px
    min-height: calc(100vh - 48px - 104px);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 50vw;
  }
`;
const ContentBox = styled.div`
  border-radius: 6px;
  transition: all ease-in-out 0.3s;
  width: 500px;
  min-height: calc(100vh - 104px - 24px);

  padding: 20px;
  /* margin-bottom: 24px; */

  /* box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); */
  background-color: rgba(0, 0, 0, 0.02);
  background-color: #fafafa;
  border: 2px rgba(0, 0, 0, 0.07) solid;

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
  @media (orientation: portrait) or (max-height: 480px) {
    width: 92vw;
    min-height: calc(100vh);
    min-height: calc(var(--vh, 1vh) * 100 - 48px - 104px - 24px);
    /* background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px); */
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 300px;
    min-height: 400px;
  }
`;

const EmptyNoti = styled.div`
  width: 100%;
  height: 500px;
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
  padding: 20px 0;
  width: 80%;
  height: 50%;

  flex-grow: 1;
  -webkit-box-flex: 1;

  overflow-y: scroll;
`;
const ListItem = styled.div`
  width: 100%;
  padding: 5px 5px;
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
