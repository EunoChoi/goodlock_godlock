import React, { RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../apis/Axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";

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

const Main = () => {
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;

  const [toggle, setToggle] = useState<number>(0);

  const navigate = useNavigate();

  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  useEffect(() => {
    if (type < 0 || type >= 3) {
      navigate("/404");
    }
  }, [type]);

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

  return (
    <AppLayout>
      {type === 0 && (
        <>
          <WelcomeWrapper>
            <span>좋은 오후입니다.</span>
            <span>{user?.nickname}님! 👋🏻</span>
            <span>오늘도 행복한 하루를 만들어 보아요 :)</span>

            <RowWrapper>
              <Pill>????</Pill>
            </RowWrapper>

            <RowWrapper>
              <Temp>무언가 들어갈 영역</Temp>
              <Temp>무언가 들어갈 영역</Temp>
              <Temp>무언가 들어갈 영역</Temp>
            </RowWrapper>

            <RowWrapper>
              <Pill2
                toggle={toggle}
                onClick={() => {
                  setToggle(0);
                }}
              >
                공지사항
              </Pill2>
              <Pill2
                toggle={toggle}
                onClick={() => {
                  setToggle(1);
                }}
              >
                피드
              </Pill2>
            </RowWrapper>
          </WelcomeWrapper>

          {toggle === 0 && (
            <InfiniteScroll
              scrollableTarget="scrollWrapper"
              hasMore={noticePosts.hasNextPage || false}
              loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
              next={() => noticePosts.fetchNextPage()}
              dataLength={noticePosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
            >
              {noticePosts?.data?.pages.map((p) => p.map((v: postProps, i: number) => <Post key={i} postProps={v} />))}
            </InfiniteScroll>
          )}
        </>
      )}
      {type === 1 && (
        <>
          <WelcomeWrapper>
            <span>모집공고</span>
            <span></span>
            <span>모집공고 설명 ---- </span>

            <RowWrapper>
              <Pill>모두</Pill>
              <Pill>마감 공고 제외</Pill>
              <Pill>검색</Pill>
            </RowWrapper>
          </WelcomeWrapper>
          <InfiniteScroll
            scrollableTarget="scrollWrapper"
            hasMore={infoPosts.hasNextPage || false}
            loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
            next={() => infoPosts.fetchNextPage()}
            dataLength={infoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {infoPosts?.data?.pages.map((p) => p.map((v: postProps, i: number) => <Post key={i} postProps={v} />))}
          </InfiniteScroll>
        </>
      )}
      {type === 2 && (
        <>
          <WelcomeWrapper>
            <span>소통</span>
            <span></span>
            <span>소통 게시글 설명 ---- </span>

            <RowWrapper>
              <Pill>모두</Pill>
              <Pill>검색</Pill>
            </RowWrapper>
          </WelcomeWrapper>
          <InfiniteScroll
            scrollableTarget="scrollWrapper"
            hasMore={communityPosts.hasNextPage || false}
            loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
            next={() => communityPosts.fetchNextPage()}
            dataLength={communityPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {communityPosts?.data?.pages.map((p) => p.map((v: postProps, i: number) => <Post key={i} postProps={v} />))}
          </InfiniteScroll>
        </>
      )}
    </AppLayout>
  );
};

export default Main;

const Temp = styled.div`
  height: 80px;
  width: 80px;

  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  /* margin: 16px 0; */
  margin-right: 8px;
`;

const RowWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;

  padding: 5px;

  width: 100%;
  overflow-x: scroll;
`;
const Pill = styled.div`
  margin-right: 8px;
  padding: 8px 16px;
  margin-top: 40px;
  margin-bottom: 16px;
  margin-right: 12px;
  font-size: 18px;
  font-weight: 600;

  display: flex;
  align-items: center;

  border-radius: 100px;
  background-color: #e0d9ec;
  color: #464b53;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
`;
const Pill2 = styled.div<{ toggle: number }>`
  margin-right: 8px;
  padding: 8px 16px;
  margin-top: 40px;
  margin-bottom: 16px;
  margin-right: 12px;
  font-size: 18px;
  font-weight: 600;

  display: flex;
  align-items: center;

  border-radius: 100px;
  background-color: #e0d9ec;
  color: #464b53;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  &:nth-child(${(props) => props.toggle + 1}) {
    background-color: #d5dbf1;
  }
`;
const WelcomeWrapper = styled.div`
  width: 500px;
  /* height: 500px; */
  margin-top: 64px;
  /* margin-bottom: 12px; */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  > span:first-child,
  > span:nth-child(2) {
    margin-left: 5px;
    font-size: 32px;
    font-weight: 600;
    line-height: 36px;
    color: #464b53;
    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }
  > span:nth-child(3) {
    font-size: 20px;
    font-weight: 400;
    color: grey;

    margin: 32px 0;
    margin-bottom: 0;
    margin-left: 5px;
    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }
  @media screen and (max-width: 720px) {
    width: 92vw;
    /* padding: 0 12px; */
    padding-top: 60px;
  }
`;
const PostTitle = styled.div`
  font-size: 1.6em;
  font-weight: 600;
  color: gray;
  margin: 30px 0px;
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 720px) {
    color: white;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 80px;
  }
`;
