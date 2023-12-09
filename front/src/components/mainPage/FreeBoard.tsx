import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../../apis/Axios";
import { toast } from "react-toastify";

//custom
import Animation from "../../styles/Animation";

//components
import Post from "../common/Post";

//mui
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
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

const FreeBoard = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggle, setToggle] = useState<number>(0);
  const [searchComm, setSearchComm] = useState<string>("");

  //this week
  const thisWeekNewComm = useQuery(
    ["thisweek/new/2"],
    () => Axios.get("post/thisweek/new", { params: { type: 2 } }).then((v) => v.data),
    {
      staleTime: 60 * 1000
    }
  ).data;

  //load posts
  const communityPosts = useInfiniteQuery(
    ["communityPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post", { params: { type: 2, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const feedPosts = useInfiniteQuery(
    ["feed"],
    ({ pageParam = 1 }) =>
      Axios.get("post/feed", { params: { type: 0, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  //load search posts
  const searchCommPosts = useInfiniteQuery(
    ["searchComm"],
    ({ pageParam = 1 }) => {
      if (searchComm.length >= 1)
        return Axios.get("post/search", { params: { type: 2, search: searchComm, pageParam, tempDataNum: 5 } }).then(
          (res) => res.data
        );
      else return [];
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      },
      refetchOnWindowFocus: false,
      enabled: true
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

  return (
    <MainEl>
      <TextWrapper ref={scrollTarget}>
        <TextWrapper_Title>Free Board</TextWrapper_Title>
        <Space height={32}></Space>
        <TextWrapper_Normal>자유 주제로 소통이 가능한 게시판입니다.</TextWrapper_Normal>
        <TextWrapper_Normal>서로의 공감과 배려가 필요해요.</TextWrapper_Normal>
        <Space height={32}></Space>
        <TextWrapper_Bold>
          <CalendarMonthIcon fontSize="large" />
          This Week
        </TextWrapper_Bold>
        <Space height={16}></Space>
        <TextWrapper_Normal>신규 등록 소통글 {thisWeekNewComm?.len}개</TextWrapper_Normal>
      </TextWrapper>
      <Pill.Wrapper>
        <Pill.Sub
          toggle={toggle}
          onClick={() => {
            setToggle(0);
            window.scrollTo({
              top: scrollTarget.current?.scrollHeight,
              left: 0,
              behavior: "smooth"
            });
          }}
        >
          All
        </Pill.Sub>
        <Pill.Sub
          toggle={toggle}
          onClick={() => {
            setToggle(1);
            window.scrollTo({
              top: scrollTarget.current?.scrollHeight,
              left: 0,
              behavior: "smooth"
            });
          }}
        >
          Feed
        </Pill.Sub>
        <Pill.Search
          toggle={toggle === 2}
          onClick={() => {
            setToggle(2);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchComm.length !== 0) {
                searchCommPosts.refetch();
                toast.success(`"${searchComm}" 검색...`);
              } else toast.error(`검색어는 최소 1글자 이상 필요합니다.`);
            }}
          >
            <SearchIcon />
            <input
              placeholder="검색"
              value={searchComm}
              onChange={(e) => {
                setSearchComm(e.target.value);
              }}
            />
          </form>
        </Pill.Search>
      </Pill.Wrapper>
      {toggle === 0 && (
        //모든 소통글
        <HomeEl>
          {communityPosts.data?.pages[0].length === 0 && (
            <EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>게시글이 존재하지 않습니다.</span>
            </EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={communityPosts.hasNextPage || false}
            loader={
              <LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </LoadingIconWrapper>
            }
            next={() => communityPosts.fetchNextPage()}
            dataLength={communityPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {communityPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </HomeEl>
      )}
      {toggle === 1 && (
        //피드 소통글
        <HomeEl>
          {feedPosts?.data?.pages[0].length === 0 && (
            <EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>게시글이 존재하지 않습니다.</span>
            </EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={feedPosts?.hasNextPage || false}
            loader={
              <LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </LoadingIconWrapper>
            }
            next={() => feedPosts?.fetchNextPage()}
            dataLength={feedPosts?.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {feedPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </HomeEl>
      )}
      {toggle === 2 && (
        <HomeEl>
          {searchCommPosts.data?.pages[0].length === 0 && (
            <EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>검색 결과가 존재하지 않습니다.</span>
            </EmptyNoti>
          )}
          <InfiniteScroll
            hasMore={searchCommPosts.hasNextPage || false}
            loader={
              <LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </LoadingIconWrapper>
            }
            next={() => searchCommPosts.fetchNextPage()}
            dataLength={searchCommPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {searchCommPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </HomeEl>
      )}
    </MainEl>
  );
};

export default FreeBoard;

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
      background-color: #fff;
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
    margin-top: 48px; //header height
    padding-bottom: 24px;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 300px;
    padding-left: 0;
    margin-top: 0;
    padding-top: 24px;
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

  color: rgba(0, 0, 0, 0.6);
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
