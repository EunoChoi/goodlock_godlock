import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../../apis/Axios";
import { toast } from "react-toastify";
import MainPageStyle from "../../styles/MainPage";
import Img from "../common/Img";

//components
import Post from "../common/Post";

//mui
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  const navigate = useNavigate();

  const scrollTarget = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState<number>(0);
  const pillSub = ["All", "Feed"];
  const [searchComm, setSearchComm] = useState<string>("");

  //this week
  const thisWeekNew = useQuery(["thisweek/new/2"], () =>
    Axios.get("post/thisweek/new", { params: { type: 2 } }).then((v) => v.data)
  ).data;
  const thisWeekFeed = useQuery(["thisweek/feed"], () =>
    Axios.get("post/thisweek/feed", { params: { type: 2 } }).then((v) => v.data)
  ).data;
  const topPosts = useQuery(["topPosts"], () =>
    Axios.get("post/thisweek/top", { params: { type: 2 } }).then((v) => v.data)
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
    ["freefeed"],
    ({ pageParam = 1 }) =>
      Axios.get("post/feed", { params: { type: 2, pageParam, tempDataNum: 5 } }).then((res) => res.data),
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
  const makeK = (n: number | null) => {
    if (n === null) {
      return null;
    }
    if (n > 1000) {
      return (n / 1000).toFixed(1) + "k";
    }
    return n;
  };

  return (
    <MainPageStyle.MainEl>
      <MainPageStyle.TextWrapper ref={scrollTarget}>
        <MainPageStyle.TextWrapper_Title>Free Board</MainPageStyle.TextWrapper_Title>
        <MainPageStyle.Space height={32}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_Normal>자유 주제로 소통이 가능한 게시판입니다.</MainPageStyle.TextWrapper_Normal>
        <MainPageStyle.TextWrapper_Normal>공감과 배려를 보여주세요 :)</MainPageStyle.TextWrapper_Normal>
        <MainPageStyle.Space height={32}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Bold>
          <CalendarMonthIcon id="icon" fontSize="large" />
          This Week
        </MainPageStyle.TextWrapper_Bold>
        <MainPageStyle.Space height={20} />
        <MainPageStyle.TextWrapper_SubBold>New Posts</MainPageStyle.TextWrapper_SubBold>
        <MainPageStyle.TextWrapper_Normal>
          {thisWeekNew} Free • {thisWeekFeed} Feed Posts
        </MainPageStyle.TextWrapper_Normal>

        {topPosts?.length >= 1 && (
          <>
            <MainPageStyle.Space height={8} />
            <MainPageStyle.TextWrapper_SubBold>Popular Posts</MainPageStyle.TextWrapper_SubBold>
            <MainPageStyle.TopWrapper>
              {topPosts?.map(
                (v: { Images: Array<{ src: string }>; content: string; LikeCount: number; id: number }, i: number) => (
                  <MainPageStyle.TopPostWrapper key={i}>
                    <MainPageStyle.TopPost
                      onClick={() => {
                        // console.log(v);
                        navigate(`/postview/${v?.id}`);
                      }}
                    >
                      {v?.Images?.length >= 1 ? (
                        <Img
                          alt="TopImage"
                          id="image"
                          src={v?.Images[0].src}
                          altImg={v?.Images[0].src.replace(/\/thumb\//, "/original/")}
                        />
                      ) : (
                        <span id="text">{v?.content}</span>
                      )}
                    </MainPageStyle.TopPost>
                    <div id="info">
                      <span>#{i + 1}</span>
                      <span>
                        <FavoriteIcon id="icon2" fontSize="inherit" /> {makeK(v.LikeCount)}
                      </span>
                    </div>
                  </MainPageStyle.TopPostWrapper>
                )
              )}
            </MainPageStyle.TopWrapper>
          </>
        )}

        <MainPageStyle.Space height={12} />
      </MainPageStyle.TextWrapper>
      <MainPageStyle.Pill.Wrapper>
        {pillSub.map((v, i) => (
          <MainPageStyle.Pill.Sub
            key={v}
            toggle={toggle}
            onClick={() => {
              setToggle(i);
              window.scrollTo({
                top: scrollTarget.current?.scrollHeight,
                left: 0,
                behavior: "smooth"
              });
            }}
          >
            {v}
          </MainPageStyle.Pill.Sub>
        ))}

        <MainPageStyle.Pill.Search
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
        </MainPageStyle.Pill.Search>
      </MainPageStyle.Pill.Wrapper>
      {toggle === 0 && (
        //모든 소통글
        <MainPageStyle.HomeEl>
          {communityPosts.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>포스트가 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={communityPosts.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => communityPosts.fetchNextPage()}
            dataLength={communityPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {communityPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
      {toggle === 1 && (
        //피드 소통글
        <MainPageStyle.HomeEl>
          {feedPosts?.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>포스트가 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={feedPosts?.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => feedPosts?.fetchNextPage()}
            dataLength={feedPosts?.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {feedPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
      {toggle === 2 && (
        <MainPageStyle.HomeEl>
          {searchCommPosts.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>검색 결과가 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            hasMore={searchCommPosts.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => searchCommPosts.fetchNextPage()}
            dataLength={searchCommPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {searchCommPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
    </MainPageStyle.MainEl>
  );
};

export default FreeBoard;
