import React from "react";
import ChatBot from "react-simple-chatbot";
import styled, { ThemeProvider } from "styled-components";

import User from "../../functions/reactQuery/User";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Pretendard",
  headerBgColor: "#C7D9F3",
  headerFontColor: "#4a4a4a",
  headerFontSize: "18px",
  botBubbleColor: "#C7D9F3",
  botFontColor: "#4a4a4a",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a"
};

// const avatar = `${process.env.PUBLIC_URL}/img/loading.png`;

const Bot = () => {
  const { profilePic } = User.getData();
  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        floatingIcon={
          <IconWrapper>
            <SmartToyIcon color="inherit" />
          </IconWrapper>
        }
        floating={true}
        headerTitle={"굿락갓락 Bot"}
        botAvatar={"/img/loading.png"}
        userAvatar={profilePic}
        placeholder={"..."}
        steps={[
          {
            id: "1",
            message: "What number I am thinking?",
            trigger: "2"
          },
          {
            id: "2",
            options: [
              { value: 1, label: "Number 1", trigger: "3" },
              { value: 2, label: "Number 2", trigger: "3" },
              { value: 3, label: "Number 3", trigger: "3" }
            ]
          },
          {
            id: "3",
            message: "Wrong answer, try again.",
            trigger: "2"
          },
          {
            id: "3",
            options: [{ value: 1, label: "go back", trigger: "1" }]
          }
        ]}
      />
    </ThemeProvider>
  );
};

export default Bot;

const IconWrapper = styled.div`
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;