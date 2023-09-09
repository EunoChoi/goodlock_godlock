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
  const navigate = useNavigate();

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
          <PostTitle>공지사항</PostTitle>
          <InfiniteScroll
            scrollableTarget="scrollWrapper"
            hasMore={noticePosts.hasNextPage || false}
            loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
            next={() => noticePosts.fetchNextPage()}
            dataLength={noticePosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {noticePosts?.data?.pages.map((p) => p.map((v: postProps, i: number) => <Post key={i} postProps={v} />))}
          </InfiniteScroll>
        </>
      )}
      {type === 1 && (
        <>
          <PostTitle>모집공고</PostTitle>
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
          <PostTitle>소통</PostTitle>
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
