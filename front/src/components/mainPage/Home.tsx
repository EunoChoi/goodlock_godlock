import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../../apis/Axios";
import ExtensionIcon from "@mui/icons-material/Extension";
import Animation from "../../styles/Animation";

import User from "../../functions/reactQuery/User";

//components
import Post from "../common/Post";

//mui
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CircularProgress from "@mui/material/CircularProgress";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

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

const Home = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggle, setToggle] = useState<number>(0);

  const user = User.getData();

  const scrollTargerheight = () => {
    window.scrollTo({
      top: scrollTarget.current?.scrollHeight,
      left: 0,
      behavior: "smooth"
    });
  };

  //this week
  const thisWeekNewInfo = useQuery(
    ["thisweek/new/1"],
    () => Axios.get("post/thisweek/new", { params: { type: 1 } }).then((v) => v.data),
    {
      staleTime: 60 * 1000
    }
  ).data;
  const thisWeekNewComm = useQuery(
    ["thisweek/new/2"],
    () => Axios.get("post/thisweek/new", { params: { type: 2 } }).then((v) => v.data),
    {
      staleTime: 60 * 1000
    }
  ).data;
  const thisWeekEndLiked = useQuery(
    ["thisweek/end/liked"],
    () => Axios.get("post/thisweek/liked").then((v) => v.data),
    {
      staleTime: 60 * 1000
    }
  ).data;

  //load posts
  const noticePosts = useInfiniteQuery(
    ["noticePosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post", { params: { type: 0, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const likedPosts = useInfiniteQuery(
    ["likedPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/liked", { params: { type: 0, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [type]);

  //모달 열린 상태에서 새로고침시 history.back 처리, url 더러워짐 방지
  useEffect(() => {
    if (history.state.page === "modal") {
      history.back();
    }
  }, []);

  const shortNickname = (nick: string) => {
    if (nick.length >= 11) return nick.slice(0, 10) + "...";
    else return nick;
  };

  return (
    <MainEl>
      <TextWrapper ref={scrollTarget}>
        <TextWrapper_Bold>반갑습니다.</TextWrapper_Bold>
        <Space height={8}></Space>
        <TextWrapper_Title>
          {shortNickname(user?.nickname)}님 <EmojiPeopleIcon style={{ fontSize: "64px" }}></EmojiPeopleIcon>
        </TextWrapper_Title>
        <Space height={32}></Space>
        <TextWrapper_Normal>나만의 감성 더하기, 굿락갓락</TextWrapper_Normal>
        <Space height={32}></Space>
        <TextWrapper_Bold>
          <CalendarMonthIcon fontSize="large" />
          This Week
        </TextWrapper_Bold>
        <Space height={16}></Space>
        <TextWrapper_Normal>신규 등록 Posts {thisWeekNewInfo?.len + thisWeekNewComm?.len}개</TextWrapper_Normal>
        <TextWrapper_Normal>공유 마감 Bookmark Tip {thisWeekEndLiked?.len}개</TextWrapper_Normal>
      </TextWrapper>
      <Pill.Wrapper>
        <Pill.Sub
          toggle={toggle}
          onClick={() => {
            setToggle(0);
            scrollTargerheight();
          }}
        >
          Notice
        </Pill.Sub>
        <Pill.Sub
          toggle={toggle}
          onClick={() => {
            setToggle(1);
            scrollTargerheight();
          }}
        >
          Bookmark Tip
          {/* <BookmarksIcon fontSize="small" /> */}
          {/* <span>Tip Post</span> */}
        </Pill.Sub>
      </Pill.Wrapper>

      {toggle === 0 && ( //공지사항
        <HomeEl>
          {noticePosts.data?.pages[0].length === 0 && (
            <EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>게시글이 존재하지 않습니다.</span>
            </EmptyNoti>
          )}

          <InfiniteScroll
            hasMore={noticePosts.hasNextPage || false}
            loader={
              <LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </LoadingIconWrapper>
            }
            next={() => noticePosts.fetchNextPage()}
            dataLength={noticePosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {noticePosts?.data?.pages?.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </HomeEl>
      )}
      {toggle === 1 && ( //관심 팁
        <HomeEl>
          {likedPosts.data?.pages[0].length === 0 && (
            <EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>게시글이 존재하지 않습니다.</span>
            </EmptyNoti>
          )}
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
            {likedPosts?.data?.pages?.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </HomeEl>
      )}
    </MainEl>
  );
};

export default Home;

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
const LoadingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3e0f1;
  margin: 32px 0;
`;

const HomeEl = styled.div`
  min-height: calc(100vh - 80px);
  animation: ${Animation.smoothAppear} 1s ease-in-out;

  @media (orientation: portrait) or (max-height: 480px) {
    min-height: calc(100vh - 116px);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 300px;
  }
`;
const MainEl = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  animation: ${Animation.smoothAppear} 1s ease-in-out;
`;

const Pill = {
  Wrapper: styled.div`
    z-index: 80;
    position: sticky;
    top: 0px;

    background-color: white;

    display: flex;
    justify-content: start;
    align-items: center;

    padding-top: 24px;
    padding-bottom: 24px;

    width: 100%;
    width: 500px;
    overflow-x: scroll;

    @media (orientation: portrait) or (max-height: 480px) {
      top: 48px;
      top: 46px;
      background-color: #c8daf3;
      background-color: white;
      width: 100%;
      padding: 24px 4vw;
    }
    @media (orientation: landscape) and (max-height: 480px) {
      width: 300px;
      padding-left: 0;
      top: 0px;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  `,
  Search: styled.button<{ toggle: boolean }>`
    transition: all ease-in-out 0.5s;
    padding: 8px 16px;
    width: ${(props) => (props.toggle ? "200px" : "56px")};
    border: solid 2px rgba(0, 0, 0, 0.05);
    height: 32px;
    border-radius: 100px;

    font-size: 18px;

    /* box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3); */
    color: #464b53;
    background-color: #e3ecf9;
    background-color: ${({ toggle }) => toggle && "#f3e0f1"};

    form {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
    }
    input {
      opacity: 0;
      transition: all ease-in-out 0.5s;
      outline: none;
      width: 0;
      height: 24px;
      font-size: 18px;
      border-radius: 100px;
      border: none;

      font-weight: 500;

      background-color: ${({ toggle }) => toggle && "rgba(255, 255, 255, 0.8)"};
      opacity: ${({ toggle }) => toggle && "1"};
      padding: ${({ toggle }) => toggle && "0 10px"};
      flex-grow: ${({ toggle }) => toggle && "1"};

      &::placeholder {
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
      }
    }
    @media (orientation: portrait) or (max-height: 480px) {
      width: ${(props) => props.toggle && "50%"};
      flex-grow: ${({ toggle }) => toggle && "1"};
    }
  `,
  Sub: styled.button<{ toggle: number }>`
    transition: all ease-in-out 0.5s;
    height: 32px;
    padding: 0px 16px;
    margin-right: 8px;
    border-radius: 100px;
    border: solid 2px rgba(0, 0, 0, 0.05);

    font-size: 18px;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    /* box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3); */
    color: #464b53;
    background-color: #e3ecf9;
    > span {
      margin-left: 4px;
      font-weight: 500;
    }
    &:nth-child(${(props) => props.toggle + 1}) {
      background-color: #f3e0f1;
    }
  `
};

const Space = styled.div<{ height: number }>`
  height: ${(props) => props.height + "px"};
`;

const TextWrapper = styled.div`
  width: 500px;
  padding-top: 64px;
  padding-bottom: 24px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  @media (orientation: portrait) or (max-height: 480px) {
    width: 100%;
    padding-top: 72px;
    padding-left: 5vw;
    padding-right: 5vw;
    margin-top: 48px; //header height
    padding-bottom: 24px;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 300px;
    margin-top: 0;
    padding-top: 24px;
    padding-left: 0;
  }
`;
const TextWrapper_Title = styled.span`
  font-size: 44px;
  line-height: 48px;
  font-weight: 600;
  font-weight: 700;

  max-width: 100%;
  white-space: nowrap;
  overflow: scroll;

  display: flex;
  justify-content: start;
  align-items: center;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  color: #6e748e;
  color: #bc9dcf;
  color: #d5a8d0;
  color: rgba(0, 0, 0, 0.75);
`;

const TextWrapper_Bold = styled.span`
  font-size: 30px;
  line-height: 40px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.65);
`;
const TextWrapper_Bold_Color = styled.span`
  font-size: 30px;
  line-height: 40px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #8096b5;
`;
const TextWrapper_Normal = styled.span`
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;

  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.65);
`;
