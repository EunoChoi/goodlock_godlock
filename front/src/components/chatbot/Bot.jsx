import React, { useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import styled, { ThemeProvider } from "styled-components";
import IsMobile from "../../functions/IsMobile";

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

const Bot = () => {
  const user = User.getData();
  const isMobile = IsMobile();
  const [open, setOpen] = useState(false);

  const steps = [
    {
      id: "1",
      message: "안녕하세요. 굿락갓락입니다.",
      trigger: "2"
    },
    {
      id: "2",
      options: [
        { value: 1, label: "사이트 소개", trigger: "3" },
        { value: 2, label: "이용 안내", trigger: "3" },
        { value: 3, label: "문의", trigger: "3" },
        { value: 4, label: "처음으로", trigger: "3" }
      ]
    },
    {
      id: "3",
      // message: "Wrong answer, try again.",
      component: (
        <div>
          This is an example component
          <input />
          <button>메일 발송</button>
        </div>
      ),
      trigger: "4"
    },
    {
      id: "4",
      options: [
        { value: 1, label: "Number 1", trigger: "3" },
        { value: 2, label: "Number 2", trigger: "3" },
        { value: 3, label: "Number 3", trigger: "3" }
      ]
    }
  ];

  useEffect(() => {
    if (open && isMobile) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        floatingIcon={
          <IconWrapper>
            <SmartToyIcon color="inherit" />
          </IconWrapper>
        }
        opened={open}
        toggleFloating={(res) => {
          // console.log(res);
          setOpen(res.opened);
        }}
        floating={true}
        headerTitle={"굿락갓락 Bot"}
        botAvatar={"/img/loading.png"}
        userAvatar={user?.profilePic ? user?.profilePic : "/img/loading.png"}
        placeholder={"..."}
        steps={steps}
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
