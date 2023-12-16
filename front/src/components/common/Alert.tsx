import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

interface Props {
  mainText?: string;
  subText?: string;
  onSuccess: () => void;

  //css
  bgColor?: string;
  borderRadius?: string;
}

const customAlert = () => {
  const location = useLocation();
  const [isOpen, setOpen] = useState<boolean>(false);
  return {
    onOpen: () => {
      if (history.state.page === "modal") {
        const url = document.URL + `&modal="alert"`;
      }
      const url = document.URL + `?modal="alert"`;
      history.pushState({ page: "modal" }, "", url);
      setOpen(true);
    },
    Alert: useCallback(
      ({ mainText, subText, onSuccess, bgColor, borderRadius }: Props) => {
        const [animation, setAnimation] = useState<"open" | "close" | "">("");

        useEffect(() => {
          const closeAnimation = () => {
            setAnimation("close");
          };

          setAnimation("open");

          window.addEventListener("popstate", closeAnimation);
          return () => {
            window.removeEventListener("popstate", closeAnimation);
          };
        }, []);
        return (
          <>
            {isOpen && (
              <BG
                onClick={() => history.back()}
                animation={animation}
                onTransitionEnd={() => {
                  if (animation === "close") {
                    setOpen(false);
                  }
                }}
              >
                <Popup onClick={(event) => event.stopPropagation()} bgColor={bgColor} borderRadius={borderRadius}>
                  <span>{mainText}</span>
                  <span>{subText}</span>
                  <ButtonWrapper>
                    <button onClick={() => history.back()}>취소</button>
                    <button
                      onClick={() => {
                        onSuccess();
                        history.back();
                      }}
                    >
                      확인
                    </button>
                  </ButtonWrapper>
                </Popup>
              </BG>
            )}
          </>
        );
      },
      [isOpen]
    )
  };
};

export default customAlert;

const BG = styled.div<{ animation?: string }>`
  /* opacity: 0; */
  opacity: ${(props) => (props.animation === "open" ? 1 : 0)};
  transition: ease-out 0.3s all;

  position: fixed;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100vw;

  z-index: 3000;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = styled.div<{ bgColor?: string; borderRadius?: string }>`
  padding: 50px 30px;
  width: 400px;

  /* background-color: #fff; */
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#fff")};
  /* border-radius: 10px; */
  border-radius: ${(props) => (props.bgColor ? props.bgColor : "10px")};
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
    box-sizing: border-box;
    outline: none;
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
  button:nth-child(2) {
    border: solid 2px #b8c1e1;
    background-color: #b8c1e1;
    color: white;
  }
`;
