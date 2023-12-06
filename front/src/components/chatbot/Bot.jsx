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
      trigger: "1-1"
    },
    {
      id: "1-1",
      message: "무엇을 도와드릴까요?",
      trigger: "2"
    },
    {
      id: "2",
      options: [
        { value: 1, label: "사이트 소개", trigger: "3" },
        { value: 2, label: "유용한 팁", trigger: "4" },
        { value: 3, label: "문의", trigger: "5" },
        { value: 4, label: "처음으로", trigger: "1" }
      ]
    },
    {
      id: "3",
      options: [
        { value: 1, label: "굿락갓락?", trigger: "3-1" },
        { value: 2, label: "메인페이지", trigger: "3-2" },
        { value: 3, label: "정보페이지", trigger: "3-3" },
        { value: 4, label: "처음으로", trigger: "1" }
      ]
    },
    {
      id: "3-1",
      message:
        "굿락갓락은 굿락 팁과 설정을 공유하는 플랫폼입니다. 굿락갓락에서 굿락 설정과 팁을 다른 사용자들과 공유하고 소통할 수 있습니다.",
      trigger: "3"
    },
    {
      id: "3-2",
      options: [
        { value: 1, label: "홈", trigger: "3-2-1" },
        { value: 2, label: "팁&설정", trigger: "3-2-2" },
        { value: 3, label: "소통", trigger: "3-2-3" },
        { value: 4, label: "처음으로", trigger: "1" }
      ]
    },
    {
      id: "3-2-1",
      message: "메인 - 홈",
      trigger: "3-2-1+"
    },
    {
      id: "3-2-1+",
      message: "설명설명성명",
      trigger: "3-2"
    },
    {
      id: "3-2-2",
      message: "메인 - 팁, 설정 설명",
      trigger: "3-2-2+"
    },
    {
      id: "3-2-2+",
      message: "설명설명성명",
      trigger: "3-2"
    },
    {
      id: "3-2-3",
      message: "메인 - 소통 설명",
      trigger: "3-2-3+"
    },
    {
      id: "3-2-3+",
      message: "설명설명성명",
      trigger: "3-2"
    },
    {
      id: "3-3",
      options: [
        { value: 1, label: "내 정보", trigger: "3-3-1" },
        { value: 2, label: "다른 유저 정보", trigger: "3-3-2" },
        { value: 3, label: "처음으로", trigger: "1" }
      ]
    },
    {
      id: "3-3-1",
      message: "내 정보 페이지",
      trigger: "3-3-1+"
    },
    {
      id: "3-3-1+",
      message: "설명설명성명",
      trigger: "3-3"
    },
    {
      id: "3-3-2",
      message: "다른 유저 정보 페이지",
      trigger: "3-3-2+"
    },
    {
      id: "3-3-2+",
      message: "설명설명성명",
      trigger: "3-3"
    },
    {
      id: "4",
      options: [
        { value: 1, label: "굿락 설치", trigger: "4-1" },
        { value: 2, label: "굿락 설정 공유", trigger: "4-2" },
        { value: 3, label: "파일 공유", trigger: "4-3" },
        { value: 4, label: "처음으로", trigger: "1" }
      ]
    },
    {
      id: "4-1",
      message: "굿락 설치",
      trigger: "4-1+"
    },
    {
      id: "4-1+",
      message: "설명설명성명",
      trigger: "4"
    },
    {
      id: "4-2",
      message: "굿락 설정 공유(gts)",
      trigger: "4-2+"
    },
    {
      id: "4-2+",
      message: "설명설명성명",
      trigger: "4"
    },
    {
      id: "4-3",
      message: "파일 공유(드랍십)",
      trigger: "4-3+"
    },
    {
      id: "4-3+",
      message: "설명설명성명",
      trigger: "4"
    },
    {
      id: "5",
      message: "문의 메일 작성",
      trigger: "5+"
    },
    {
      id: "5+",
      options: [{ value: 1, label: "처음으로", trigger: "1" }]
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
          //open시 modal url 추가;

          //open 상태 업데이트
          setOpen(res.opened);
        }}
        floating={true}
        headerTitle={"굿락갓락 도우미"}
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
