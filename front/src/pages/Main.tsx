import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Animation from "../styles/Animation";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";

//mui
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import User from "../functions/reactQuery/User";

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
interface toggleProps {
  main: number;
  sub: number;
}

const Main = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggles, setToggles] = useState<toggleProps>({
    main: 0,
    sub: 0
  });
  const [searchInfo, setSearchInfo] = useState<string>("");
  const [searchComm, setSearchComm] = useState<string>("");

  const navigate = useNavigate();

  const user = User.getData();

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
    if (type >= 0 && type < 3) {
      setToggles({ main: type, sub: 0 });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    } else {
      navigate("/404");
    }
  }, [type]);

  return (
    <AppLayout>
      {toggles.main === 0 && (
        <MainEl>
          <WelcomeWrapper ref={scrollTarget}>
            <span>반갑습니다.</span>
            <span>
              <Link to={`/profile/0`}>{user?.nickname}님!</Link>
              <div>
                <EmojiPeopleIcon fontSize="inherit" />
              </div>
            </span>
            <span>굿락 팁 공유 플랫폼, 굿락갓락 :)</span>

            <span>
              <CalendarMonthIcon />
              This Week
            </span>
            <span>신규 등록 게시글 {thisWeekNewInfo?.len + thisWeekNewComm?.len}개</span>
            <span>마감 예정 관심 팁&설정 {thisWeekEndLiked?.len}개</span>
          </WelcomeWrapper>
          <Pill.Wrapper>
            <Pill.Sub
              toggle={toggles.sub}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 0 });
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });
              }}
            >
              공지사항
            </Pill.Sub>
            <Pill.Sub
              toggle={toggles.sub}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 1 });
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });
              }}
            >
              관심 설정
            </Pill.Sub>
          </Pill.Wrapper>

          {toggles.sub === 0 && ( //공지사항
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
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
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
          {toggles.sub === 1 && ( //관심 공고
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
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
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
      )}
      {toggles.main === 1 && ( // 모집 공고
        <MainEl>
          <WelcomeWrapper ref={scrollTarget}>
            <span>팁&설정</span>
            <span></span>
            <span>
              나만의 굿락 팁&설정을 공유해요.<br></br>
              GTS를 이용하면 공유가 쉬워집니다.
            </span>

            <span>
              <CalendarMonthIcon />
              This Week
            </span>
            <span>신규 등록 팁&설정 {thisWeekNewInfo?.len}개</span>
          </WelcomeWrapper>
          <Pill.Wrapper>
            <Pill.Sub
              toggle={toggles.sub}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 0 });
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });
              }}
            >
              모두
            </Pill.Sub>
            <Pill.Sub
              toggle={toggles.sub}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 1 });
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });
              }}
            >
              공유 중
            </Pill.Sub>
            <Pill.Search
              toggle={toggles.sub === 2}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 2 });
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
            </Pill.Search>
          </Pill.Wrapper>
          {toggles.sub === 0 && (
            <HomeEl>
              {infoPosts.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              <InfiniteScroll
                // scrollableTarget="scrollWrapper"
                hasMore={infoPosts.hasNextPage || false}
                loader={
                  <LoadingIconWrapper>
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                  </LoadingIconWrapper>
                }
                next={() => infoPosts.fetchNextPage()}
                dataLength={infoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
              >
                {infoPosts?.data?.pages.map((p) =>
                  p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
                )}
              </InfiniteScroll>
            </HomeEl>
          )}
          {toggles.sub === 1 && (
            <HomeEl>
              {activInfo.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              <InfiniteScroll
                // scrollableTarget="scrollWrapper"
                hasMore={activInfo.hasNextPage || false}
                loader={
                  <LoadingIconWrapper>
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                  </LoadingIconWrapper>
                }
                next={() => activInfo.fetchNextPage()}
                dataLength={activInfo.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
              >
                {activInfo?.data?.pages.map((p) =>
                  p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
                )}
              </InfiniteScroll>
            </HomeEl>
          )}
          {toggles.sub === 2 && ( //모집 공고 검색
            <HomeEl>
              {/* 검색 결과가 존재하지 않는 경우 */}
              {searchInfoPosts.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>검색 결과가 존재하지 않습니다.</span>
                </EmptyNoti>
              )}

              <InfiniteScroll
                // scrollableTarget="scrollWrapper"
                hasMore={searchInfoPosts.hasNextPage || false}
                loader={
                  <LoadingIconWrapper>
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                  </LoadingIconWrapper>
                }
                next={() => searchInfoPosts.fetchNextPage()}
                dataLength={searchInfoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
              >
                {searchInfoPosts?.data?.pages.map((p) =>
                  p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
                )}
              </InfiniteScroll>
            </HomeEl>
          )}
        </MainEl>
      )}

      {toggles.main === 2 && ( //소통
        <MainEl>
          <WelcomeWrapper ref={scrollTarget}>
            <span>소통</span>
            <span></span>
            <span>
              이해와 공감을 바탕으로 <br></br>서로 존중하는 대화를 해요.
            </span>
            <span>
              <CalendarMonthIcon />
              This Week
            </span>
            <span>신규 등록 소통글 {thisWeekNewComm?.len}개</span>
          </WelcomeWrapper>
          <Pill.Wrapper>
            <Pill.Sub
              toggle={toggles.sub}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 0 });
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });
              }}
            >
              모두
            </Pill.Sub>
            <Pill.Sub
              toggle={toggles.sub}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 1 });
                window.scrollTo({
                  top: scrollTarget.current?.scrollHeight,
                  left: 0,
                  behavior: "smooth"
                });
              }}
            >
              피드
            </Pill.Sub>
            <Pill.Search
              toggle={toggles.sub === 2}
              onClick={() => {
                setToggles({ main: toggles.main, sub: 2 });
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
          {toggles.sub === 0 && (
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
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
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
          {toggles.sub === 1 && (
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
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
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
          {toggles.sub === 2 && (
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
                    <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
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
      )}
    </AppLayout>
  );
};

export default Main;

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
  img {
    width: 25%;
  }
`;

const HomeEl = styled.div`
  animation: ${Animation.smoothAppear} 0.7s;
  min-height: calc(100vh - 80px);
  @media (orientation: portrait) or (max-height: 480px) {
    min-height: calc(100vh - 116px);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: calc(52vw + 20px);
  }
`;
const MainEl = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  animation: ${Animation.smoothAppear} 0.7s;
`;

const Pill = {
  Wrapper: styled.div`
    z-index: 80;
    position: sticky;
    top: 0px;
    /* background-color: whitesmoke; */
    background: rgb(255, 255, 255);
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(245, 245, 245, 1) 11%,
      rgba(245, 245, 245, 1) 100%
    );

    display: flex;
    justify-content: start;
    align-items: center;

    padding-left: calc(35vw - 285px);
    padding-top: 24px;
    padding-bottom: 24px;

    width: 100%;
    overflow-x: scroll;

    @media (orientation: portrait) or (max-height: 480px) {
      top: 36px;
      /* background-color: #c8daf3; */
      background: rgb(255, 255, 255);
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(200, 218, 243, 1) 11%,
        rgba(200, 218, 243, 1) 100%
      );
      padding: 24px 4vw;
    }
    @media (orientation: landscape) and (max-height: 480px) {
      width: 60vw;
      top: 0px;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  `,
  Search: styled.div<{ toggle: boolean }>`
    transition: all ease-in-out 0.5s;
    padding: 8px 16px;
    width: ${(props) => (props.toggle ? "200px" : "56px")};

    height: 32px;
    border-radius: 100px;

    font-size: 18px;

    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
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
  Sub: styled.div<{ toggle: number }>`
    transition: all ease-in-out 0.5s;
    height: 32px;
    padding: 0px 16px;
    margin-right: 8px;
    border-radius: 100px;

    font-size: 18px;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
    color: #464b53;
    background-color: #e3ecf9;
    &:nth-child(${(props) => props.toggle + 1}) {
      background-color: #f3e0f1;
    }
  `
};

const WelcomeWrapper = styled.div`
  width: calc(70vw - 70px);
  padding-top: 64px;
  padding-bottom: 24px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  > span {
    font-weight: 500;
  }
  > span:first-child,
  > span:nth-child(2) {
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;

    line-height: 36px;
    color: rgba(0, 0, 0, 0.7);
    /* text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2); */
    > div {
      margin-left: 12px;
      font-size: 44px;
    }
  }
  > span:nth-child(3),
  > span:nth-child(4),
  > span:nth-child(5),
  > span:nth-child(6) {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.5);

    margin: 8px 0;
    margin-bottom: 0;
  }
  > span:nth-child(3) {
    margin-top: 24px;
    line-height: 28px;
  }
  > span:nth-child(4) {
    font-size: 24px;
    font-weight: 600;
    line-height: 36px;
    margin-top: 32px;
    color: rgba(0, 0, 0, 0.65);
    text-transform: uppercase;

    svg {
      font-size: 32px;
      margin-right: 4px;
    }
  }
  > span {
    display: flex;
    align-items: center;

    padding-left: 10px;
    padding-left: calc(35vw - 285px);
  }
  @media (orientation: portrait) or (max-height: 480px) {
    width: 100vw;
    padding-top: 88px;
    margin-top: 36px;
    padding-bottom: 24px;
    > span {
      padding-left: 5vw;
      padding-right: 5vw;
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 60vw;
    margin-top: 0;
    padding-top: 24px;
  }
`;
