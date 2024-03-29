import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

import Comment from "../../functions/reactQuery/Comment";

//mui
import SendIcon from "@mui/icons-material/Send";
import User from "../../functions/reactQuery/User";

const CommentInputForm = ({ postId }: { postId: number }) => {
  const [content, setContent] = useState("");
  const user = User.get().data;

  const addComment = Comment.add();

  return (
    <>
      {user?.level !== 0 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (content.length > 60 || content.length < 5)
              toast.warning("댓글은 최소 5자 최대 60자 입력이 가능합니다.");
            else
              addComment.mutate(
                { postId, content },
                {
                  onSuccess: () => {
                    setContent("");
                  }
                }
              );
          }}
        >
          <CommentInputArea>
            <CommentInput
              placeholder="댓글을 입력하세요."
              value={content}
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
            ></CommentInput>

            <CommentSendButton disabled={addComment.isLoading ? true : false}>
              {addComment.isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </CommentSendButton>
          </CommentInputArea>
        </form>
      ) : (
        <span></span>
      )}
    </>
  );
};

export default CommentInputForm;

const CommentInputArea = styled.div`
  display: -webkit-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* margin: 20px;
  margin-top: 0; */
  margin-top: 12px;
  padding: 0px 10px;

  width: auto;
  height: 50px;
  border: 2px rgba(0, 0, 0, 0.1) solid;
  border-radius: 7px;
`;

const CommentInput = styled.input`
  border: none;
  outline: none;

  background-color: rgba(0, 0, 0, 0);

  width: 50%;

  flex-grow: 1;
  -webkit-box-flex: 1;

  height: 24px;

  font-size: 18px;
  input:focus {
    outline: none;
  }
`;

const CommentSendButton = styled.button`
  display: flex;
  justify-content: end;
`;
