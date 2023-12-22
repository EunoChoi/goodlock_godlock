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
  border-right: 2px solid rgba(0, 0, 0, 0.1);

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
  width: 108px;
  height: 108px;

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
const UserInfoWrapper = styled.div`
  width: 100%;
  height: 45%;
  /* border: 1px solid white; */

  padding: 0 20px;

  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;

  #info_text_box {
    margin: 16px 0;
    display: flex;
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
    font-size: 32px;
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
    font-size: 17px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);

    text-align: center;
  }
  .info_box {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span:first-child {
      font-weight: 600;
      font-size: 18px;

      color: rgba(0, 0, 0, 0.7);
    }
    span:nth-child(2) {
      font-weight: 500;
      font-size: 13px;

      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
const MenuWrapper = styled.div<{ currentPage: number | undefined }>`
  width: 100%;
  height: 45%;
  /* border: 1px solid white; */

  padding: 0 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  #buttons {
    button {
      transition: 0.2s ease-in-out all;
    }
    button:hover {
      scale: 1.1;
    }
    button:nth-child(${(props) => props.currentPage}) {
      color: #d5a8d0;
    }
  }
  #logout {
    transition: 0.2s ease-in-out all;
  }
  #logout:hover {
    scale: 1.1;
  }

  div {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    button {
      display: flex;
      justify-content: center;
      align-items: center;

      font-weight: 600;
      font-size: 18px;

      margin: 8px 0;
      * {
        margin-right: 8px;
      }

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
  border-right: rgba(0, 0, 0, 0.02) solid 2px;
`;

const SideBar = { BG, MobileWrapper, PCWrapper, LogInWrapper, ProfilePic, HeaderWrapper, UserInfoWrapper, MenuWrapper };

export default SideBar;
