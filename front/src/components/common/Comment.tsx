import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommentFunction from "../../functions/reactQuery/Comment";
import useAlert from "./Alert";
import ReactDom from "react-dom";

import Img from "./Img";

//mui
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popper from "@mui/material/Popper";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import User from "../../functions/reactQuery/User";
import CircularProgress from "@mui/material/CircularProgress";

moment.locale("ko");

const Comment = ({ commentProps, currentUserId, postType }: any) => {
  const [isCommentEdit, setCommentEdit] = useState<boolean>(false);
  const [commentEditContent, setCommentEditContent] = useState<string>(commentProps.content);

  const [morePop, setMorePop] = useState<null | HTMLElement>(null);

  const open = Boolean(morePop);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const { Alert: CommentDeleteConfirm, openAlert: OpenCommentDeleteConfirm } = useAlert();

  const navigate = useNavigate();

  const commentRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    commentRef.current?.focus();
  }, [isCommentEdit]);

  const user = User.getData();

  //useMutation
  const editComment = CommentFunction.edit();
  const deleteComment = CommentFunction.delete();

  return (
    <CommentBox
      onClick={() => {
        setMorePop(null);
        clearTimeout(timer);
      }}
    >
      {ReactDom.createPortal(<CommentDeleteConfirm />, document.getElementById("modal_root") as HTMLElement)}

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
              OpenCommentDeleteConfirm({
                mainText: "댓글을 삭제 하시겠습니까?",
                onSuccess: () => {
                  deleteComment.mutate({ postId: commentProps.PostId, commentId: commentProps.id });
                }
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
            navigate(`/userinfo/${commentProps?.User?.id}/cat/0`);
          }}
        >
          {commentProps?.User?.profilePic ? (
            <ProfilePic
              crop={true}
              alt="profilePic"
              src={`${commentProps?.User?.profilePic}`}
              altImg={`${commentProps?.User?.profilePic.replace(/\/thumb\//, "/original/")}`}
            />
          ) : (
            <ProfilePic crop={true} alt="profilePic" src="/img/defaultProfilePic.png" />
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
              editComment.mutate(
                {
                  postId: commentProps.PostId,
                  commentId: commentProps.id,
                  content: commentEditContent
                },
                {
                  onSuccess: () => {
                    setCommentEdit(false);
                  },
                  onError: () => {
                    setCommentEditContent(commentProps?.content);
                  }
                }
              );
            }
          }}
        >
          <input ref={commentRef} value={commentEditContent} onChange={(e) => setCommentEditContent(e.target.value)} />

          <CommentEditButton disabled={editComment.isLoading ? true : false}>
            {editComment.isLoading ? <CircularProgress size={24} color="inherit" /> : <CheckCircleIcon />}
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
const ProfilePic = styled(Img)`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  border-radius: 50px;
  background-color: white;

  border: 2px solid rgba(0, 0, 0, 0.1);
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
  cursor: pointer;
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
  font-weight: 500;
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
