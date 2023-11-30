import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import User from "../functions/reactQuery/User";

interface setStateProps {
  modalClose: () => void;
}

const UserDeleteConfirm = ({ modalClose }: setStateProps) => {
  const [text, setText] = useState<string>("");
  const userDelete = User.delete();
  const user = User.getData();
  const confirmWord = "회원 탈퇴";

  const userDeleteConfirm = () => {
    if (text === confirmWord) {
      userDelete.mutate(user.id);
      //회원 탈퇴 api 요청
    } else {
      toast.error("입력이 올바르지 않습니다.");
    }
  };

  return (
    <BG onClick={() => modalClose()}>
      <Popup onClick={(event) => event.stopPropagation()}>
        <span>탈퇴를 진행하려면 &quot;{confirmWord}&quot;를 입력해주세요.</span>
        <span>🚨 탈퇴가 완료되면 작성한 모든 게시글이 삭제됩니다.</span>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <ButtonWrapper>
          <button onClick={() => modalClose()}>취소</button>
          <button onClick={() => userDeleteConfirm()}>확인</button>
        </ButtonWrapper>
      </Popup>
    </BG>
  );
};

export default UserDeleteConfirm;

const BG = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100vw;

  z-index: 2000;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);

  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 0;
  -webkit-animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
  -moz-animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
  -o-animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
  animation: react-confirm-alert-fadeIn 0.5s 0.2s forwards;
`;

const Popup = styled.div`
  padding: 30px;
  width: 400px;

  background: #fff;
  border-radius: 10px;
  box-shadow: 0 20px 75px rgba(0, 0, 0, 0.13);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    font-weight: 600;
    color: #666;
  }
  span:nth-child(2) {
    font-size: 14px;
    font-weight: 500;
    margin-top: 8px;
    color: salmon;
  }
  input {
    text-align: center;
    color: grey;
    font-size: 20px;
    width: 100%;
    margin-top: 20px;
    border: 2px rgba(0, 0, 0, 0.1) solid;
    border-radius: 8px;
    padding: 8px 24px;
    font-weight: 500;
    outline: none;
  }

  @media (orientation: portrait) or (max-height: 480px) {
    width: 92vw;
  }

  @media (orientation: landscape) and (max-height: 480px) {
    width: 50vw;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  button {
    outline: none;
    color: white;
    background-color: #b8c1e1;
    border: none;
    display: inline-block;
    padding: 6px 18px;

    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  button:first-child {
    border: solid 2px #b8c1e1;
    background-color: white;
    color: #b8c1e1;
    margin-right: 10px;
  }
`;
