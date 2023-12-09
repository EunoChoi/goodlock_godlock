import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Animation from "../../styles/Animation";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

import Axios from "../../apis/Axios";

//function
import IsMobile from "../../functions/IsMobile";

//mui
import CircularProgress from "@mui/material/CircularProgress";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const Gallery = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggle, setToggle] = useState<number>(0);
  const [cols, setCols] = useState<number>(3);

  const isMobile = IsMobile();
  const navigate = useNavigate();

  //load posts
  const tipImages = useInfiniteQuery(
    ["tipImages"],
    ({ pageParam = 1 }) =>
      Axios.get("image", { params: { type: 1, pageParam, tempDataNum: 50 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const freeImages = useInfiniteQuery(
    ["freeImages"],
    ({ pageParam = 1 }) =>
      Axios.get("image", { params: { type: 2, pageParam, tempDataNum: 50 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [type]);

  useEffect(() => {
    if (isMobile) {
      setCols(2);
    } else {
      setCols(3);
    }
  }, [isMobile]);

  return (
    <Wrapper>
      <TextWrapper ref={scrollTarget}>
        <TextWrapper_Title>Gallery</TextWrapper_Title>
        <Space height={32}></Space>
        <TextWrapper_Normal>이미지만 따로 모아서 보여주는 게시판입니다.</TextWrapper_Normal>
        <TextWrapper_Normal>이미지를 누르면 게시글로 이동합니다.</TextWrapper_Normal>
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
          Tip Posts
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
          Free Posts
        </Pill.Sub>
      </Pill.Wrapper>
      {toggle == 0 && (
        <Images>
          <InfiniteScroll
            hasMore={tipImages.hasNextPage || false}
            loader={
              <LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </LoadingIconWrapper>
            }
            next={() => tipImages.fetchNextPage()}
            dataLength={tipImages.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {tipImages?.data?.pages.map((p, i) => (
              <ImageList key={i} variant="masonry" cols={cols} gap={12}>
                {p.map((image: { src: string; PostId: number }) => (
                  <ImageListItem key={image.src}>
                    <img
                      onClick={() => {
                        navigate(`/postview/${image.PostId}`);
                      }}
                      srcSet={`${image.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${image.src}?w=248&fit=crop&auto=format`}
                      alt={image.src}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ))}
          </InfiniteScroll>
        </Images>
      )}
      {toggle == 1 && (
        <Images>
          <InfiniteScroll
            hasMore={freeImages.hasNextPage || false}
            loader={
              <LoadingIconWrapper>
                <CircularProgress size={96} color="inherit" />
              </LoadingIconWrapper>
            }
            next={() => freeImages.fetchNextPage()}
            dataLength={freeImages.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
          >
            {freeImages?.data?.pages.map((p, i) => (
              <ImageList key={i} variant="masonry" cols={cols} gap={8}>
                {p.map((image: { src: string; PostId: number }) => (
                  <ImageListItem key={image.src}>
                    <img
                      onClick={() => {
                        navigate(`/postview/${image.PostId}`);
                      }}
                      srcSet={`${image.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${image.src}?w=248&fit=crop&auto=format`}
                      alt={image.src}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ))}
          </InfiniteScroll>
        </Images>
      )}
    </Wrapper>
  );
};

export default Gallery;

const LoadingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3e0f1;
  margin: 32px 0;
`;

const Images = styled.div`
  animation: ${Animation.smoothAppear} 1s ease-in-out;

  width: 90%;
  min-height: 100vh;
  .MuiImageListItem-img {
    /* border: solid 3px rgba(0, 0, 0, 0.1); */
    border-radius: 8px;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @media (orientation: portrait) and (max-width: 480px) {
    width: 95%;
  }
`;

const Wrapper = styled.div`
  animation: ${Animation.smoothAppear} 1s ease-in-out;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* background-color: #fff; */
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

    width: 90%;
    overflow-x: scroll;

    @media (orientation: portrait) or (max-height: 480px) {
      top: 48px;
      top: 46px;
      /* background-color: #c8daf3; */
      /* background-color: #fff; */
      width: 100%;
      padding: 24px 4vw;
    }
    @media (orientation: landscape) and (max-height: 480px) {
      width: 90%;
      padding-left: 0;
      padding-right: 0;
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
    flex-shrink: 0;
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
  width: 90%;
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
    width: 90%;
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

  color: rgba(0, 0, 0, 0.7);
`;
const TextWrapper_Normal = styled.span`
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;

  color: rgba(0, 0, 0, 0.55);
`;