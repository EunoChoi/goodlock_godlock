import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useModalStack } from "../../store/modalStack";
import { useBrowserCheck } from "../../store/borowserCheck";

interface Props {
  mainText?: string;
  subText?: string;
  onSuccess: () => void;
  onCancel?: () => void;

  //css
  bgColor?: string;
  borderRadius?: string;
}

const useAlert = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const [mainText, setMainText] = useState<string>("");
  const [subText, setSubText] = useState<string>("");
  const [onSuccess, setOnSuccess] = useState<() => void>(() => {
    //
  });
  const [onCancel, setOnCalcel] = useState<() => void>();

  const AlertComponent = ({ mainText, subText, onSuccess, onCancel }: Props) => {
    const [animation, setAnimation] = useState<"open" | "close" | "">("");
    const { push, pop, modalStack } = useModalStack();
    const { browser } = useBrowserCheck();

    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const ButtonClose = () => {
      setAnimation("close");
      setTimer(
        setTimeout(() => {
          history.back();
        }, 300)
      );
    };

    useEffect(() => {
      if (modalStack[modalStack.length - 1] === "#alert") {
        window.onpopstate = () => {
          // history.go(1);

          console.log("pop: alert");
          setTimeout(() => {
            if (onCancel !== undefined) onCancel();
          }, 200);
          setAnimation("close");

          if (browser === "Safari") setOpen(false);
          else setAnimation("close");
        };
      }
    }, [modalStack.length]);

    useEffect(() => {
      setTimeout(() => {
        setAnimation("open");
      }, 50);
      push("#alert");
      clearTimeout(timer);
      return () => {
        window.onpopstate = null;
        pop();
      };
    }, []);

    return (
      <BG
        onClick={(e) => {
          e.stopPropagation();
          setTimeout(() => {
            if (onCancel !== undefined) onCancel();
          }, 100);
          // ButtonClose();
          history.back();
        }}
        animation={animation}
        onTransitionEnd={() => {
          if (animation === "close") {
            setOpen(false);
          }
        }}
      >
        <Popup onClick={(event) => event.stopPropagation()}>
          <span>{mainText}</span>
          <span>{subText}</span>

          <ButtonWrapper>
            <button
              onClick={() => {
                setTimeout(() => {
                  if (onCancel !== undefined) onCancel();
                }, 100);
                // ButtonClose();
                history.back();
              }}
            >
              취소
            </button>
            <button
              onClick={() => {
                setTimeout(() => {
                  onSuccess();
                }, 100);
                setAnimation("close");
                // history.back();
              }}
            >
              확인
            </button>
          </ButtonWrapper>
        </Popup>
      </BG>
    );
  };

  return {
    openAlert: ({ mainText, subText, onSuccess, onCancel }: Props) => {
      setTimeout(() => {
        // const url = location.href + "#alert";
        history.pushState({ page: "modal" }, "", "");
      }, 100);

      setOnSuccess(() => onSuccess);
      onCancel ? setOnCalcel(() => onCancel) : null;
      mainText ? setMainText(mainText) : null;
      subText ? setSubText(subText) : null;

      setOpen(true);
    },
    Alert: useCallback(() => {
      return (
        <>
          {isOpen && (
            <AlertComponent
              mainText={mainText}
              subText={subText}
              onSuccess={onSuccess}
              onCancel={onCancel}
            ></AlertComponent>
          )}
        </>
      );
    }, [isOpen])
  };
};

export default useAlert;

const BG = styled.div<{ animation?: string }>`
  opacity: 0;
  opacity: ${(props) => (props.animation === "open" ? 1 : 0)};
  transition: ease-in 0.3s all;

  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  z-index: 6000;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = styled.div<{ bgColor?: string; borderRadius?: string }>`
  padding: 40px 30px;
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
  margin-top: 14px;
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
