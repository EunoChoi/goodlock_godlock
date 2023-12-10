import React from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import moment from "moment";
import CustomCarousel from "./common/CustomCarousel";
import ProgressiveImage from "react-progressive-graceful-image";

//style
import Animation from "../styles/Animation";

//mui
import CancelIcon from "@mui/icons-material/Cancel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import CloseIcon from "@mui/icons-material/Close";
import IsMobile from "../functions/IsMobile";
import Post from "../functions/reactQuery/Post";
import User from "../functions/reactQuery/User";
import ProfileCircle from "../styles/ProfileCircle";

interface Image {
  src: string;
}
interface props {
  postProps: any;
  modalClose: () => void;
}

const PostZoom = ({ postProps, modalClose }: props) => {
  const user = User.getData();
  const postHaveDate = postProps?.start && postProps?.end;
  const postHaveLink = postProps?.link && true;

  //useMutation
  const like = Post.like();
  const disLike = Post.disLike();

  //local
  const isMobile = IsMobile();
  const makeCorectUrl = (url: string) => {
    url = url.toLowerCase();
    return "https://" + url.replace("https:/", "").replace("http:/", "");
  };

  const isOnlyText = postProps.Images.length === 0;
  const isLiked = postProps?.Likers?.find((v: any) => v.id === user?.id);

  return (
    <PostZoomBG
      onClick={() => {
        modalClose();
      }}
    >
      {
        //dasktop + only text
        !isMobile && isOnlyText && (
          <PCTextPost onClick={(e) => e.stopPropagation()}>
            <PCTextPost_Left>
              <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                {postProps?.User?.profilePic ? (
                  <ProfileCircle
                    diameter={150}
                    src={`${postProps?.User?.profilePic}`}
                    alt="profilePic"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/img/defaultProfilePic.png`;
                      e.currentTarget.src = `${postProps?.User?.profilePic.replace(/\/thumb\//, "/original/")}`;
                    }}
                  ></ProfileCircle>
                ) : (
                  <ProfileCircle
                    diameter={150}
                    src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                    alt="profilePic"
                  ></ProfileCircle>
                )}
              </Link>

              <div>
                <span id="nickname">{postProps.User.nickname}</span>
                <span id="email">{postProps.User.email}</span>
              </div>
              <span id="time">{moment(postProps?.createdAt).fromNow()}</span>
            </PCTextPost_Left>
            <PCTextPost_Right>
              <PCText>{postProps.content}</PCText>
              {(postHaveDate || postHaveLink) && (
                <SubContent>
                  {postHaveDate && (
                    <PostStartEnd>
                      <span>
                        <CalendarMonthIcon />
                      </span>
                      <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                      <span>~</span>
                      <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                    </PostStartEnd>
                  )}

                  {postHaveLink && (
                    <PostLink>
                      <InsertLinkIcon />
                      <span>
                        <a target="_blank" href={makeCorectUrl(postProps?.link)} rel="noreferrer">
                          {makeCorectUrl(postProps?.link)}
                        </a>
                      </span>
                    </PostLink>
                  )}
                </SubContent>
              )}

              <Like>
                <button
                  onClick={() => {
                    if (!isLiked) {
                      like.mutate(postProps.id);
                    } else {
                      disLike.mutate(postProps.id);
                    }
                  }}
                >
                  {postProps.type === 1 &&
                    (isLiked ? <BookmarkIcon style={{ color: "#a9aed4" }} /> : <BookmarkBorderIcon />)}
                  {postProps.type === 1 ||
                    (isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />)}
                  <span>{postProps?.Likers?.length}</span>
                </button>
              </Like>
            </PCTextPost_Right>
            <PCCancelBtn onClick={() => modalClose()}>
              <CancelIcon fontSize="large" />
            </PCCancelBtn>
          </PCTextPost>
        )
      }
      {
        //desktop + image + text
        !isMobile && !isOnlyText && (
          <PCImagePost onClick={(e) => e.stopPropagation()}>
            <PCImagePost_LeftWrapper>
              <CustomCarousel indicator={postProps.Images.length === 1 ? false : true}>
                {postProps.Images?.map((v: Image, i: number) => (
                  <ImageBox key={i + v.src}>
                    <ProgressiveImage src={v?.src.replace(/\/thumb\//, "/original/")} placeholder={v?.src}>
                      {(src, loading) => (
                        <Image
                          className={`image${loading ? " loading" : " loaded"}`}
                          src={src}
                          alt="sea beach"
                          width="700"
                          height="465"
                        />
                      )}
                    </ProgressiveImage>
                  </ImageBox>
                ))}
              </CustomCarousel>
            </PCImagePost_LeftWrapper>
            <PCImagePost_RightWrapper>
              <PCImagePost_Info>
                <div>
                  <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                    {postProps?.User?.profilePic ? (
                      <ProfileCircle
                        diameter={40}
                        src={`${postProps?.User?.profilePic}`}
                        alt="profilePic"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `${postProps?.User?.profilePic.replace(/\/thumb\//, "/original/")}`;
                        }}
                      ></ProfileCircle>
                    ) : (
                      <ProfileCircle
                        diameter={40}
                        src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                        alt="profilePic"
                      ></ProfileCircle>
                    )}
                  </Link>
                  <span>{postProps.User.nickname}</span>
                </div>
                <span>{moment(postProps?.createdAt).fromNow()}</span>
              </PCImagePost_Info>
              <PCText>{postProps.content}</PCText>

              {(postHaveDate || postHaveLink) && (
                <SubContent>
                  {postHaveDate && (
                    <PostStartEnd>
                      <span>
                        <CalendarMonthIcon />
                      </span>
                      <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                      <span>~</span>
                      <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                    </PostStartEnd>
                  )}
                  {postHaveLink && (
                    <PostLink>
                      <InsertLinkIcon />
                      <span>
                        <a target="_blank" href={makeCorectUrl(postProps?.link)} rel="noreferrer">
                          {makeCorectUrl(postProps?.link)}
                        </a>
                      </span>
                    </PostLink>
                  )}
                </SubContent>
              )}

              <Like>
                <button
                  onClick={() => {
                    if (!isLiked) {
                      like.mutate(postProps.id);
                    } else {
                      disLike.mutate(postProps.id);
                    }
                  }}
                >
                  {postProps.type === 1 &&
                    (isLiked ? <BookmarkIcon style={{ color: "#a9aed4" }} /> : <BookmarkBorderIcon />)}
                  {postProps.type === 1 ||
                    (isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />)}
                  <span>{postProps?.Likers?.length}</span>
                </button>
              </Like>
            </PCImagePost_RightWrapper>
            <PCCancelBtn onClick={() => modalClose()}>
              <CancelIcon fontSize="large" />
            </PCCancelBtn>
          </PCImagePost>
        )
      }
      {
        //mobile
        isMobile && (
          <MobileWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MobilePost>
              <MobilePostInfo>
                <div>
                  <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                    {postProps?.User?.profilePic ? (
                      <ProfileCircle
                        diameter={40}
                        src={`${postProps?.User?.profilePic}`}
                        alt="profilePic"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `${postProps?.User?.profilePic.replace(/\/thumb\//, "/original/")}`;
                        }}
                      ></ProfileCircle>
                    ) : (
                      <ProfileCircle
                        diameter={40}
                        src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                        alt="profilePic"
                      ></ProfileCircle>
                    )}
                  </Link>
                  <Nickname>{postProps.User.nickname}</Nickname>
                </div>
                <span>{moment(postProps?.createdAt).fromNow()}</span>
              </MobilePostInfo>

              <CustomCarousel indicator={postProps.Images.length === 0 ? false : true}>
                {postProps.Images?.map((v: Image, i: number) => (
                  <ImageBox key={i + v.src}>
                    <ProgressiveImage src={v?.src.replace(/\/thumb\//, "/original/")} placeholder={v?.src}>
                      {(src, loading) => (
                        <Image
                          className={`image${loading ? " loading" : " loaded"}`}
                          src={src}
                          alt="sea beach"
                          width="700"
                          height="465"
                        />
                      )}
                    </ProgressiveImage>
                  </ImageBox>
                ))}
                <MobileText key="text">
                  <div id="content">{postProps.content}</div>
                  {(postHaveDate || postHaveLink) && (
                    <SubContent>
                      {postHaveDate && (
                        <PostStartEnd>
                          <span>
                            <CalendarMonthIcon />
                          </span>
                          <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                          <span>~</span>
                          <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                        </PostStartEnd>
                      )}
                      {postHaveLink && (
                        <PostLink>
                          <InsertLinkIcon />
                          <span>
                            <a target="_blank" href={makeCorectUrl(postProps?.link)} rel="noreferrer">
                              {makeCorectUrl(postProps?.link)}
                            </a>
                          </span>
                        </PostLink>
                      )}
                    </SubContent>
                  )}
                </MobileText>
              </CustomCarousel>
              <MobilePostMenu>
                <button id="close" onClick={() => modalClose()}>
                  <CloseIcon />
                  <span>Close</span>
                </button>
                <button
                  id="likeBtn"
                  onClick={() => {
                    if (!isLiked) {
                      like.mutate(postProps.id);
                    } else {
                      disLike.mutate(postProps.id);
                    }
                  }}
                >
                  {postProps.type === 1 &&
                    (isLiked ? <BookmarkIcon style={{ color: "#a9aed4" }} /> : <BookmarkBorderIcon />)}
                  {postProps.type === 1 ||
                    (isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />)}
                  <span>{postProps?.Likers?.length}</span>
                </button>
              </MobilePostMenu>
            </MobilePost>
          </MobileWrapper>
        )
      }
    </PostZoomBG>
  );
};

