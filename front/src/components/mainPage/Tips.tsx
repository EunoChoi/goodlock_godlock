import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../../apis/Axios";
import { toast } from "react-toastify";
import MainPageStyle from "../../styles/MainPage";

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

const Tips = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggle, setToggle] = useState<number>(0);
  const [searchInfo, setSearchInfo] = useState<string>("");

  //this week
  const thisWeekNewInfo = useQuery(
    ["thisweek/new/1"],
    () => Axios.get("post/thisweek/new", { params: { type: 1 } }).then((v) => v.data),
    {
      staleTime: 60 * 1000
    }
  ).data;

  //load posts
  const infoPosts = useInfiniteQuery(
    ["infoPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post", { params: { type: 1, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const activInfo = useInfiniteQuery(
    ["activinfo"],
    ({ pageParam = 1 }) =>
      Axios.get("post/activinfo", { params: { type: 1, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );

  //load search posts
  const searchInfoPosts = useInfiniteQuery(
    ["searchInfo"],
    ({ pageParam = 1 }) => {
      if (searchInfo.length >= 1)
        return Axios.get("post/search", { params: { type: 1, search: searchInfo, pageParam, tempDataNum: 5 } }).then(
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

  //메인페이지에서 home, tips, free 전환시 스크롤탑
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
    <MainPageStyle.MainEl>
      <MainPageStyle.TextWrapper ref={scrollTarget}>
        <MainPageStyle.TextWrapper_Title>Tip Board</MainPageStyle.TextWrapper_Title>

        <MainPageStyle.Space height={32}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Normal>굿락 팁과 설정을 공유하는 게시판입니다.</MainPageStyle.TextWrapper_Normal>
        <MainPageStyle.TextWrapper_Normal>GTS를 활용하면 공유가 쉬워져요!</MainPageStyle.TextWrapper_Normal>

        <MainPageStyle.Space height={32}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Bold>
          <CalendarMonthIcon fontSize="large" />
          This Week
        </MainPageStyle.TextWrapper_Bold>
        <MainPageStyle.Space height={16}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_Normal>신규 등록 팁 {thisWeekNewInfo?.len}개</MainPageStyle.TextWrapper_Normal>
      </MainPageStyle.TextWrapper>
      <MainPageStyle.Pill.Wrapper>
        <MainPageStyle.Pill.Sub
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
        </MainPageStyle.Pill.Sub>
        <MainPageStyle.Pill.Sub
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
          Activated
        </MainPageStyle.Pill.Sub>
        <MainPageStyle.Pill.Search
          toggle={toggle === 2}
          onClick={() => {
            setToggle(2);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInfo.length !== 0) {
                searchInfoPosts.refetch();
                toast.success(`"${searchInfo}" 검색...`);
              } else toast.error(`검색어는 최소 1글자 이상 필요합니다.`);
            }}
          >
            <SearchIcon />
            <input
              value={searchInfo}
              onChange={(e) => {
                setSearchInfo(e.target.value);
              }}
              placeholder="검색"
            />
          </form>
        </MainPageStyle.Pill.Search>
      </MainPageStyle.Pill.Wrapper>
      {toggle === 0 && ( //팁&설정 포스트
        <MainPageStyle.HomeEl>
          {infoPosts.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>게시글이 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={infoPosts.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => infoPosts.fetchNextPage()}
            dataLength={infoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {infoPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
      {toggle === 1 && (
        <MainPageStyle.HomeEl>
          {activInfo.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>게시글이 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={activInfo.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => activInfo.fetchNextPage()}
            dataLength={activInfo.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {activInfo?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
      {toggle === 2 && ( //모집 공고 검색
        <MainPageStyle.HomeEl>
          {/* 검색 결과가 존재하지 않는 경우 */}
          {searchInfoPosts.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>검색 결과가 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}

          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={searchInfoPosts.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => searchInfoPosts.fetchNextPage()}
            dataLength={searchInfoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {searchInfoPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
    </MainPageStyle.MainEl>
  );
};

export default Tips;
