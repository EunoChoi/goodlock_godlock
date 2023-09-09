import styled from "styled-components";

const ChatbotButton = styled.button`
  z-index: 2000;
  position: fixed;
  right: 20px;
  bottom: calc(5% + 75px);

  width: 60px;
  height: 60px;
  border-radius: 60px;
  font-size: 40px;
  font-weight: 800;
  flex-shrink: 0;
  /* color: rgba(0, 0, 0, 0.6); */
  background-color: rgb(255, 192, 62);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
`;

export default ChatbotButton;
