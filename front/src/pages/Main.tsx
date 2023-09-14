import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";

import Animation from "../styles/Animation";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";

//mui
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import SearchIcon from "@mui/icons-material/Search";

interface userProps {
  email: string;
  id: number;
  nickname: string;
}
interface imageProps {
  src: string;
}
// interface commentProps { }
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
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggles, setToggles] = useState<toggleProps>({
    main: 0,
    sub: 0
  });

  const navigate = useNavigate();

  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  useEffect(() => {
    if (type < 0 || type >= 3) {
      navigate("/404");
    } else {
      setToggles({ main: type, sub: 0 });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }, [type]);

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

  return (
    <AppLayout>
      {toggles.main === 0 && (
        <MainEl>
          <WelcomeWrapper>
            <span>반갑습니다.</span>
            <span>
              <Link to={`/profile/0`}>{user?.nickname}님!</Link>
              <div>
                <EmojiPeopleIcon fontSize="inherit" />
              </div>
            </span>
            <span>오늘도 행복한 하루를 만들어 보아요 :)</span>
            <span>📅 today</span>
            <span>신규 등록된 모집공고 128개</span>
            <span>3일이내 마감 예정 관심 공고 5개</span>

            <Pill.Wrapper>
              <Pill.Sub
                toggle={toggles.sub}
                onClick={() => {
                  setToggles({ main: toggles.main, sub: 0 });
                }}
              >
                공지사항
              </Pill.Sub>
              <Pill.Sub
                toggle={toggles.sub}
                onClick={() => {
                  setToggles({ main: toggles.main, sub: 1 });
                }}
              >
                관심 공고
              </Pill.Sub>
            </Pill.Wrapper>
          </WelcomeWrapper>

          {toggles.sub === 0 && ( //공지사항
            <HomeEl>
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
                {noticePosts?.data?.pages.map((p) =>
                  p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                )}
              </InfiniteScroll>
            </HomeEl>
          )}
          {toggles.sub === 1 && ( //관심 공고
            <HomeEl>
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
                {likedPosts?.data?.pages.map((p) => p.map((v: postProps, i: number) => <Post key={i} postProps={v} />))}
              </InfiniteScroll>
            </HomeEl>
          )}
        </MainEl>
      )}
      {toggles.main === 1 && (
        <MainEl>
          <WelcomeWrapper>
            <span>모집공고</span>
            <span></span>
            <span>모집공고 설명글</span>

            <Pill.Wrapper>
              <Pill.Sub
                toggle={toggles.sub}
                onClick={() => {
                  setToggles({ main: toggles.main, sub: 0 });
                }}
              >
                모두
              </Pill.Sub>
              <Pill.Sub
                toggle={toggles.sub}
                onClick={() => {
                  setToggles({ main: toggles.main, sub: 1 });
                }}
              >
                마감 제외
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
                    console.log("submit");
                  }}
                >
                  <SearchIcon />
                  <input />
                </form>
              </Pill.Search>
            </Pill.Wrapper>
          </WelcomeWrapper>
          {toggles.sub === 0 && (
            <HomeEl>
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
                {infoPosts?.data?.pages.map((p) => p.map((v: postProps, i: number) => <Post key={i} postProps={v} />))}
              </InfiniteScroll>
            </HomeEl>
          )}
          {toggles.sub === 1 && <HomeEl></HomeEl>}
        </MainEl>
      )}
      {toggles.main === 2 && (
        <MainEl>
          <WelcomeWrapper>
            <span>소통</span>
            <span></span>
            <span>소통 게시글 설명글</span>

            <Pill.Wrapper>
              <Pill.Sub
                toggle={toggles.sub}
                onClick={() => {
                  setToggles({ main: toggles.main, sub: 0 });
                }}
              >
                모두
              </Pill.Sub>
              <Pill.Sub
                toggle={toggles.sub}
                onClick={() => {
                  setToggles({ main: toggles.main, sub: 1 });
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
                    console.log("submit");
                  }}
                >
                  <SearchIcon />
                  <input />
                </form>
              </Pill.Search>
            </Pill.Wrapper>
          </WelcomeWrapper>
          {toggles.sub === 0 && (
            <HomeEl>
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
                  p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                )}
              </InfiniteScroll>
            </HomeEl>
          )}
          {toggles.sub === 1 && <HomeEl></HomeEl>}
        </MainEl>
      )}
    </AppLayout>
  );
};

