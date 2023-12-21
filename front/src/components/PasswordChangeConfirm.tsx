import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import User from "../functions/reactQuery/User";
import Axios from "../apis/Axios";
import { useModalStack } from "../store/modalStack";

interface setStateProps {
  setPasswordChangeModal: (b: boolean) => void;
}

const PasswordChangeConfirm = ({ setPasswordChangeModal }: setStateProps) => {
  const { push, pop, modalStack } = useModalStack();

  const [animation, setAnimation] = useState<"open" | "close" | "">("");

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [afterPassword, setAfterPassword] = useState<string>("");
  const user = User.getData();
  const [passwordConfirm, setPasswordConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (modalStack[modalStack.length - 1] === "#pwChange") {
      window.onpopstate = () => {
        console.log("pop: password update");

        setAnimation("close");
      };
    }
  }, [modalStack.length]);

  useEffect(() => {
    push("#pwChange");
    setAnimation("open");
    return () => {
      pop();
    };
  }, []);

  return (
    <BG
      animation={animation}
      onTransitionEnd={() => {
        if (animation === "close") {
          setPasswordChangeModal(false);
        }
      }}
      onClick={() => history.back()}
    >
      <Popup onClick={(event) => event.stopPropagation()}>
        {passwordConfirm || (
          <>
            <span>현재 사용중인 비밀번호를 입력해주세요.</span>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <ButtonWrapper>
              <button onClick={() => history.back()}>취소</button>
              <button
                onClick={() => {
                  //현재 비밀번호 확인 api 요청
                  Axios.post("user/password/confirm", { email: user.email, password: currentPassword })
                    .then((res) => {
                      toast.success("현재 비밀번호 확인 완료");
                      console.log(res.data.message);
                      setPasswordConfirm(true);
                    })
                    .catch((res) => {
                      toast.error("비밀번호가 올바르지 안습니다.");
                      console.log(res.response.data.message);
                    });
                }}
              >
                확인
              </button>
            </ButtonWrapper>
          </>
        )}
        {passwordConfirm && (
          <>
            <span>변경할 비밀번호를 입력해주세요.</span>
            <input type="password" value={afterPassword} onChange={(e) => setAfterPassword(e.target.value)} />
            <ButtonWrapper>
              <button onClick={() => history.back()}>취소</button>
              <button
                onClick={() => {
                  //비밀번호 수정 api 요청
                  Axios.patch("user/password", { userId: user.id, afterPassword })
                    .then((res) => {
                      toast.success("비밀번호 변경이 완료되었습니다.");
                      history.back();
                      console.log(res);
                    })
                    .catch((res) => {
                      toast.error("비밀번호 변경 도중 오류가 발생하였습니다.");
                      console.log(res);
                    });
                }}
              >
                확인
              </button>
            </ButtonWrapper>
          </>
        )}
      </Popup>
    </BG>
  );
};

export default PasswordChangeConfirm;

const BG = styled.div<{ animation: string }>`
  opacity: 0;
  opacity: ${(props) => (props.animation === "open" ? 1 : 0)};
  transition: linear 0.3s all;

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
`;

const Popup = styled.div`
  padding: 30px 10px;
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
  input {
    text-align: center;
    color: grey;
    font-size: 20px;
    width: 90%;
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
