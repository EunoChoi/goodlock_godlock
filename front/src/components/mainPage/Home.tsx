import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../../apis/Axios";
import MainPageStyle from "../../styles/MainPage";

import User from "../../functions/reactQuery/User";

import IsMobile from "../../functions/IsMobile";

//components
import Post from "../common/Post";

//mui
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CircularProgress from "@mui/material/CircularProgress";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MessageIcon from "@mui/icons-material/Message";
import Img from "../common/Img";
import { useNavigate } from "react-router-dom";

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
  const tagTarget = useRef<HTMLDivElement>(null);
  const pillSub = ["Notice", "Bookmark Tip"];
  const [toggle, setToggle] = useState<number>(0);
  const navigate = useNavigate();

  const isMobile = IsMobile();

  const user = User.get().data;

  const scrollTargerheight = () => {
    window.scrollTo({
      top: scrollTarget.current?.scrollHeight,
      left: 0,
      behavior: "smooth"
    });
  };

  console.log(tagTarget.current?.offsetWidth);

  //this week
  const thisWeekNewInfo = useQuery(
    ["thisweek/new/1"],
    () => Axios.get("post/thisweek/new", { params: { type: 1 } }).then((v) => v.data),
    {
      // staleTime: 60 * 1000
    }
  ).data;
  const thisWeekNewComm = useQuery(
    ["thisweek/new/2"],
    () => Axios.get("post/thisweek/new", { params: { type: 2 } }).then((v) => v.data),
    {
      // staleTime: 60 * 1000
    }
  ).data;
  const thisWeekEndLiked = useQuery(
    ["thisweek/end/liked"],
    () => Axios.get("post/thisweek/likeEnd").then((v) => v.data),
    {
      // staleTime: 60 * 1000
    }
  ).data;
  const topPosts = useQuery(["topPosts"], () =>
    Axios.get("post/thisweek/top", { params: { type: [1, 2] } }).then((v) => v.data)
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
  const shortNickname = (nick: string) => {
    if (nick?.length >= 11) return nick.slice(0, 10) + "...";
    else return nick;
  };

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
        <MainPageStyle.TextWrapper_Bold>반갑습니다.</MainPageStyle.TextWrapper_Bold>
        <MainPageStyle.Space height={8}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_Title>
          {shortNickname(user?.nickname)}님 <EmojiPeopleIcon style={{ fontSize: "64px" }}></EmojiPeopleIcon>
        </MainPageStyle.TextWrapper_Title>
        <MainPageStyle.Space height={32}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Normal>굿락갓락은 나만의 감성을 더하는</MainPageStyle.TextWrapper_Normal>
        <MainPageStyle.TextWrapper_Normal>갤럭시&굿락 팁 공유 사이트입니다. :)</MainPageStyle.TextWrapper_Normal>

        <MainPageStyle.Space height={32}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_Bold>
          <CalendarMonthIcon id="icon" fontSize="large" />
          This Week
        </MainPageStyle.TextWrapper_Bold>
        <MainPageStyle.Space height={20}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_SubBold>New</MainPageStyle.TextWrapper_SubBold>
        <MainPageStyle.TextWrapper_Normal>
          {/* {thisWeekNewInfo?.len + thisWeekNewComm?.len} Tip&Free Posts */}
          {thisWeekNewInfo + thisWeekNewComm} All • {thisWeekNewInfo} Tip • {thisWeekNewComm} Free Posts
        </MainPageStyle.TextWrapper_Normal>
        {/* <MainPageStyle.Space height={8} /> */}
        {/* <MainPageStyle.TextWrapper_SubBold>Share Closing</MainPageStyle.TextWrapper_SubBold>
        <MainPageStyle.TextWrapper_Normal>{thisWeekEndLiked} Bookmark Tip Posts</MainPageStyle.TextWrapper_Normal> */}
        {topPosts?.length >= 1 && (
          <>
            {/* <MainPageStyle.Space height={8} /> */}
            <MainPageStyle.TextWrapper_SubBold>Popular</MainPageStyle.TextWrapper_SubBold>
            <MainPageStyle.TopWrapper>
              {topPosts?.map(
                (
                  v: {
                    Images: Array<{ src: string }>;
                    content: string;
                    LikeCount: number;
                    id: number;
                    Comments: Array<{ id: number }>;
                  },
                  i: number
                ) => (
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
                        <BookmarkIcon id="icon" fontSize="inherit" /> {makeK(v?.LikeCount)}
                      </span>
                      <span>
                        <MessageIcon id="icon" fontSize="inherit" /> {makeK(v?.Comments?.length)}
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
            key={i}
            toggle={toggle}
            onClick={() => {
              setToggle(i);
              scrollTargerheight();
            }}
          >
            {v}
          </MainPageStyle.Pill.Sub>
        ))}
      </MainPageStyle.Pill.Wrapper>

      {toggle === 0 && ( //공지사항
        <MainPageStyle.HomeEl>
          <div>
            {noticePosts.data?.pages[0].length === 0 && (
              <MainPageStyle.EmptyNoti>
                <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                <span>포스트가 존재하지 않습니다.</span>
              </MainPageStyle.EmptyNoti>
            )}
            <InfiniteScroll
              hasMore={noticePosts.hasNextPage || false}
              loader={
                <MainPageStyle.LoadingIconWrapper>
                  <CircularProgress size={96} color="inherit" />
                </MainPageStyle.LoadingIconWrapper>
              }
              next={() => noticePosts.fetchNextPage()}
              dataLength={noticePosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
            >
              {noticePosts?.data?.pages?.map((p) =>
                p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
              )}
            </InfiniteScroll>
          </div>
          {isMobile || (
            <div id="tags" ref={tagTarget}>
              <span className="title">Popular Tags</span>
              <span className="subTitle">Tip Posts</span>
              <span>상단바</span>
              <span>홈버튼</span>
              <span>굿락</span>
              <span>좋아요</span>
              <span>원핸드오퍼레이션</span>

              <MainPageStyle.Space height={24} />

              <span className="subTitle">Free Posts</span>
              <span>상단바</span>
              <span>홈버튼</span>
              <span>굿락</span>
              <span>좋아요</span>
              <span>원핸드오퍼레이션</span>
            </div>
          )}
        </MainPageStyle.HomeEl>
      )}
      {toggle === 1 && ( //관심 팁
        <MainPageStyle.HomeEl>
          {likedPosts.data?.pages[0].length === 0 && (
            <MainPageStyle.EmptyNoti>
              <SentimentVeryDissatisfiedIcon fontSize="inherit" />
              <span>포스트가 존재하지 않습니다.</span>
            </MainPageStyle.EmptyNoti>
          )}
          <InfiniteScroll
            hasMore={likedPosts.hasNextPage || false}
            loader={
              <MainPageStyle.LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </MainPageStyle.LoadingIconWrapper>
            }
            next={() => likedPosts.fetchNextPage()}
            dataLength={likedPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {likedPosts?.data?.pages?.map((p) =>
              p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
            )}
          </InfiniteScroll>
        </MainPageStyle.HomeEl>
      )}
    </MainPageStyle.MainEl>
  );
};

export default Home;
