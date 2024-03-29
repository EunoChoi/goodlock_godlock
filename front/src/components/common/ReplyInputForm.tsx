import React, { RefObject, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

import Comment from "../../functions/reactQuery/Comment";

//mui
import SendIcon from "@mui/icons-material/Send";
import Reply from "../../functions/reactQuery/Reply";
import User from "../../functions/reactQuery/User";

const ReplyInputForm = ({ commentId, commentRef }: { commentId: number; commentRef: RefObject<HTMLDivElement> }) => {
  const [content, setContent] = useState("");

  const addReply = Reply.add();
  const user = User.get().data;

  return (
    <>
      {user.level !== 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (content.length > 60 || content.length < 5)
              toast.warning("답글은 최소 5자 최대 60자 입력이 가능합니다.");
            else
              addReply.mutate(
                { commentId, content },
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
              // onClick={() => {
              //   setTimeout(() => {
              //     commentRef.current?.scrollIntoView({ behavior: "smooth" });
              //   }, 100);
              // }}
              placeholder="답글을 입력하세요."
              value={content}
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
            ></CommentInput>

            <CommentSendButton disabled={addReply.isLoading ? true : false}>
              {addReply.isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </CommentSendButton>
          </CommentInputArea>
        </form>
      )}
    </>
  );
};

export default ReplyInputForm;

const CommentInputArea = styled.div`
  display: -webkit-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0px 10px;
  margin-top: 10px;
  /* margin-bottom: 10px; */

  width: auto;
  height: 40px;
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