export default PostZoom;

const MobilePostMenu = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  height: 32px;
  padding: 0 12px;

  background-color: #c8daf3;
  #close {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0.7);
    span {
      font-size: 20px;
      font-weight: 500;
    }
  }
  #likeBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0.7);
    span {
      margin-left: 8px;
      font-size: 20px;
      font-weight: 500;
    }
  }
`;

const Nickname = styled.span`
  font-weight: 500;
  font-weight: 600;

  /* max-width: 50%; */
  overflow: hidden;
  text-overflow: ellipsis;

  padding: 8px;
  font-size: 1.2em !important;
`;

//share range, link component
const SubContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  width: 100%;

  margin-top: 12px;

  font-size: 18px;
  @media (orientation: portrait) or (max-height: 480px) {
    width: 100%;
    margin-top: 0px;
    padding: 8px 24px;
  }

  > div {
    display: flex;
    justify-content: start;
    align-items: center;
  }
`;
const PostStartEnd = styled.div`
  span {
    margin-right: 4px;
  }
  span:first-child {
    color: #be303e;
  }
`;
const PostLink = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  span {
    color: #5974af;
    text-decoration-line: underline;
    margin-left: 4px;
  }
`;
const Like = styled.div`
  height: 50px;
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 1.5em;
    margin-left: 4px;
  }
  button {
    display: flex;
    align-items: center;
  }
  @media (orientation: portrait) or (max-height: 480px) {
    align-items: center;
    height: 60px;
  }
