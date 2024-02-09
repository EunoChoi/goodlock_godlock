import styled from "styled-components";
import Img from "../components/common/Img";

const BG = styled.div<{ animation: string }>`
  position: fixed;
  top: 0;
  left: 0;

  z-index: 2000;

  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);

  opacity: ${(props) => (props.animation === "open" ? "1" : "0")};
  transition: all linear 300ms;
`;

const MobileWrapper = styled.div<{ animation: string }>`
  position: fixed;
  top: 0;
  left: 0;

  z-index: 2002;

  width: 80vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  background-color: #f2f2f2;
  /* border-right: 2px solid rgba(0, 0, 0, 0.1); */
  background-color: #f1f1f1;
  box-shadow: 2px 0px 3px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(45deg, #f1f1f1 0%, #f7f7f7 100%);

  transform: ${(props) => (props.animation === "open" ? "translateX(0px)" : "translateX(-80vw)")};
  transition: all ease-out 300ms;
`;

const LogInWrapper = styled.div`
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
  button {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);

    padding: 4px 16px;

    border: 2px solid rgba(0, 0, 0, 0.05);
    border-radius: 50px;
    background-color: #c7d7ff;

    margin-top: 24px;
  }
`;

const ProfilePic = styled(Img)`
  width: 96px;
  height: 96px;

  border-radius: 100%;
  border: 2px solid rgba(0, 0, 0, 0.1);

  cursor: pointer;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: 10%;
  /* border: 1px solid white; */

  padding: 0 30px;

  display: flex;
  justify-content: start;
  align-items: center;
  button {
    display: flex;
    justify-content: center;
    align-items: center;

    color: #d5a8d0;
    font-size: 26px;
    span {
      margin-left: 4px;
      font-family: OAGothic-ExtraBold;
      color: rgba(0, 0, 0, 0.7);

      font-size: 24px;
      font-weight: 600;
    }
  }
`;
const UserInfoWrapper = styled.div<{ animation?: string }>`
  opacity: 1;
  opacity: ${(props) => props.animation === "" && "0"};
  opacity: ${(props) => props.animation === "open" && "1"};
  transition: 600ms ease-in-out all;

  width: 100%;
  height: 40%;

  padding: 0 30px;

  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;

  #info_text_box {
    margin: 16px 0;
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    span {
      padding: 6px 0;
      /* margin: 4px 0; */
    }
  }

  #nickname {
    font-size: 28px;
    font-weight: 600;

    max-width: 100%;
    white-space: nowrap;
    overflow-x: scroll;

    display: flex;
    justify-content: start;
    align-items: center;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    color: rgba(0, 0, 0, 0.7);
  }
  #email {
    font-size: 14px;
    font-weight: 500;

    color: rgba(0, 0, 0, 0.35);
  }
  #usertext {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);

    width: 100%;
    white-space: nowrap;
    overflow-x: scroll;
    /* text-overflow: ellipsis; */

    text-align: center;
    text-align: start;
  }
  .info_box {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span:first-child {
      font-weight: 600;
      font-size: 16px;

      color: rgba(0, 0, 0, 0.7);
    }
    span:nth-child(2) {
      font-weight: 500;
      font-size: 12px;

      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
const MenuWrapper = styled.div<{ currentPage: number | undefined; animation?: string }>`
  width: 100%;
  height: 50%;

  padding: 0 30px;
  padding-top: 16px;

  display: flex;
  justify-content: center;
  align-items: start;

  div {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }

  #buttons {
    button {
      display: flex;
      justify-content: center;
      align-items: center;

      margin: 8px 0;
      * {
        margin-right: 8px;
      }

      font-weight: 600;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.7);

      padding: 0 10px;
      opacity: 1;
      opacity: ${(props) => props.animation === "" && "0"};
      opacity: ${(props) => props.animation === "open" && "1"};

      transition: 450ms ease-in-out all;
    }
    button:nth-child(1) {
      transition-delay: 200ms;
    }
    button:nth-child(2) {
      transition-delay: 300ms;
    }
    button:nth-child(3) {
      transition-delay: 400ms;
    }
    button:nth-child(4) {
      transition-delay: 500ms;
    }
    button:nth-child(5) {
      transition-delay: 600ms;
    }

    button:nth-child(${(props) => props.currentPage}) {
      color: #d5a8d0;
    }
    #logout {
      padding: 0 10px;
      transition-delay: 700ms;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const PCWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.05);
  background-color: #f2f2f2;
  border-right: rgba(0, 0, 0, 0.02) solid 1px;
  background-color: #f1f1f1;
  background-image: linear-gradient(45deg, #f1f1f1 0%, #f7f7f7 100%);
`;

const SideBar = {
  BG,
  MobileWrapper,
  PCWrapper,
  LogInWrapper,
  ProfilePic,
  HeaderWrapper,
  UserInfoWrapper,
  MenuWrapper
};

export default SideBar;
