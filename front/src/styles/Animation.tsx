import styled, { keyframes } from "styled-components";

export const ANIMATION_APPEAR = "appear";
export const ANIMATION_DISAPPEAR = "disappear";

const Animation = {
  smoothAppear: keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,
  smoothDisappear: keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `,
  smoothAppearDown: keyframes`
    from {
      transform: translateY( -300px )
    }
    to {
      transform: translateY(0px  )
    }
  `,
  smoothDisappearUp: keyframes`
    from {
      transform: translateY( 0px )
    }
    to {
      transform: translateY( -300px )
    }
  `
};

export default Animation;