`;

//image
const ImageBox = styled.div`
  width: 100%;
  height: 90vh;

  display: flex;
  justify-content: center;
  align-items: center;
  @media (orientation: portrait) or (max-height: 480px) {
    //top height 64px
    //bottom height 60px + 32px
    //indicator height 30px
    height: calc(100vh - 64px - 60px - 32px - 30px);
    height: calc(var(--vh, 1vh) * 100 - 64px - 32px - 30px);
    margin-bottom: 30px;
    flex-grow: 1;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
  transition: all ease-in-out 1s;
`;

//pc post zoom
const PostZoomBG = styled.div`
  overflow: hidden;

  z-index: 1002;
  position: fixed;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  padding-top: 5vh;

  > button {
    padding-top: 16px;
  }
  @media (orientation: portrait) or (max-height: 480px) {
    justify-content: start;
    /* height: calc(var(--vh, 1vh) * 100); */
    padding-top: 0;
  }
`;
const PCTextPost = styled.div`
  position: relative;
  width: 70vw;
  height: 90vh;

  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 0.7s;
`;
const PCTextPost_Left = styled.div`
  width: 40%;
  height: 100%;
  padding: 36px 20px;
  padding-top: 15%;

  background-color: rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  #nickname,
  #email,
  #time {
    text-align: center !important;
    max-width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    /* text-overflow: ellipsis; */

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
  #nickname {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
    font-size: 32px;
  }
  #email {
    padding: 5px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.4);
  }
  #time {
    width: 100%;
    text-align: center;
    font-size: 1.1em;
  }

  align-items: center;
  > div:nth-child(2) {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
const PCTextPost_Right = styled.div`
  width: 60%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const PCImagePost = styled.div`
  position: relative;
  width: 90vw;
  height: 90vh;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 0.7s;
`;
const PCImagePost_LeftWrapper = styled.div`
  width: 65%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.04);
`;
const PCImagePost_RightWrapper = styled.div`
  width: 35%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 24px;
`;
const PCImagePost_Info = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  div {
    width: 70%;
    display: flex;
    justify-content: start;
    align-items: center;
    span {
      font-size: 1.1em;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.9);
    }
  }
  span {
    white-space: nowrap;
    padding: 8px 0;
    font-size: 1em;
    color: rgba(0, 0, 0, 0.5);
  }
`;
const PCText = styled.div`
  width: 100%;
  height: 50%;
  flex-grow: 1;

  padding: 16px 0;

  font-size: 1.2em;
  overflow-y: scroll;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.3em;

  /* color: rgba(0, 0, 0, 0.8); */
`;
const PCCancelBtn = styled.button`
  position: absolute;
  left: 10px;
  top: 10px;

  z-index: 1005;

  color: black;

  @media (orientation: portrait) or (max-height: 480px) {
    top: calc(100% - 50px);
    /* left: 10%; */
    /* transform: translateX(-50%); */
  }
`;

//mobile post zoom
const MobileWrapper = styled.div`
  transition: all ease-in-out 0.5s;
  position: relative;

  bottom: 0;
  left: 0;

  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 0.7s;
`;
const MobilePost = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const MobileText = styled.div`
  width: 100%;
  //top height 64px
  //bottom height 32px
  //indicator 30px
  height: calc(100vh - 64px - 32px - 30px);
  height: calc(var(--vh, 1vh) * 100 - 64px - 32px - 30px);
  margin-bottom: 30px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  #content {
    text-align: start;
    overflow-y: scroll;
    overflow-wrap: break-word;
    white-space: pre-wrap;

    height: 0px;
    width: 100%;
    flex-grow: 1;
    padding: 20px 24px;

    /* font-weight: 500; */
    font-size: 1.2em;
    line-height: 1.3em;
  }
`;
const MobilePostInfo = styled.div`
  //component height = 64px
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  height: 64px;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
