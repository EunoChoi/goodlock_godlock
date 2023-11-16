import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import LogInSignUp from "../../styles/LogInSignUp";
import { ANIMATION_APPEAR, ANIMATION_DISAPPEAR } from "../../styles/Animation";
import styled from "styled-components";

//mui
import CancelIcon from "@mui/icons-material/Cancel";
import IsMobile from "../../functions/IsMobile";

interface AppLayoutProps {
  popupOpen: boolean;
  setPopupOpen: (b: boolean) => void;
  children: React.ReactNode;
}

const PopupBox: React.FC<AppLayoutProps> = ({ popupOpen, setPopupOpen, children }: AppLayoutProps) => {
  const [animation, setAnimation] = useState(ANIMATION_APPEAR);

  const isMobile = IsMobile();
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
  @media (orientation: landscape) and (max-height: 480px) {
    left: calc(55vw + 12px);
  }
`;
