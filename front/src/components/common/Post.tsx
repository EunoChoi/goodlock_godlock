import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

//components
import Comment from "./Comment";
import CommentInputForm from "./CommentInputForm";
import PostEditPopup from "./PostEditPopup";
import PostZoom from "../PostZoom";

//mui
import Carousel from "react-material-ui-carousel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popper from "@mui/material/Popper";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import Axios from "../../apis/Axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Image {
  src: string;
}

interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

moment.locale("ko");

const Post = ({ postProps }: any) => {
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const queryClient = useQueryClient();

  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  const [commentLoadLength, setCommentLoadLength] = useState<number>(5);
  const [isZoom, setZoom] = useState<boolean>(false);
  const [isPostEdit, setPostEdit] = useState<boolean>(false);
  const [isCommentOpen, setCommentOpen] = useState<boolean>(false);
  const [morePop, setMorePop] = useState<null | HTMLElement>(null);

  const isLiked = postProps?.Likers?.find((v: any) => v.id === user?.id);
  const isFollowed = user?.Followings?.find((v: any) => v.id === postProps.UserId);
  const isMyPost = user?.id === postProps?.UserId;

  const commentScroll = useRef<null | HTMLDivElement>(null);

  const open = Boolean(morePop);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

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

  const deletePost = useMutation(() => Axios.delete(`post/${postProps.id}`), {
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
      toast.success("게시글 삭제 완료");
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });

  // const follow = useMutation(() => Axios.patch(`user/${postProps.UserId}/follow`), {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["user"]);
  //     toast.success("팔로우 완료");
  //   },
  //   onError: (err: CustomError) => {
  //     toast.warning(err.response?.data);
  //     // alert(err.response?.data);
  //   }
  // });
  // const unFollow = useMutation(() => Axios.delete(`user/${postProps.UserId}/follow`), {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["user"]);
  //     toast.success("언팔로우 완료");
  //   },
  //   onError: (err: CustomError) => {
  //     toast.warning(err.response?.data);
  //     // alert(err.response?.data);
  //   }
  // });

  return (
    <PostWrapper onClick={() => setMorePop(null)}>
      {isZoom && <PostZoom postProps={postProps} setZoom={setZoom} />}
      <Popper open={open} anchorEl={morePop} placement="top-end">
        <EditPopup>
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              setMorePop(null);
              setPostEdit((c) => !c);
            }}
          >
            <EditIcon />
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => {
              setMorePop(null);
              confirmAlert({
                // title: "",
                message: "게시글을 삭제 하시겠습니까?",
                buttons: [
                  {
                    label: "확인",
                    onClick: () => deletePost.mutate()
                  },
                  {
                    label: "취소",
                    onClick: () => console.log("취소")
                  }
                ]
              });
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </EditPopup>
      </Popper>

      {/* 포스트 수정 팝업 */}
      {isPostEdit ? (
        <PostEditPopup
          setPostEdit={setPostEdit}
          postProps={{ type: postProps.type, id: postProps.id, content: postProps.content, images: postProps.Images }}
        />
      ) : null}
      <PostInfoWrapper>
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
          <span>{postProps?.User?.nickname}</span>
          {/* {!isMyPost &&
            (isFollowed ? (
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => {
                  confirmAlert({
                    // title: "",
                    message: "언팔로우 하시겠습니까?",
                    buttons: [
                      {
                        label: "확인",
                        onClick: () => unFollow.mutate()
                      },
                      {
                        label: "취소",
                        onClick: () => console.log("취소")
                      }
                    ]
                  });
                }}
              >
                unfollow
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => {
                  confirmAlert({
                    message: "팔로우 하시겠습니까?",
                    buttons: [
                      {
                        label: "확인",
                        onClick: () => follow.mutate()
                      },
                      {
                        label: "취소",
                        onClick: () => console.log("취소")
                      }
                    ]
                  });
                }}
              >
                follow
              </Button>
            ))} */}
        </div>
        <span>{moment(postProps?.createdAt).fromNow()}</span>
      </PostInfoWrapper>
      {postProps?.Images?.length > 0 && (
        <ImageWrapper onClick={() => setZoom(true)}>
          {postProps.Images?.length === 1 && (
            <ImageBox>
              <Image src={`${BACK_SERVER}/${postProps.Images[0].src}`} />
            </ImageBox>
          )}
          {postProps.Images?.length >= 2 && (
            <Carousel indicators={true} autoPlay={false} animation="fade">
              {postProps.Images?.map((v: Image, i: number) => (
                <ImageBox key={i}>
                  <Image src={`${BACK_SERVER}/${v?.src}`} />
                </ImageBox>
              ))}
            </Carousel>
          )}
        </ImageWrapper>
      )}

      <TextWrapper onClick={() => setZoom(true)}>{postProps?.content}</TextWrapper>

      {/* 토글 버튼(좋아요, 댓글창, 수정, 삭제) */}
      <ToggleWrapper>
        {postProps.type === 0 && (
          <ToggleButton
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
          </ToggleButton>
        )}
        {postProps.type === 1 && (
          <FlexDiv>
            {/* like toggle */}
            <ToggleButton
              onClick={() => {
                if (!isLiked) {
                  like.mutate();
                } else {
                  disLike.mutate();
                }
              }}
            >
              {isLiked ? <BookmarkIcon style={{ color: "#a9aed4" }} /> : <BookmarkBorderIcon />}
              <span>{postProps?.Likers?.length}</span>
            </ToggleButton>
            {/* comment toggle */}
            <ToggleButton
              onClick={() => {
                setCommentOpen((c) => !c);
                setCommentLoadLength(5);
              }}
            >
              <MessageIcon />
              <span>{postProps?.Comments?.length}</span>
            </ToggleButton>
          </FlexDiv>
        )}
        {postProps.type === 2 && (
          <FlexDiv>
            {/* like toggle */}
            <ToggleButton
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
            </ToggleButton>
            {/* comment toggle */}
            <ToggleButton
              onClick={() => {
                setCommentOpen((c) => !c);
                setCommentLoadLength(5);
              }}
            >
              <MessageIcon />
              <span>{postProps?.Comments?.length}</span>
            </ToggleButton>
          </FlexDiv>
        )}
        {isMyPost && (
          <ToggleButton
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.stopPropagation();
              if (!morePop) {
                setMorePop(event.currentTarget);
                setTimer(
                  setTimeout(() => {
                    setMorePop(null);
                  }, 1500)
                );
              } else {
                setMorePop(null);
                clearTimeout(timer);
              }
            }}
          >
            <MoreVertIcon />
          </ToggleButton>
        )}
      </ToggleWrapper>

      {isCommentOpen && (
        <>
          <CommentInputForm postId={postProps?.id} postType={postProps?.type}></CommentInputForm>
          <CommentWrapper ref={commentScroll}>
            {postProps?.Comments.slice(0, commentLoadLength).map((v: any, i: number) => (
              <Comment
                key={i + v.content + "comment"}
                commentProps={v}
                currentUserId={user.id}
                postType={postProps.type}
              ></Comment>
            ))}
          </CommentWrapper>
          {postProps?.Comments.length !== 0 && commentLoadLength < postProps?.Comments.length && (
            <More>
              <button
                color="info"
                onClick={() => {
                  if (commentLoadLength < postProps?.Comments.length) {
                    setCommentLoadLength((c) => c + 5);
                  }
                  setTimeout(() => {
                    commentScroll.current?.scrollTo({ top: commentScroll.current.scrollHeight, behavior: "smooth" });
                  }, 0);
                }}
              >
                더 보기 [{postProps?.Comments.length - commentLoadLength}]
              </button>
            </More>
          )}
        </>
      )}
    </PostWrapper>
  );
};

