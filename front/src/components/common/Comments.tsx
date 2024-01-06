import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Comment from "./Comment";
import CommentInputForm from "./CommentInputForm";
import { useModalStack } from "../../store/modalStack";
import { useBrowserCheck } from "../../store/borowserCheck";

import User from "../../functions/reactQuery/User";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface props {
  postProps: any;
  setCommentsOpen: (b: boolean) => void;
}

const Comments = ({ postProps, setCommentsOpen }: props) => {
  const [animation, setAnimation] = useState<"open" | "close">("close");

  const commentScroll = useRef<null | HTMLDivElement>(null);
  const user = User.get().data;

  const { push, pop, modalStack } = useModalStack();
  const { browser } = useBrowserCheck();
  const [buttonClose, setButtonClose] = useState(false);

  //하나 열리면 나머지 닫히게하기 위해서 comments 컴포넌트에서 state 생성
  const [replyOpenIdx, setReplyOpenIdx] = useState<number | null>(null);

  const ButtonClose = () => {
    setAnimation("close");
    setButtonClose(true);
  };

  //댓글 작성시 스크롤 탑
  useEffect(() => {
    commentScroll.current?.scrollTo({ top: commentScroll.current.scrollHeight, behavior: "smooth" });
  }, [postProps?.Comments.length]);

  useEffect(() => {
    if (modalStack[modalStack.length - 1] === "#comments") {
      window.onpopstate = () => {
        console.log("pop: comments");
        if (browser === "Safari") setCommentsOpen(false);
        else setAnimation("close");
      };
    }
  }, [modalStack.length]);

  useEffect(() => {
    commentScroll.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setAnimation("open");
    }, 50);
    push("#comments");
    return () => {
      window.onpopstate = null;
      pop();
    };
  }, []);

  return (
    <CommentBG
      onClick={(e) => {
        e.stopPropagation();
        ButtonClose();
      }}
      animation={animation}
      onTransitionEnd={(e) => {
        //여러 transtion이 동작할때 구분이 필요하다.
        //따로 구분을 안해서 history.back()이 두번동작하는 오류 존재했음
        if (e.propertyName === "opacity") {
          if (animation === "close" && buttonClose) {
            history.back();
            setTimeout(() => {
              setCommentsOpen(false);
            }, 100);
          } else if (animation === "close" && !buttonClose) {
            setCommentsOpen(false);
          }
        }
      }}
    >
      <CommentWrapper animation={animation} onClick={(e) => e.stopPropagation()}>
        <button
          id="close"
          onClick={() => {
            // ButtonClose();
            history.back();
          }}
        >
          <ArrowDropDownIcon fontSize="inherit" />
        </button>

        <CommentBox ref={commentScroll}>
          {postProps?.Comments.length === 0 && <span id="noComment">댓글이 존재하지 않습니다. :(</span>}
          {postProps?.Comments.map((v: any, i: number) => (
            <Comment
              key={i + v.content + "comment"}
              commentProps={v}
              idx={i}
              replyOpenIdx={replyOpenIdx}
              setReplyOpenIdx={setReplyOpenIdx}
            ></Comment>
          ))}
        </CommentBox>

        {user && <CommentInputForm postId={postProps?.id}></CommentInputForm>}
      </CommentWrapper>
    </CommentBG>
  );
};

export default Comments;

const CommentBox = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  margin: 0 20px;
  height: auto;

  overflow-y: scroll;
`;

const CommentWrapper = styled.div<{ animation?: "open" | "close" }>`
  transform: translateY(-100%);
  transform: ${(props) => (props.animation === "open" ? "translateY(0%)" : "translateY(100%)")};
  transition: all ease-in-out 0.3s;

  #noComment {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
    height: 100%;
  }
  #close {
    width: auto;
    font-size: 36px;
    color: rgba(0, 0, 0, 0.6);
  }

  width: 100%;
  width: 50vw;
  min-height: 200px;
  max-height: 80vh;

  /* height: calc(var(--vh, 1vh) * 80); */
  padding-bottom: 32px;

  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: #fff;

  bottom: 0;
  right: 0;

  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  > * {
    width: 80%;
  }
  @media (orientation: portrait) or (max-height: 480px) {
    padding-bottom: 20px;
    max-height: 600px;
    width: 100%;
    > * {
      width: 90%;
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 100%;
    padding-bottom: 20px;
    max-height: 90vh;
    /* height: calc(var(--vh, 1vh) * 90); */
  }
`;
const CommentBG = styled.div<{ animation?: "open" | "close" }>`
  opacity: 0;
  opacity: ${(props) => (props.animation === "open" ? "1" : "0")};
  transition: all ease-in-out 0.3s;

  z-index: 5000;

  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);

  position: fixed;
  bottom: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: end;

  height: 100%;
  width: calc(100% - 280px);
  width: 100%;
  @media (orientation: portrait) or (max-height: 480px) {
    width: 100%;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 100%;
  }
`;
