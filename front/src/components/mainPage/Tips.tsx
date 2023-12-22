import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Img from "../common/Img";

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
  const navigate = useNavigate();
  const scrollTarget = useRef<HTMLDivElement>(null);

  const [toggle, setToggle] = useState<number>(0);
  const [searchInfo, setSearchInfo] = useState<string>("");
  const pillSub = ["All", "Ongoing", "Feed"];
  const pillWrapperRef = useRef<HTMLInputElement>(null);

  //this week
  const thisWeekNewInfo = useQuery(["thisweek/new/1"], () =>
    Axios.get("post/thisweek/new", { params: { type: 1 } }).then((v) => v.data)
  ).data;
  const thisWeekFeed = useQuery(["thisweek/feed"], () =>
    Axios.get("post/thisweek/feed", { params: { type: 1 } }).then((v) => v.data)
  ).data;
  const thisWeekOngoing = useQuery(["thisweek/activeinfo"], () =>
    Axios.get("post/thisweek/activeinfo", { params: { type: 1 } }).then((v) => v.data)
  ).data;
  const topPosts = useQuery(["topPosts"], () =>
    Axios.get("post/thisweek/top", { params: { type: 1 } }).then((v) => v.data)
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
  //load feed posts
  const feedPosts = useInfiniteQuery(
    ["tipfeed"],
    ({ pageParam = 1 }) =>
      Axios.get("post/feed", { params: { type: 1, pageParam, tempDataNum: 5 } }).then((res) => res.data),
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
        <MainPageStyle.TextWrapper_Title>Tip Board</MainPageStyle.TextWrapper_Title>

        <MainPageStyle.Space height={32}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Normal>굿락 팁과 설정을 공유하는 게시판입니다.</MainPageStyle.TextWrapper_Normal>
        <MainPageStyle.TextWrapper_Normal>GTS를 활용하면 공유가 쉬워져요!</MainPageStyle.TextWrapper_Normal>

        <MainPageStyle.Space height={32}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Bold>
          <CalendarMonthIcon id="icon" fontSize="large" />
          This Week
          {/* <CalendarMonthIcon id="icon" fontSize="large" /> */}
        </MainPageStyle.TextWrapper_Bold>
        <MainPageStyle.Space height={20} />
        <MainPageStyle.TextWrapper_SubBold>New</MainPageStyle.TextWrapper_SubBold>
        <MainPageStyle.TextWrapper_Normal>
          {thisWeekNewInfo} Tip • {thisWeekOngoing} Ongoing • {thisWeekFeed} Feed Posts
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
                        <BookmarkIcon id="icon" fontSize="inherit" /> {makeK(v.LikeCount)}
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
      <MainPageStyle.Pill.Wrapper ref={pillWrapperRef}>
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
          toggle={toggle === 3}
          onClick={() => {
            setToggle(3);
            window.scrollTo({
              top: scrollTarget.current?.scrollHeight,
              left: 0,
              behavior: "smooth"
            });
            setTimeout(() => {
              pillWrapperRef.current?.scrollTo({
                top: 0,
                left: window.visualViewport?.width,
                behavior: "smooth"
              });
            }, 500);
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
              <span>포스트가 존재하지 않습니다.</span>
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
              <span>포스트가 존재하지 않습니다.</span>
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
      {toggle === 2 && (
        <MainPageStyle.HomeEl>
          {feedPosts.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>포스트가 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            // scrollableTarget="scrollWrapper"
            hasMore={feedPosts.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => feedPosts.fetchNextPage()}
            dataLength={feedPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {feedPosts?.data?.pages.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
      {toggle === 3 && ( //모집 공고 검색
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
