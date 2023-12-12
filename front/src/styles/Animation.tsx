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
  `,
  smoothAppearLeftToRight: keyframes`
    from {
      transform: translateX( -100vw )
    }
    to {
      transform: translateX( 0px )
    }
  `,
  smoothAppearRightToLeft: keyframes`
  from {
    transform: translateX( 0px )
  }
  to {
    transform: translateX( -100vw )
  }
`
};

export default Animation;