export default Main;
const LoadingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const HomeEl = styled.div`
  animation: ${Animation.smoothAppear} 0.7s;
`;
const MainEl = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding-bottom: 120px;

  animation: ${Animation.smoothAppear} 0.7s;
`;

const Pill = {
  Wrapper: styled.div`
    display: flex;
    justify-content: start;
    align-items: center;

    padding: 5px 0;
    padding-left: 10px;
    padding-left: calc(35vw - 285px);

    width: 100%;
    overflow-x: scroll;

    @media screen and (max-width: 720px) {
      padding: 5px 4vw;
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
    /* width: 56px; */
    width: ${(props) => (props.toggle ? "200px" : "56px")};
    background-color: #e0d9eb;
    background-color: ${({ toggle }) => toggle && "#d5dbf1"};

    height: 32px;
    margin-top: 40px;
    margin-bottom: 16px;
    border-radius: 100px;

    font-size: 18px;
    /* font-weight: 600; */

    color: #464b53;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
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

      background-color: ${({ toggle }) => toggle && "rgba(255, 255, 255, 0.8)"};
      opacity: ${({ toggle }) => toggle && "1"};
      padding: ${({ toggle }) => toggle && "0 10px"};
      flex-grow: ${({ toggle }) => toggle && "1"};
    }
    @media screen and (max-width: 720px) {
      background-color: rgba(255, 255, 255, 0.7);
      width: ${(props) => props.toggle && "50%"};
      flex-grow: ${({ toggle }) => toggle && "1"};
      background-color: ${({ toggle }) => toggle && "rgba(255, 255, 255, 0.2)"};
    }
  `,
  Sub: styled.div<{ toggle: number }>`
    transition: all ease-in-out 0.5s;
    height: 32px;
    margin-right: 8px;
    padding: 6px 16px;
    margin-top: 40px;
    margin-bottom: 16px;
    margin-right: 8px;
    border-radius: 100px;

    font-size: 18px;
    /* font-weight: 600; */

    display: flex;
    align-items: center;

    color: #464b53;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);

    background-color: #e0d9eb;

    &:nth-child(${(props) => props.toggle + 1}) {
      background-color: #d5dbf1;
    }
    @media screen and (max-width: 720px) {
      background-color: rgba(255, 255, 255, 0.7);
      &:nth-child(${(props) => props.toggle + 1}) {
        background-color: ${({ toggle }) => toggle && "rgba(255, 255, 255, 0.2)"};
      }
    }
  `
};

const WelcomeWrapper = styled.div`
  width: calc(70vw - 70px);
  margin-top: 64px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  > span:first-child,
  > span:nth-child(2) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    /* font-weight: 600; */
    line-height: 36px;
    color: rgba(0, 0, 0, 0.8);
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
    /* font-weight: 400; */
    color: rgba(0, 0, 0, 0.5);

    margin: 8px 0;
    margin-bottom: 0;
    /* margin-left: 2px; */
    /* text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); */
  }
  > span:nth-child(3) {
    margin-top: 24px;
  }
  > span:nth-child(4) {
    font-size: 24px;
    /* font-weight: 600; */
    line-height: 36px;
    margin-top: 32px;
    color: #323232;
    text-transform: uppercase;
  }
  > span {
    padding-left: 10px;
    padding-left: calc(35vw - 285px);
  }
  @media screen and (max-width: 720px) {
    width: 100vw;
    padding: 0;
    padding-top: 60px;
    > span {
      padding-left: 5vw;
      padding-right: 5vw;
    }
  }
`;
