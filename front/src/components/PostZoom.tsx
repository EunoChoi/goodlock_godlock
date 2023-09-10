import React from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import moment from "moment";
import Axios from "../apis/Axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

//style
import Animation from "../styles/Animation";

//mui
import Carousel from "react-material-ui-carousel";
import CancelIcon from "@mui/icons-material/Cancel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
      if (window.location.pathname.split("/")[2] === "0") queryClient.invalidateQueries(["noticePosts"]);
      if (window.location.pathname.split("/")[2] === "1") queryClient.invalidateQueries(["infoPosts"]);
      if (window.location.pathname.split("/")[2] === "2") queryClient.invalidateQueries(["communityPosts"]);
      if (window.location.pathname.split("/")[1] === "userinfo") {
        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);
      }
      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);
      toast.success("좋아요 완료");
    },
    onError: (err: CustomError) => {
      toast.error(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const disLike = useMutation(() => Axios.delete(`post/${postProps.id}/like`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      if (window.location.pathname.split("/")[2] === "0") queryClient.invalidateQueries(["noticePosts"]);
      if (window.location.pathname.split("/")[2] === "1") queryClient.invalidateQueries(["infoPosts"]);
      if (window.location.pathname.split("/")[2] === "2") queryClient.invalidateQueries(["communityPosts"]);
      if (window.location.pathname.split("/")[1] === "userinfo") {
        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);
      }
      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);
      toast.success("좋아요 취소 완료");
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

  // src && <Image src={`${BACK_SERVER}/${src}`} alt="full page images" />
  // <Img key={v.src + i} src={`${BACK_SERVER}/${v?.src}`} />

  return (
    <PostZoomBG onClick={() => setZoom(false)}>
      {
        //dasktop + only text
        !isMobile && isOnlyText && (
          <>
            <OnlyText onClick={(e) => e.stopPropagation()}>
              <div>
                {postProps?.User?.profilePic ? (
                  <Link to={`/userinfo/${postProps?.User?.id}/cat/0`}>
                    <ProfilePic
                      width={150}
                      alt="userProfilePic"
                      src={`${BACK_SERVER}/${postProps?.User?.profilePic}`}
                    />
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
                <div>
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
                      {isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
                      <span>{postProps?.Likers?.length}</span>
                    </button>
                  </Like>
                  <span>{moment(postProps?.createdAt).fromNow()}</span>
                </div>
              </div>
              <div>
                <Content>{postProps.content}</Content>
              </div>
            </OnlyText>
            <CancelBtn onClick={() => setZoom(false)}>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          </>
        )
      }
      {
        //desktop + image + text
        !isMobile && !isOnlyText && (
          <>
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
                    {isLiked ? (
                      <FavoriteIcon style={{ color: "red" }} fontSize="large" />
                    ) : (
                      <FavoriteBorderIcon fontSize="large" />
                    )}
                    <span>{postProps?.Likers?.length}</span>
                  </button>
                </Like>
              </div>
            </ImageText>
            <CancelBtn onClick={() => setZoom(false)}>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          </>
        )
      }
      {
        //mobile
        isMobile && (
          <>
            <Mobile onClick={(e) => e.stopPropagation()}>
              {postProps.Images?.length === 0 && (
                <TextBox key="텍스트페이지">
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
                  <div>{postProps.content}</div>
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
                      {isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
                      <span>{postProps?.Likers?.length}</span>
                    </button>
                  </Like>
                </TextBox>
              )}
              {postProps.Images?.length !== 0 && (
                <div>
                  <Carousel indicators={true} autoPlay={false} animation="fade">
                    {arr.map((v, i) => {
                      if (i === 0) {
                        return (
                          <TextBox key="텍스트페이지">
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
                            <div>{postProps.content}</div>
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
                                {isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
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
                  </Carousel>
                </div>
              )}
            </Mobile>
            <CancelBtn onClick={() => setZoom(false)}>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          </>
        )
      }
    </PostZoomBG>
  );
};

export default PostZoom;

const CancelBtn = styled.button`
  color: white;
`;
const Content = styled.div`
  display: flex;
  align-items: start;
  height: 100%;

  font-size: 1.2em;
  overflow-y: scroll;
  /* overflow-x: */
  white-space: pre-wrap;
  line-height: 1.3em;
`;
const Like = styled.div`
  /* margin-top: 12px;
  margin-bottom: 24px; */
  span {
    font-size: 1.5em;
    margin-left: 4px;
  }
  button {
    display: flex;
    align-items: center;
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

  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);

  object-fit: cover;
`;

const TextBox = styled.div`
  width: 100%;
  height: calc(80vh - 50px);

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  > div:first-child {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    span {
      padding: 8px;
      font-size: 1.1em;
    }
  }
  > div:nth-child(2) {
    height: calc(80vh - 190px);
    width: 100%;
    white-space: pre-wrap;
    line-height: 1.3em;
    overflow-y: scroll;
    padding: 12px 24px;

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
    height: calc(80vh - 50px);
  }
`;
const Image = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
  transition: all ease-in-out 1s;
`;

const PostZoomBG = styled.div`
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > button {
    padding-top: 16px;
  }
`;
const OnlyText = styled.div`
  width: 70vw;
  height: 90vh;

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

    background-color: rgba(0, 0, 0, 0.025);

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
        font-size: 1.3em;
      }
      > span:first-child {
        font-weight: 600;
        font-size: 1.5em;
      }
    }
    > div:nth-child(3) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1em;
    }
  }
  > div:nth-child(2) {
    width: 60%;
    height: 100%;
    padding: 48px;
  }
`;

const ImageText = styled.div`
  width: 90vw;
  height: 90vh;

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
      }
      span {
        padding: 8px;
        font-size: 1.1em;
      }
      span:first-child {
        font-weight: 800;
      }
    }
    > div:nth-child(2) {
      height: calc(100% - 160px);
      width: 100%;
      padding: 32px;
    }
    > div:nth-child(3) {
      height: 80px;
      width: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const Mobile = styled.div`
  width: 90vw;
  height: 80vh;

  padding-bottom: 24px;

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