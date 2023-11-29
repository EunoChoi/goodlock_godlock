import React from "react";
import styled from "styled-components";

interface setStateProps {
  modalClose: () => void;
}

const UserDeleteConfirm = ({ modalClose }: setStateProps) => {
  return (
    <BG onClick={() => modalClose()}>
      <Popup onClick={(event) => event.stopPropagation()}>
        <span>탈퇴를 진행하시겠습니까?</span>
        <span>삭제를 입력하세요</span>
        <input></input>
        <ButtonWrapper>
          <button onClick={() => modalClose()}>취소</button>
          <button>확인</button>
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
  margin-top: 20px;
  button {
    outline: none;
    color: white;
    background-color: #b8c1e1;
    border: none;
    display: inline-block;
    padding: 6px 18px;
    margin-right: 10px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  button:first-child {
    border: solid 2px #b8c1e1;
    background-color: white;
    color: #b8c1e1;
  }
`;
