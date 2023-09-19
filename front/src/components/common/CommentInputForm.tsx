import React, { useState } from "react";
import styled from "styled-components";
import Axios from "../../apis/Axios";
import { toast } from "react-toastify";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

//mui
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import SendIcon from "@mui/icons-material/Send";

interface props {
  postId: number;
  postType: number;
}

const CommentInputForm = ({ postId, postType }: props) => {
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const addComment = useMutation(() => Axios.post(`post/${postId}/comment`, { content }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);

      queryClient.invalidateQueries(["noticePosts"]);

      queryClient.invalidateQueries(["infoPosts"]);
      queryClient.invalidateQueries(["activinfo"]);

      queryClient.invalidateQueries(["communityPosts"]);
      queryClient.invalidateQueries(["feed"]);

      queryClient.invalidateQueries(["userLikedPosts"]);
      queryClient.invalidateQueries(["userInfoPosts"]);
      queryClient.invalidateQueries(["userCommPosts"]);

      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);
      setContent("");
      toast.success("댓글 작성이 완료되었습니다.");
      // alert("댓글 작성이 완료되었습니다.");
    },
    onError: () => {
      toast.warning("댓글 추가 중 에러 발생!!");
      // alert("댓글 추가 중 에러 발생!!");
      // location.reload();
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // if (content.length === 0) console.log("게시글 내용 X");
        if (content.length > 60 || content.length < 5) toast.warning("댓글은 최소 5자 최대 60자 입력이 가능합니다.");
        else addComment.mutate();
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
        <CommentSendButton>
          <SendIcon />
          {/* <AddCommentOutlinedIcon /> */}
        </CommentSendButton>
      </CommentInputArea>
    </form>
  );
};

export default CommentInputForm;

const CommentInputArea = styled.div`
  display: -webkit-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 10px;
  margin: 5px 20px;
  padding: 0px 10px;

  width: auto;
  height: 50px;
  border: 2px rgba(0, 0, 0, 0.1) solid;
  border-radius: 7px;
`;

const CommentInput = styled.input`
  border: none;
  outline: none;

  width: 50%;

  flex-grow: 1;
  -webkit-box-flex: 1;

  height: 24px;

  font-size: 1.1em;
  input:focus {
    outline: none;
  }
`;

const CommentSendButton = styled.button`
  display: flex;
  justify-content: end;
`;
