import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useMutation, useQuery } from "@tanstack/react-query";
import Axios from "../../apis/Axios";
import { useQueryClient } from "@tanstack/react-query";

//mui
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popper from "@mui/material/Popper";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

moment.locale("ko");

interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}
interface CommentType {
  content: string;
}

const Comment = ({ commentProps, currentUserId, postType }: any) => {
  const queryClient = useQueryClient();
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const [isCommentEdit, setCommentEdit] = useState<boolean>(false);
  const [commentEditContent, setCommentEditContent] = useState<string>(commentProps.content);

  const [morePop, setMorePop] = useState<null | HTMLElement>(null);

  const open = Boolean(morePop);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const navigate = useNavigate();

  const commentRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    commentRef.current?.focus();
  }, [isCommentEdit]);

  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  //mutation - 댓글 수정, 삭제
  const editComment = useMutation(
    (data: CommentType) => Axios.patch<CommentType>(`post/${commentProps.PostId}/comment/${commentProps.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);

        queryClient.invalidateQueries(["noticePosts"]);
        queryClient.invalidateQueries(["infoPosts"]);
        queryClient.invalidateQueries(["searchInfo"]);
        queryClient.invalidateQueries(["communityPosts"]);
        queryClient.invalidateQueries(["searchComm"]);
        queryClient.invalidateQueries(["activinfo"]);
        queryClient.invalidateQueries(["feed"]);

        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);

        queryClient.invalidateQueries(["likedPosts"]);
        queryClient.invalidateQueries(["myCommPosts"]);
        queryClient.invalidateQueries(["myInfoPosts"]);
        setCommentEdit(false);
        toast.success("댓글 수정이 완료되었습니다.");
        // alert("댓글 수정이 완료되었습니다.");
      },
      onError: (err: CustomError) => {
        setCommentEditContent(commentProps?.content);
        toast.warning(err.response?.data);
        // alert(err.response?.data);
      }
    }
  );
  const deleteComment = useMutation(() => Axios.delete(`post/${commentProps.PostId}/comment/${commentProps.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);

      queryClient.invalidateQueries(["noticePosts"]);
      queryClient.invalidateQueries(["infoPosts"]);
      queryClient.invalidateQueries(["searchInfo"]);
      queryClient.invalidateQueries(["communityPosts"]);
      queryClient.invalidateQueries(["searchComm"]);
      queryClient.invalidateQueries(["activinfo"]);
      queryClient.invalidateQueries(["feed"]);

      queryClient.invalidateQueries(["userLikedPosts"]);
      queryClient.invalidateQueries(["userInfoPosts"]);
      queryClient.invalidateQueries(["userCommPosts"]);

      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);
      toast.success("댓글 삭제가 완료되었습니다.");
      // alert("댓글 삭제가 완료되었습니다.");
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });

  return (
    <CommentBox
      onClick={() => {
        setMorePop(null);
        clearTimeout(timer);
      }}
    >
      <Popper open={open} anchorEl={morePop} placement="top-end">
        <EditPopup>
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              setMorePop(null);
              clearTimeout(timer);
              setCommentEdit((c) => !c);
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
                message: "댓글을 삭제 하시겠습니까?",
                buttons: [
                  {
                    label: "취소",
                    onClick: () => console.log("취소")
                  },
                  {
                    label: "확인",
                    onClick: () => deleteComment.mutate()
                  }
                ]
              });
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </EditPopup>
      </Popper>
      <CommentInfo>
        <FlexDiv
          onClick={() => {
            if (user?.id === commentProps?.User?.id) navigate(`/profile/0`);
            else navigate(`/userinfo/${commentProps?.User?.id}/cat/0`);
          }}
        >
          {commentProps?.User?.profilePic ? (
            <ProfilePic
              alt="userProfilePic"
              src={`${commentProps?.User?.profilePic}`}
              onError={(e) => {
                e.currentTarget.src = `${commentProps?.User?.profilePic.replace(/\/thumb\//, "/original/")}`;
              }}
            />
          ) : (
            <ProfilePic alt="userProfilePic" src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`} />
          )}

          <UserNickname>{commentProps?.User?.nickname}</UserNickname>

          <CommentTime>{moment(commentProps?.createdAt).fromNow()}</CommentTime>
        </FlexDiv>
        <FlexDiv>
          {currentUserId === commentProps.UserId && (
            <button
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
            </button>
          )}
        </FlexDiv>
      </CommentInfo>
      {isCommentEdit ? (
        <CommentEdit
          onSubmit={(e) => {
            e.preventDefault();
            if (commentEditContent.length > 60 || commentEditContent.length < 5)
              toast.warning("댓글은 최소 5자 최대 60자 입력이 가능합니다.");
            else {
              editComment.mutate({ content: commentEditContent });
              setCommentEdit(false);
            }
          }}
        >
          <input ref={commentRef} value={commentEditContent} onChange={(e) => setCommentEditContent(e.target.value)} />
          <CommentEditButton>
            <CheckCircleIcon />
          </CommentEditButton>
          <CommentEditButton
            onClick={() => {
              setCommentEdit(false);
              setCommentEditContent(commentProps?.content);
            }}
          >
            <CancelIcon color="error" />
          </CommentEditButton>
        </CommentEdit>
      ) : (
        <CommentText>{commentProps?.content}</CommentText>
      )}
    </CommentBox>
  );
};

export default Comment;
const ProfilePic = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  border-radius: 50px;
  background-color: white;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

  object-fit: cover;
`;
const CommentEditButton = styled.button`
  padding: 4px 8px;
`;
const CommentEdit = styled.form`
  display: -webkit-box;
  display: flex;

  padding: 6px 0;
  width: 100%;
  input {
    font-size: 1em;

    flex-grow: 1;
    -webkit-box-flex: 1;
    width: 50%;

    border: 2px rgba(0, 0, 0, 0.1) solid;
    border-radius: 7px;
    padding: 2px 6px;
  }
  input:focus {
    outline: none;
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
  span {
    margin-right: 8px;
  }
  button {
    height: 100%;
    display: flex;
    align-items: center;
  }
`;
const CommentBox = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px 0px;
  /* border-top: 1px rgba(0, 0, 0, 0.05) solid;
  border-bottom: 1px rgba(0, 0, 0, 0.05) solid; */
`;
const CommentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* padding: 0px 10px; */
  div:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const UserNickname = styled.span`
  /* font-weight: 600; */
  font-size: 1.1em;
`;
const CommentText = styled.span`
  display: flex;
  justify-content: start;
  padding-top: 10px;
  /* padding-bottom: 0px; */
`;
const CommentTime = styled.span`
  font-size: 1.1em;
  color: rgba(0, 0, 0, 0.6);
`;
