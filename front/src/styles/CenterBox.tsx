import styled from "styled-components";

import Animation from "./Animation";

const CenterBox = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  animation: ${Animation.smoothAppear} 1s;
`;

export default CenterBox;
