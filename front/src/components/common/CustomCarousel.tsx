import React from "react";
import styled from "styled-components";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

// interface Props {
//   children: React.ReactNode;
// }

const CoustomCarousel = ({ children, indicator }: any) => {
  // console.log(indicator);
  return (
    <CarouselWrapper
      showThumbs={false}
      showStatus={false}
      showIndicators={indicator}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <CarouselBtn type="button" onClick={onClickHandler} title={label} left={15} right={null}>
            <NavigateBeforeIcon fontSize="large" />
          </CarouselBtn>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <CarouselBtn type="button" onClick={onClickHandler} title={label} left={null} right={15}>
            <NavigateNextIcon fontSize="large" />
          </CarouselBtn>
        )
      }
      renderIndicator={(onClickHandler, isSelected, index, label) => {
        if (isSelected) {
          return (
            <CarouselIndicator
              color="#c8daf3"
              aria-label={`Selected: ${label} ${index + 1}`}
              title={`Selected: ${label} ${index + 1}`}
            />
          );
        }
        return (
          <CarouselIndicator
            color="white"
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            key={index}
            role="button"
            tabIndex={0}
            title={`${label} ${index + 1}`}
            aria-label={`${label} ${index + 1}`}
          />
        );
      }}
      showArrows={true}
      preventMovementUntilSwipeScrollTolerance={true}
      swipeScrollTolerance={50}
    >
      {children}
    </CarouselWrapper>
  );
};

export default CoustomCarousel;

const CarouselWrapper = styled(Carousel)`
  #imageBox {
    @media (orientation: landscape) and (max-height: 480px) {
      display: flex;

      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
    }
  }
`;
const CarouselBtn = styled.button<{ left: number | null; right: number | null }>`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.8);

  left: ${(props) => (props.left ? props.left + "px" : null)};
  right: ${(props) => (props.right ? props.right + "px" : null)};
  position: absolute;
  z-index: 2;
  top: calc(50% - 15px);
  width: 40px;
  height: 40px;
  border-radius: 100%;
  cursor: pointer;
`;

const CarouselIndicator = styled.li<{ color: string }>`
  background: #fff;
  background: ${(props) => props.color};
  width: 12px;
  height: 12px;
  display: inline-block;
  margin: 0 8px;

  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  cursor: pointer;
`;
