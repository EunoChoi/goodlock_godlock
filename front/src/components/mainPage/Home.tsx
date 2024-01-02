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
import Hashtag from "../../functions/reactQuery/Hashtag";

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
  const pillSub = ["Notice"];
  const [toggle, setToggle] = useState<number>(0);
  const navigate = useNavigate();

  const isMobile = IsMobile();

  const user = User.get().data;
  const tipHashtag = Hashtag.get({ type: 1, limit: 5 }).data;
  const freeHashtag = Hashtag.get({ type: 2, limit: 5 }).data;

  const scrollTargerheight = () => {
    window.scrollTo({
      top: scrollTarget.current?.scrollHeight,
      left: 0,
      behavior: "smooth"
    });
  };

  //this month
  const monthNewInfo = useQuery(
    ["month/new/1"],
    () => Axios.get("post/month/new", { params: { type: 1 } }).then((v) => v.data),
    {
      // staleTime: 60 * 1000
    }
  ).data;
  const monthNewComm = useQuery(
    ["month/new/2"],
    () => Axios.get("post/month/new", { params: { type: 2 } }).then((v) => v.data),
    {
      // staleTime: 60 * 1000
    }
  ).data;

  const topPosts = useQuery(["topPosts"], () =>
    Axios.get("post/month/top", { params: { type: [1, 2] } }).then((v) => v.data)
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

  const shortNickname = (nick: string) => {
    if (nick?.length >= 9) return nick.slice(0, 8) + "...";
    else return nick;
  };
  const shortTag = (tag: string) => {
    if (tag?.length >= 11) return tag.slice(0, 10) + "...";
    else return tag;
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
        <MainPageStyle.Space height={8}></MainPageStyle.Space>

        <MainPageStyle.TextWrapper_Normal>굿락갓락은 나만의 감성을 더하는</MainPageStyle.TextWrapper_Normal>
        <MainPageStyle.TextWrapper_Normal>갤럭시&굿락 팁 공유 사이트입니다. :)</MainPageStyle.TextWrapper_Normal>

        <MainPageStyle.Space height={48}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_Bold>
          <CalendarMonthIcon id="icon" fontSize="large" />
          this month
        </MainPageStyle.TextWrapper_Bold>
        <MainPageStyle.Space height={8}></MainPageStyle.Space>
        <MainPageStyle.TextWrapper_SubBold>New</MainPageStyle.TextWrapper_SubBold>
        <MainPageStyle.TextWrapper_Normal>
          {/* {monthNewInfo?.len + monthNewComm?.len} Tip&Free Posts */}
          {monthNewInfo + monthNewComm} All • {monthNewInfo} Tip • {monthNewComm} Free Posts
        </MainPageStyle.TextWrapper_Normal>
        {/* <MainPageStyle.Space height={8} /> */}
        {/* <MainPageStyle.TextWrapper_SubBold>Share Closing</MainPageStyle.TextWrapper_SubBold>
        <MainPageStyle.TextWrapper_Normal>{monthEndLiked} Bookmark Tip Posts</MainPageStyle.TextWrapper_Normal> */}
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

      <MainPageStyle.HomeEl>
        <div id="posts">
          {toggle === 0 && ( //공지사항
            <>
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
            </>
          )}
          {toggle === 1 && ( //관심 팁
            <></>
          )}
        </div>

        {!isMobile && (
          <div id="tags">
            <span className="title">Popular Tag</span>
            <MainPageStyle.Space height={24} />
            <span className="subTitle">Tip Posts</span>
            {tipHashtag?.map((v: { id: number; name: string }) => (
              <span
                key={v?.id}
                onClick={() => {
                  navigate(`/main/1/search/#${encodeURI(v?.name)}`);
                }}
              >
                #{shortTag(v?.name)}
              </span>
            ))}

            <MainPageStyle.Space height={24} />

            <span className="subTitle">Free Posts</span>
            {freeHashtag?.map((v: { id: number; name: string }) => (
              <span
                key={v?.id}
                onClick={() => {
                  navigate(`/main/2/search/#${encodeURI(v?.name)}`);
                }}
              >
                #{shortTag(v?.name)}
              </span>
            ))}
          </div>
        )}
      </MainPageStyle.HomeEl>
    </MainPageStyle.MainEl>
  );
};

export default Home;
