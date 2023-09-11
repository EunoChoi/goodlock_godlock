import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import LogInSignUp from "../../styles/LogInSignUp";
import { ANIMATION_APPEAR, ANIMATION_DISAPPEAR } from "../../styles/Animation";
import styled from "styled-components";

//mui
import CancelIcon from "@mui/icons-material/Cancel";

interface AppLayoutProps {
  popupOpen: boolean;
  setPopupOpen: (b: boolean) => void;
  children: React.ReactNode;
}

const PopupBox: React.FC<AppLayoutProps> = ({ popupOpen, setPopupOpen, children }: AppLayoutProps) => {
  const [animation, setAnimation] = useState(ANIMATION_APPEAR);

  const isMobile = useMediaQuery({ maxWidth: 720 });

  return (
    <>
      {popupOpen && (
        <LogInSignUp.Background
          animation={animation}
          onClick={() => {
            setAnimation(ANIMATION_DISAPPEAR);
            setTimeout(() => {
              setPopupOpen(false);
            }, 400);
          }}
        >
          {isMobile || (
            <WelcomeText>
              <span>나랑문학 소개 글 들어갈 공간 - 1</span>
              <span>나랑문학 소개 글 들어갈 공간 - 2</span>
            </WelcomeText>
          )}
          <LogInSignUp.Box onClick={(e) => e.stopPropagation()}>{children}</LogInSignUp.Box>
          {isMobile && (
            <CancelBtn>
              <CancelIcon fontSize="large" />
            </CancelBtn>
          )}
        </LogInSignUp.Background>
      )}
    </>
  );
};

export default PopupBox;

const CancelBtn = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  color: black;
`;
const WelcomeText = styled.div`
  width: calc(100vw - 500px);
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* white-space: pre; */
  font-size: 2em;
  color: white;
  font-weight: 600;
  span {
    padding: 12px;
  }
`;
