import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import "moment/locale/ko";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import ClipboardJS from "clipboard";

//components
import Comment from "./Comment";
import CommentInputForm from "./CommentInputForm";
import PostEditPopup from "./PostEditPopup";
import PostZoom from "../PostZoom";
import Animation from "../../styles/Animation";

//mui
// import Carousel from "react-material-ui-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import LinkIcon from "@mui/icons-material/Link";
import PostFunction from "../../functions/reactQuery/Post";
import User from "../../functions/reactQuery/User";

interface Image {
  src: string;
}

const Post = ({ postProps }: any) => {
  new ClipboardJS(".btn");

  moment.locale("ko");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const user = User.getData();

  const [commentLoadLength, setCommentLoadLength] = useState<number>(5);
  const [isPostEdit, setPostEdit] = useState<boolean>(false);
  const [isCommentOpen, setCommentOpen] = useState<boolean>(false);
  const [morePop, setMorePop] = useState<null | HTMLElement>(null);
  const [isZoom, setZoom] = useState<boolean>(false);

  const isLiked = postProps?.Likers?.find((v: any) => v.id === user?.id);
  const isMyPost = user?.id === postProps?.UserId;

  const postHaveDate = postProps?.start && postProps?.end;
  const postHaveLink = postProps?.link && true;

  const commentScroll = useRef<null | HTMLDivElement>(null);

  const open = Boolean(morePop);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const modalClose = () => {
    history.back();
    setZoom(false);
    setPostEdit(false);
  };

  const makeCorectUrl = (url: string) => {
    url = url.toLowerCase();
    return "https://" + url.replace("https:/", "").replace("http:/", "");
  };

  //useMutation
  const like = PostFunction.like();
  const disLike = PostFunction.disLike();
  const deletePost = PostFunction.delete();

  //포스트 팝업 뜬 경우 백그라운드 스크롤 방지
  useEffect(() => {
    if (isZoom) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isZoom]);
  useEffect(() => {
    if (isPostEdit) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isPostEdit]);

  //댓글 작성시 스크롤 탑
  useEffect(() => {
    commentScroll.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [postProps?.Comments.length]);

  const navigate = useNavigate();

  //관심 상태 포스트 줌 상태에서 좋아요 해제면 다음 게시글이 줌되는 오류 해결
  useEffect(() => {
    setZoom(false);
  }, [postProps.id]);

  window.addEventListener("popstate", () => {
    setPostEdit(false);
    setZoom(false);
  });

  const indicatorStyles: any = {
    background: "#fff",
    width: 8,
    height: 8,
    display: "inline-block",
    margin: "0 8px"
  };

  return (
    <PostWrapper onClick={() => setMorePop(null)}>
      {/* 포스트 줌 팝업 */}
      {isZoom && <PostZoom modalClose={modalClose} postProps={postProps} />}
      <Popper open={open} anchorEl={morePop} placement="top-end">
        <EditPopup>
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              setMorePop(null);
              clearTimeout(timer);

              const url = document.URL + "/modal";
              history.pushState({ page: "modal" }, "", url);
              setPostEdit(true);
            }}
          >
            <EditIcon />
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => {
              setMorePop(null);
              clearTimeout(timer);
              confirmAlert({
                // title: "",
                message: "게시글을 삭제 하시겠습니까?",
                buttons: [
                  {
                    label: "취소",
                    onClick: () => console.log("취소")
                  },
                  {
                    label: "확인",
                    onClick: () => deletePost.mutate(postProps?.id)
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
          modalClose={modalClose}
          postProps={{
            type: postProps.type,
            id: postProps.id,
            content: postProps.content,
            images: postProps.Images,
            start: postProps?.start,
            end: postProps?.end,
            link: postProps?.link
          }}
        />
      ) : null}

      <PostInfoWrapper>
        <div
          onClick={() => {
            if (user?.id === postProps?.User?.id) {
              navigate(`/profile/0`);
            } else {
              navigate(`/userinfo/${postProps?.User?.id}/cat/0`);
            }
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth"
            });
          }}
        >
          {postProps?.User?.profilePic ? (
            <ProfilePic
              alt="userProfilePic"
              src={`${postProps?.User?.profilePic}`}
              onError={(e) => {
                e.currentTarget.src = `/img/defaultProfilePic.png`;
              }}
            />
          ) : (
            <ProfilePic alt="userProfilePic" src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`} />
          )}
          <span>{postProps?.User?.nickname}</span>
        </div>
        <span>{moment(postProps?.createdAt).fromNow()}</span>
      </PostInfoWrapper>
      {/* {postProps?.Images?.length > 0 && (
        <ImageWrapper
          onClick={() => {
            const url = document.URL + "/modal";
            history.pushState({ page: "modal" }, "", url);
            setZoom(true);
          }}
        >
          {postProps.Images?.length === 1 && (
            <ImageBox>
              <Image
                src={`${postProps.Images[0].src}`}
                onError={(e) => {
                  e.currentTarget.src = `${postProps.Images[0].src.replace(/\/thumb\//, "/original/")}`;
                }}
              />
            </ImageBox>
          )}
          {postProps.Images?.length >= 2 && (
            <Carousel indicators={true} autoPlay={false} animation="fade">
              {postProps.Images?.map((v: Image, i: number) => (
                <ImageBox key={i}>
                  <Image
                    src={`${v?.src}`}
                    onError={(e) => {
                      e.currentTarget.src = `${v?.src.replace(/\/thumb\//, "/original/")}`;
                    }}
                  />
                </ImageBox>
              ))}
            </Carousel>
          )}
        </ImageWrapper>
      )} */}
      <Carousel
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <CarouselBtn type="button" onClick={onClickHandler} title={label} left={15} right={null}>
              -
            </CarouselBtn>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <CarouselBtn type="button" onClick={onClickHandler} title={label} left={null} right={15}>
              -
            </CarouselBtn>
          )
        }
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          if (isSelected) {
            return (
              <li
                style={{ ...indicatorStyles, background: "#000" }}
                aria-label={`Selected: ${label} ${index + 1}`}
                title={`Selected: ${label} ${index + 1}`}
              />
            );
          }
          return (
            <li
              style={indicatorStyles}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              title={`${label} ${index + 1}`}
              aria-label={`${label} ${index + 1}`}
            />
          );
        }}
        showArrows={true}
        preventMovementUntilSwipeScrollTolerance={true}
        swipeScrollTolerance={100}
      >
        {postProps.Images?.map((v: Image, i: number) => (
          <div key={i}>
            <Image
              src={`${v?.src}`}
              onError={(e) => {
                e.currentTarget.src = `${v?.src.replace(/\/thumb\//, "/original/")}`;
              }}
            />
          </div>
        ))}
      </Carousel>

      <TextWrapper
        onClick={() => {
          const url = document.URL + "/modal";
          history.pushState({ page: "modal" }, "", url);
          setZoom(true);
        }}
      >
        {postProps?.content}
      </TextWrapper>
      {(postHaveDate || postHaveLink) && (
        <SubContentWrapper>
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
        </SubContentWrapper>
      )}

      {/* 토글 버튼(좋아요, 댓글창, 수정, 삭제) */}
      <ToggleWrapper>
        {postProps.type === 0 && (
          <ToggleButton
            onClick={() => {
              if (!isLiked) {
                like.mutate(postProps.id);
              } else {
                disLike.mutate(postProps.id);
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
                  like.mutate(postProps.id);
                } else {
                  disLike.mutate(postProps.id);
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
                  like.mutate(postProps.id);
                } else {
                  disLike.mutate(postProps.id);
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

        <FlexDiv>
          <ToggleButton
            onClick={() => {
              // console.log(`${BASE_URL}/postview/${postProps.id}`);
              toast.success("공유 URL이 클립보드에 복사되었습니다.");
            }}
            className="btn"
            data-clipboard-text={`${BASE_URL}/postview/${postProps.id}`}
          >
            <LinkIcon fontSize="medium" />
            <span>URL</span>
          </ToggleButton>
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
        </FlexDiv>
      </ToggleWrapper>

      {isCommentOpen && (
        <>
          {user && <CommentInputForm postId={postProps?.id}></CommentInputForm>}
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

const CarouselBtn = styled.button<{ left: number | null; right: number | null }>`
  color: white;
  color: black;
  background-color: red;
  left: ${(props) => (props.left ? props.left + "px" : null)};
  right: ${(props) => (props.right ? props.right + "px" : null)};
  position: absolute;
  z-index: 2;
  top: calc(50% - 15px);
  width: 30px;
  height: 30px;
  border-radius: 100%;
  cursor: pointer;
`;

const SubContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  font-size: 18px;

  margin: 10px 20px;
  margin-top: 0;
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
  animation: ${Animation.smoothAppear} 1s ease-in-out;
  display: flex;
  flex-direction: column;

  transition: all ease-in-out 0.5s;

  height: auto;
  width: 500px;

  border-radius: 6px;

  /* box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); */

  background-color: rgba(0, 0, 0, 0.02);
  border: 2px rgba(0, 0, 0, 0.07) solid;
  background-color: #fafafa;

  /* margin: 3px 10px; */
  margin-bottom: 30px;
  /* border-radius: 7px; */
  @media (orientation: portrait) or (max-height: 480px) {
    width: 92vw;
    &:last-child {
      margin-bottom: 150px;
    }
    /* width: 450px; */
    /* height: auto; */
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 400px;
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
      font-weight: 500;
      /* font-weight: 600; */
      height: 100%;
      font-size: 1.2em;
      line-height: 1.3em;
      max-width: 50vw;
      overflow: hidden;
      text-overflow: ellipsis;
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

  font-size: 18px;

  margin: 16px 20px;

  /* max-height: 100px; */
  overflow-y: scroll;
  overflow: hidden;
  text-overflow: ellipsis;

  display: -webkit-box;
  -webkit-line-clamp: 4; /* 원하는 줄 수 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (orientation: portrait) or (max-height: 480px) {
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
