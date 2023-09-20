import React, { useEffect } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import moment from "moment";
import Axios from "../apis/Axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Carousel from "react-material-ui-carousel";

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

interface Image {
  src: string;
}
interface props {
  postProps: any;
  setZoom: (b: boolean) => void;
}
interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

const PostZoom = ({ postProps, setZoom }: props) => {
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const queryClient = useQueryClient();

  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  const like = useMutation(() => Axios.patch(`post/${postProps.id}/like`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);

      queryClient.invalidateQueries(["todayendliked"]);

      queryClient.invalidateQueries(["noticePosts"]);
      queryClient.invalidateQueries(["infoPosts"]);
      queryClient.invalidateQueries(["communityPosts"]);
      queryClient.invalidateQueries(["feed"]);

      queryClient.invalidateQueries(["userLikedPosts"]);
      queryClient.invalidateQueries(["userInfoPosts"]);
      queryClient.invalidateQueries(["userCommPosts"]);

      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);

      if (postProps.type === 0) toast.success("좋아요 완료");
      if (postProps.type === 1) toast.success("관심 등록 완료");
      if (postProps.type === 2) toast.success("좋아요 완료");
    },
    onError: (err: CustomError) => {
      toast.error(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const disLike = useMutation(() => Axios.delete(`post/${postProps.id}/like`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);

      queryClient.invalidateQueries(["todayendliked"]);

      queryClient.invalidateQueries(["noticePosts"]);
      queryClient.invalidateQueries(["infoPosts"]);
      queryClient.invalidateQueries(["communityPosts"]);
      queryClient.invalidateQueries(["feed"]);

      queryClient.invalidateQueries(["userLikedPosts"]);
      queryClient.invalidateQueries(["userInfoPosts"]);
      queryClient.invalidateQueries(["userCommPosts"]);

      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);

      if (postProps.type === 0) toast.success("좋아요 취소 완료");
      if (postProps.type === 1) toast.success("관심 해제 완료");
      if (postProps.type === 2) toast.success("좋아요 취소 완료");
    },
    onError: (err: CustomError) => {
      toast.error(err.response?.data);
      // alert(err.response?.data);
    }
  });

  const isMobile = useMediaQuery({ maxWidth: 720 });
  const isOnlyText = postProps.Images.length === 0;
  const isLiked = postProps?.Likers?.find((v: any) => v.id === user?.id);
  const arr = new Array(postProps.Images.length + 1).fill(0);

  return (
    <PostZoomBG onClick={() => setZoom(false)}>
      {
        //dasktop + only text
        !isMobile && isOnlyText && (
          <OnlyText onClick={(e) => e.stopPropagation()}>
            <div>
              {postProps?.User?.profilePic ? (
                <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                  <ProfilePic width={150} alt="userProfilePic" src={`${BACK_SERVER}/${postProps?.User?.profilePic}`} />
                </Link>
              ) : (
                <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                  <ProfilePic
                    width={150}
                    alt="userProfilePic"
                    src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                  />
                </Link>
              )}
              <div>
                <span>{postProps.User.nickname}</span>
                <span>{postProps.User.email}</span>
              </div>
              <span>{moment(postProps?.createdAt).fromNow()}</span>
            </div>
            <div>
              <Content>{postProps.content}</Content>
              {postProps.type === 1 && (
                <SubContentWrapper onClick={() => setZoom(true)}>
                  <PostStartEnd>
                    <span>
                      <CalendarMonthIcon />
                    </span>
                    <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                    <span>~</span>
                    <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                  </PostStartEnd>
                  {postProps?.link && (
                    <PostLink>
                      <InsertLinkIcon />
                      <span>
                        <a target="_blank" href={`https://${postProps?.link}`} rel="noreferrer">
                          https://{postProps?.link}
                        </a>
                      </span>
                    </PostLink>
                  )}
                  {true && (
                    <PostTag>
                      {["태그1", "태그2", "태그3", "태그4", "태그5", "태그6"].map((v, i) => (
                        <button key={"태그" + v + i}>{v}</button>
                      ))}
                    </PostTag>
                  )}
                </SubContentWrapper>
              )}
              <Like>
                <button
                  onClick={() => {
                    if (!isLiked) {
                      like.mutate();
                    } else {
                      disLike.mutate();
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
            </div>
            <CancelBtn onClick={() => setZoom(false)}>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          </OnlyText>
        )
      }
      {
        //desktop + image + text
        !isMobile && !isOnlyText && (
          <ImageText onClick={(e) => e.stopPropagation()}>
            <div>
              {postProps.Images?.length === 1 && <Image src={`${BACK_SERVER}/${postProps.Images[0].src}`} />}
              {postProps.Images?.length >= 2 && (
                <Carousel indicators={true} autoPlay={false} animation="fade">
                  {postProps.Images?.map((v: Image, i: number) => (
                    <ImageBox key={i}>
                      <Image src={`${BACK_SERVER}/${v?.src}`} />
                    </ImageBox>
                  ))}
                </Carousel>
              )}
            </div>
            <div>
              <div>
                <div>
                  {postProps?.User?.profilePic ? (
                    <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                      <ProfilePicSM
                        width={150}
                        alt="userProfilePic"
                        src={`${BACK_SERVER}/${postProps?.User?.profilePic}`}
                      />
                    </Link>
                  ) : (
                    <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                      <ProfilePicSM
                        width={150}
                        alt="userProfilePic"
                        src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                      />
                    </Link>
                  )}
                  <span>{postProps.User.nickname}</span>
                </div>

                <span>{moment(postProps?.createdAt).fromNow()}</span>
              </div>
              <Content>{postProps.content}</Content>
              {postProps.type === 1 && (
                <SubContentWrapper onClick={() => setZoom(true)}>
                  <PostStartEnd>
                    <span>
                      <CalendarMonthIcon />
                    </span>
                    <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                    <span>~</span>
                    <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                  </PostStartEnd>
                  {postProps?.link && (
                    <PostLink>
                      <InsertLinkIcon />
                      <span>
                        <a target="_blank" href={`https://${postProps?.link}`} rel="noreferrer">
                          https://{postProps?.link}
                        </a>
                      </span>
                    </PostLink>
                  )}
                  {true && (
                    <PostTag>
                      {["태그1", "태그2", "태그3", "태그4", "태그5", "태그6"].map((v, i) => (
                        <button key={"태그" + v + i}>{v}</button>
                      ))}
                    </PostTag>
                  )}
                </SubContentWrapper>
              )}
              <Like>
                <button
                  onClick={() => {
                    if (!isLiked) {
                      like.mutate();
                    } else {
                      disLike.mutate();
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
            </div>
            <CancelBtn onClick={() => setZoom(false)}>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          </ImageText>
        )
      }
      {
        //mobile
        isMobile && (
          <Mobile onClick={(e) => e.stopPropagation()}>
            {/* only text */}
            {postProps.Images?.length === 0 && (
              <div>
                <MobilePostInfo>
                  <div>
                    {postProps?.User?.profilePic ? (
                      <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                        <ProfilePicSM
                          width={150}
                          alt="userProfilePic"
                          src={`${BACK_SERVER}/${postProps?.User?.profilePic}`}
                        />
                      </Link>
                    ) : (
                      <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                        <ProfilePicSM
                          width={150}
                          alt="userProfilePic"
                          src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                        />
                      </Link>
                    )}
                    <span>{postProps.User.nickname}</span>
                  </div>

                  <span>{moment(postProps?.createdAt).fromNow()}</span>
                </MobilePostInfo>
                <TextBox key="텍스트페이지">
                  <div>{postProps.content}</div>
                  {postProps.type === 1 && (
                    <SubContentWrapper onClick={() => setZoom(true)}>
                      <PostStartEnd>
                        <span>
                          <CalendarMonthIcon />
                        </span>
                        <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                        <span>~</span>
                        <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                      </PostStartEnd>
                      {postProps?.link && (
                        <PostLink>
                          <InsertLinkIcon />
                          <span>
                            <a target="_blank" href={`https://${postProps?.link}`} rel="noreferrer">
                              https://{postProps?.link}
                            </a>
                          </span>
                        </PostLink>
                      )}
                      {true && (
                        <PostTag>
                          {["태그1", "태그2", "태그3", "태그4", "태그5", "태그6"].map((v, i) => (
                            <button key={"태그" + v + i}>{v}</button>
                          ))}
                        </PostTag>
                      )}
                    </SubContentWrapper>
                  )}
                  <Like>
                    <button
                      onClick={() => {
                        if (!isLiked) {
                          like.mutate();
                        } else {
                          disLike.mutate();
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
                </TextBox>
                <MobileCancelBtn onClick={() => setZoom(false)}>
                  <CloseIcon />
                </MobileCancelBtn>
              </div>
            )}
            {/* image + text */}
            {postProps.Images?.length !== 0 && (
              <div>
                <MobilePostInfo>
                  <div>
                    {postProps?.User?.profilePic ? (
                      <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                        <ProfilePicSM
                          width={150}
                          alt="userProfilePic"
                          src={`${BACK_SERVER}/${postProps?.User?.profilePic}`}
                        />
                      </Link>
                    ) : (
                      <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                        <ProfilePicSM
                          width={150}
                          alt="userProfilePic"
                          src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                        />
                      </Link>
                    )}
                    <span>{postProps.User.nickname}</span>
                  </div>

                  <span>{moment(postProps?.createdAt).fromNow()}</span>
                </MobilePostInfo>
                <CustomCarousel
                  swipe={false}
                  navButtonsAlwaysVisible={true}
                  fullHeightHover={true}
                  indicators={true}
                  autoPlay={false}
                  navButtonsProps={{
                    style: {
                      backgroundColor: "rgba(0,0,0,0.2)"
                    }
                  }}
                  animation="fade"
                >
                  {arr.map((v, i) => {
                    if (i === 0) {
                      return (
                        <TextBox key="텍스트페이지">
                          <div>{postProps.content}</div>
                          {postProps.type === 1 && (
                            <SubContentWrapper onClick={() => setZoom(true)}>
                              <PostStartEnd>
                                <span>
                                  <CalendarMonthIcon />
                                </span>
                                <span>{moment(postProps?.start).format("YY.MM.DD")}</span>
                                <span>~</span>
                                <span>{moment(postProps?.end).format("YY.MM.DD")}</span>
                              </PostStartEnd>
                              {postProps?.link && (
                                <PostLink>
                                  <InsertLinkIcon />
                                  <span>
                                    <a target="_blank" href={`https://${postProps?.link}`} rel="noreferrer">
                                      https://{postProps?.link}
                                    </a>
                                  </span>
                                </PostLink>
                              )}
                              {true && (
                                <PostTag>
                                  {["태그1", "태그2", "태그3", "태그4", "태그5", "태그6"].map((v, i) => (
                                    <button key={"태그" + v + i}>{v}</button>
                                  ))}
                                </PostTag>
                              )}
                            </SubContentWrapper>
                          )}
                          <Like>
                            <button
                              onClick={() => {
                                if (!isLiked) {
                                  like.mutate();
                                } else {
                                  disLike.mutate();
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
                        </TextBox>
                      );
                    } else {
                      return (
                        <ImageBox key={i}>{<Image src={`${BACK_SERVER}/${postProps.Images[i - 1].src}`} />}</ImageBox>
                      );
                    }
                  })}
                </CustomCarousel>
                <MobileCancelBtn onClick={() => setZoom(false)}>
                  <CloseIcon />
                </MobileCancelBtn>
              </div>
            )}
          </Mobile>
        )
      }
    </PostZoomBG>
  );
};

export default PostZoom;
const CustomCarousel = styled(Carousel)`
  height: calc(var(--vh, 1vh) * 100 - 64px - 32px);
`;
const MobileCancelBtn = styled.button`
  height: 32px;
  width: 100%;
  background-color: #a9aed4;
  color: white;
`;
const PostTag = styled.div`
  width: 100%;
  padding: 2px;
  margin-top: 12px;
  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  button {
    flex-shrink: 0;
    font-size: 16px;

    padding: 4px 12px;
    background-color: #f3e0f1;
    border-radius: 50px;
    margin-right: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
  }
`;
const SubContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  width: 90%;
  /* padding-left: 32px;
  padding-right: 32px; */

  @media screen and (max-width: 720px) {
    width: 100%;
    padding-left: 24px;
    padding-right: 24px;
  }

  font-size: 18px;

  margin: 10px 20px;
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

const CancelBtn = styled.button`
  position: absolute;
  left: 10px;
  top: 10px;

  z-index: 1005;

  color: black;

  @media screen and (max-width: 720px) {
    top: calc(100% - 50px);
    /* left: 10%; */
    /* transform: translateX(-50%); */
  }
`;
const Content = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;

  height: calc(100% - 160px);
  height: 100%;
  width: 90%;
  padding-top: 24px;

  /* padding: 16px; */

  font-size: 1.2em;
  overflow-y: scroll;
  /* overflow-x: */
  white-space: pre-wrap;
  line-height: 1.3em;
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
  @media screen and (max-width: 720px) {
    align-items: center;
    height: 60px;
  }
`;

const ProfilePic = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: white;

  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);

  object-fit: cover;
`;
const ProfilePicSM = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: white;

  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);

  object-fit: cover;
`;
const MobilePostInfo = styled.div`
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
  span {
    padding: 8px;
    font-size: 1.1em;
  }
`;
const TextBox = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 95 - 64px - 32px);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  > div:nth-child(1) {
    /* height: calc(80vh - 200px); */
    height: 50%;
    flex-grow: 1;
    width: 100%;
    white-space: pre-wrap;
    line-height: 1.3em;
    overflow-y: scroll;
    padding: 24px;

    font-size: 1.2em;
  }
`;
const ImageBox = styled.div`
  width: 100%;
  height: calc(90vh - 50px);

  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 720px) {
    /* background-color: black; */
    height: calc(80vh - 50px);
    height: calc(var(--vh, 1vh) * 95 - 64px - 32px);
  }
`;
const Image = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
  transition: all ease-in-out 1s;
`;

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

  padding-top: calc(var(--vh, 1vh) * 5);

  > button {
    padding-top: 16px;
  }
  @media screen and (max-width: 720px) {
    justify-content: start;
    height: calc(var(--vh, 1vh) * 100);
    padding-top: 0;
  }
`;
const OnlyText = styled.div`
  position: relative;
  width: 70vw;
  height: calc(var(--vh, 1vh) * 90);

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 0.7s;
  > div:first-child {
    width: 40%;
    height: 100%;
    padding: 36px;
    padding-top: 15%;

    background-color: rgba(0, 0, 0, 0.04);

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    > div:nth-child(2) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > span {
        padding: 5px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.5);
      }
      > span:first-child {
        /* font-weight: 600; */
        color: rgba(0, 0, 0, 0.7);
        font-size: 32px;
      }
    }
    > span:nth-child(3) {
      width: 100%;
      text-align: center;
      font-size: 1.1em;
    }
  }
  > div:nth-child(2) {
    width: 60%;
    height: 90%;
    /* padding: 48px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const ImageText = styled.div`
  position: relative;
  width: 90vw;
  height: 90vh;
  height: calc(var(--vh, 1vh) * 90);

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 0.7s;

  > div:first-child {
    width: 65%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.04);
  }
  > div:nth-child(2) {
    width: 35%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    > div:first-child {
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      /* padding: 0px 32px; */
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          color: rgba(0, 0, 0, 0.8);
        }
      }
      span {
        padding: 8px;
        font-size: 1.1em;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
`;

const Mobile = styled.div`
  transition: all ease-in-out 0.3s;
  position: relative;

  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 0.7s;

  > div {
    width: 100%;
    height: 100%;
  }
`;
