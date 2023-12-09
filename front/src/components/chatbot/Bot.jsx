import React, { useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import styled, { ThemeProvider } from "styled-components";
import IsMobile from "../../functions/IsMobile";

import User from "../../functions/reactQuery/User";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const Bot = () => {
  const user = User.getData();
  const isMobile = IsMobile();
  const [open, setOpen] = useState(false);

  const theme = {
    background: "#f5f8fb",
    fontFamily: "Pretendard",
    headerBgColor: "#e7c6e3",
    headerFontColor: "#4a4a4a",
    headerFontSize: "18px",
    botBubbleColor: "#e7c6e3",
    botFontColor: "#4a4a4a",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a"
  };

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
      message: "메인페이지 - 홈",
      trigger: "3-2-1+"
    },
    {
      id: "3-2-1+",
      message: "로그인 후 바로 보이는 페이지로 공지사항과 북마크한 팁&설정 포스트를 확인 할 수 있습니다.",
      trigger: "3-2"
    },
    {
      id: "3-2-2",
      message: "메인페이지 - 팁&설정",
      trigger: "3-2-2+"
    },
    {
      id: "3-2-2+",
      message: "굿락 팁 및 설정을 공유하는 페이지로 공유 버튼을 이용해서 현재 공유중인 포스트만 모아 볼 수 있습니다.",
      trigger: "3-2"
    },
    {
      id: "3-2-3",
      message: "메인페이지 - 소통",
      trigger: "3-2-3+"
    },
    {
      id: "3-2-3+",
      message:
        "자유로운 주제의 게시글 작성이 가능한 페이지로 피드 버튼을 누르면 팔로잉한 유저의 게시글만 모아 볼 수 있습니다.",
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
      message:
        "로그아웃 및 나의 정보 수정이 가능한 페이지 입니다. 내 작성글들을 모아 보여주며 팔로잉, 팔로워 관리가 가능합니다.",
      trigger: "3-3"
    },
    {
      id: "3-3-2",
      message: "다른 유저 정보 페이지",
      trigger: "3-3-2+"
    },
    {
      id: "3-3-2+",
      message:
        "다른 유저의 정보를 요약해서 확인 가능한 페이지 입니다. 팔로우 버튼을 통해 해당 유저를 팔로우할 수 있습니다.",
      trigger: "3-3"
    },
    {
      id: "4",
      options: [
        { value: 1, label: "굿락?", trigger: "4-1" },
        { value: 2, label: "굿락 설정 공유", trigger: "4-2" },
        { value: 3, label: "파일 공유", trigger: "4-3" },
        { value: 4, label: "처음으로", trigger: "1" }
      ]
    },
    {
      id: "4-1",
      message: "굿락(Good Lock)",
      trigger: "4-1+"
    },
    {
      id: "4-1+",
      message: "굿락은 갤럭시의 각종 커스텀 설정이 가능한 앱입니다. 갤럭시 스토어에서 설치가능합니다.",
      trigger: "4"
    },
    {
      id: "4-2",
      message: "굿락 설정 공유(GTS)",
      trigger: "4-2+"
    },
    {
      id: "4-2+",
      message: "GTS를 활용하면 굿락에서 커스텀한 각종 설정을 타유저에게 공유하거나 백업으로 활용이 가느합니다.",
      trigger: "4-2++"
    },
    {
      id: "4-2++",
      message: "GTS(Galaxy to Share)는 '굿락 앱 -> Life Up'에서 설치 가능합니다.",
      trigger: "4"
    },
    {
      id: "4-3",
      message: "파일 공유(Dropship)",
      trigger: "4-3+"
    },
    {
      id: "4-3+",
      message: "Dropship 이용하면 QR코드 혹은 링크를 통해 파일 공유가 가능합니다.",
      trigger: "4-3++"
    },
    {
      id: "4-3++",
      message: "Dropship은 '굿락 앱 -> Life Up'에서 설치 가능합니다.",
      trigger: "4"
    },
    {
      id: "5",
      message: "문의 메일 작성 컴포넌트",
      trigger: "5+"
    },
    {
      id: "5+",
      options: [{ value: 1, label: "처음으로", trigger: "1" }]
    }
  ];

  useEffect(() => {
    if (open === true) {
      //modal url 추가

      //모바일 백그라운드 body 스크롤 방지
      if (isMobile) document.body.style.overflow = "hidden";
    } else {
      //뒤로가기

      //챗봇 모달 꺼졌을때 스크롤 동작
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        floatingIcon={
          <IconWrapper>
            <SmartToyIcon color="inherit" fontSize="medium" />
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