export default Post;

const More = styled.div`
  margin: 16px;
  margin-top: 0px;

  display: flex;
  justify-content: center;
  > button {
    padding: 6px 16px;
    border-radius: 30px;
    /* width: 50px; */
    font-size: 14px;
    /* font-weight: 800; */

    background-color: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.6);
  }
`;

const EditPopup = styled.div`
  margin-bottom: 8px;
  padding: 6px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.3);
`;

const FlexDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;

  transition: all ease-in-out 1s;

  /* padding: 20px 0px; */
  height: auto;
  width: 500px;

  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin: 3px 10px;
  margin-bottom: 30px;
  /* border-radius: 7px; */
  @media screen and (max-width: 720px) {
    width: 92vw;
    /* width: 450px; */
    /* height: auto; */
  }
`;
const ImageWrapper = styled.div`
  transition: all ease-in-out 1s;
  margin: 10px 0;
`;
const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease-in-out 1s;
`;
const Image = styled.img`
  width: 100%;
  height: 300px;
  /* object-fit: contain; */
  object-fit: cover;
  transition: all ease-in-out 1s;
`;

const PostInfoWrapper = styled.div`
  margin: 20px;
  margin-bottom: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      /* font-weight: 600; */
      font-size: 1.2em;
    }
    button {
      margin-left: 10px;
    }
  }
  > span:last-child {
    color: rgba(0, 0, 0, 0.6);
  }
`;

const TextWrapper = styled.div`
  //줄바꿈 표시
  white-space: pre-wrap;
  line-height: 1.3em;

  margin: 10px 20px;

  /* max-height: 100px; */
  overflow-y: scroll;
  overflow: hidden;
  text-overflow: ellipsis;

  display: -webkit-box;
  -webkit-line-clamp: 6; /* 원하는 줄 수 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media screen and (max-width: 720px) {
    font-size: 1.1em;
  }
`;

const ToggleWrapper = styled.div`
  margin: 16px 20px;
  margin-top: 5px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-left: 4px;
    margin-right: 12px;
    font-size: 1.3em;
    /* font-weight: 600; */
    /* color: grey; */
  }
`;

const CommentWrapper = styled.div`
  margin: 5px 20px;
  margin-bottom: 20px;

  max-height: 350px;
  overflow-y: scroll;
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50px;
  background-color: white;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

  object-fit: cover;
`;
