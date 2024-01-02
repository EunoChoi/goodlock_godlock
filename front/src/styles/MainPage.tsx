import styled from "styled-components";
import Animation from "./Animation";

const EmptyNoti = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 72px;
  color: rgba(0, 0, 0, 0.5);
  /* font-weight: 600; */
  span {
    margin-top: 20px;
    font-size: 20px;
    font-weight: 500;
  }
`;
const LoadingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3e0f1;
  margin: 32px 0;
`;

const HomeEl = styled.div`
  min-height: calc(100vh - 68px);
  animation: ${Animation.smoothAppear} 1s ease-in-out;
  min-width: 700px;
  width: 70%;

  display: flex;
  justify-content: center;
  align-items: start;
  #posts {
    width: 500px;
  }
  #tags {
    overflow-x: scroll !important;
    position: sticky;
    top: 80px;

    width: calc(100% - 500px);
    /* min-width: 120px; */

    /* margin-left: 36px; */

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: end;

    /* border: 1px solid rgba(0, 0, 0, 0.2); */
    span {
      /* padding-left: 36px; */
      font-size: 18px;
      line-height: 36px;
      color: rgba(0, 0, 0, 0.6);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .title {
      font-size: 22px;
      font-weight: 600;
      /* line-height: 56px; */
      text-transform: capitalize;
      color: rgba(0, 0, 0, 0.7);
    }
    .subTitle {
      margin: 12px 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 36px;
    }
  }

  @media (orientation: portrait) or (max-height: 480px) {
    min-height: calc(100vh - 116px);
    width: auto;
    min-width: auto;
    #posts {
      width: auto;
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 400px;
  }
`;
const MainEl = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  animation: ${Animation.smoothAppear} 0.5s ease-in-out;
`;

const Pill = {
  Wrapper: styled.div`
    z-index: 80;
    position: sticky;
    top: 0px;

    background-color: white;

    display: flex;
    justify-content: start;
    align-items: center;

    padding-top: 24px;
    padding-bottom: 24px;

    margin-bottom: 12px;

    width: 70%;
    min-width: 700px;

    overflow-x: scroll;

    @media (orientation: portrait) or (max-height: 480px) {
      top: 48px;
      top: 47px;
      /* background-color: #c8daf3; */
      background-color: #fff;
      width: 100%;
      min-width: auto;

      padding: 12px 4vw;
      /* margin-top: 12px; */
      margin-bottom: 12px;
    }
    @media (orientation: landscape) and (max-height: 480px) {
      min-width: auto;
      width: 400px;
      padding-left: 0;
      top: 0px;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  `,
  Search: styled.button<{ toggle: boolean }>`
    transition: all ease-in-out 0.5s;
    padding: 8px 16px;
    width: ${(props) => (props.toggle ? "200px" : "62px")};
    border: solid 2px rgba(0, 0, 0, 0.05);
    height: 32px;
    border-radius: 100px;

    font-size: 18px;

    /* box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3); */
    color: #464b53;
    background-color: #e3ecf9;
    background-color: ${({ toggle }) => toggle && "#f3e0f1"};

    form {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
    }
    input {
      opacity: 0;
      transition: all ease-in-out 0.5s;
      outline: none;
      width: 0;
      height: 24px;
      font-size: 18px;
      border-radius: 100px;
      border: none;

      font-weight: 500;

      background-color: ${({ toggle }) => toggle && "rgba(255, 255, 255, 0.8)"};
      opacity: ${({ toggle }) => toggle && "1"};
      padding: ${({ toggle }) => toggle && "0 10px"};
      flex-grow: ${({ toggle }) => toggle && "1"};

      &::placeholder {
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
      }
    }
    @media (orientation: portrait) or (max-height: 480px) {
      width: ${(props) => props.toggle && "50%"};
      flex-grow: ${({ toggle }) => toggle && "1"};
    }
  `,
  Sub: styled.button<{ toggle: number }>`
    transition: all ease-in-out 0.5s;
    height: 32px;
    padding: 0px 16px;
    margin-right: 8px;
    border-radius: 100px;
    border: solid 2px rgba(0, 0, 0, 0.05);

    font-size: 18px;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    /* box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3); */
    color: #464b53;
    background-color: #e3ecf9;
    > span {
      margin-left: 4px;
      font-weight: 500;
    }
    &:nth-child(${(props) => props.toggle + 1}) {
      background-color: #f3e0f1;
    }
  `
};

const Space = styled.div<{ height: number }>`
  height: ${(props) => props.height + "px"};
`;

const TextWrapper = styled.div`
  width: 70%;
  min-width: 700px;
  padding-top: 64px;
  padding-bottom: 24px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  @media (orientation: portrait) or (max-height: 480px) {
    width: 100%;
    padding-top: 50px;
    min-width: auto;
    /* padding-left: 4vw; */
    margin-top: 48px; //header height
    padding-bottom: 24px;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 400px;
    min-width: auto;
    padding-left: 0;
    margin-top: 0;
    padding-top: 24px;
  }
`;
const TextWrapper_Title = styled.span`
  font-size: 44px;
  line-height: 48px;
  font-weight: 600;
  font-weight: 700;

  text-transform: uppercase;

  max-width: 100%;
  white-space: nowrap;
  overflow: scroll;

  display: flex;
  justify-content: start;
  align-items: center;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  color: #6e748e;
  color: #bc9dcf;
  color: #d5a8d0;
  color: rgba(0, 0, 0, 0.7);
  @media (orientation: portrait) {
    padding-left: 4vw;
  }
`;

const TextWrapper_Bold = styled.span`
  font-size: 30px;
  line-height: 40px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;

  text-transform: capitalize;
  color: rgba(0, 0, 0, 0.65);

  #icon {
    margin-right: 4px;
    color: #dd4e5c;
  }
  @media (orientation: portrait) {
    padding-left: 4vw;
  }
`;
const TextWrapper_SubBold = styled.span`
  font-size: 22px;
  line-height: 40px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.6);
  @media (orientation: portrait) {
    padding-left: 4vw;
  }
`;
const TextWrapper_Bold_Color = styled.span`
  font-size: 30px;
  line-height: 40px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #8096b5;
  @media (orientation: portrait) {
    padding-left: 4vw;
  }
`;
const TextWrapper_Normal = styled.span`
  font-size: 18px;
  line-height: 28px;
  font-weight: 500;

  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.65);
  @media (orientation: portrait) {
    padding-left: 4vw;
  }
`;
const TopWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;

  width: 100%;
  height: auto;

  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  @media (orientation: portrait) {
    padding-left: 4vw;
  }
`;
const TopPostWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;

  animation: ${Animation.smoothAppear} 300ms ease-out;

  margin-right: 12px;
  &:last-child {
    margin-right: 0px;
  }
  @media (orientation: portrait) {
    &:last-child {
      margin-right: 4vw !important;
    }
  }

  height: auto;
  #info {
    span {
      font-size: 18px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
    }
    span:nth-child(2) {
      margin-left: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(0, 0, 0, 0.7);
      #icon {
        color: #a9aed4;
        margin-right: 2px;
      }
      #icon2 {
        color: #d5a8d0;
        margin-right: 2px;
      }
    }
    span:nth-child(3) {
      margin-left: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(0, 0, 0, 0.7);
      #icon {
        color: rgba(0, 0, 0, 0.7);
        margin-right: 2px;
      }
    }

    padding: 4px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    justify-content: start;
    align-items: center;
  }
`;
const TopPost = styled.div`
  width: 130px;
  height: 130px;
  flex-shrink: 0;

  background-color: #fafafa;
  border-radius: 6px;
  border: solid 2px rgba(0, 0, 0, 0.07);

  display: flex;
  justify-content: center;
  align-items: center;

  #image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
  #text {
    width: 90%;
    /* padding: 8px; */
    //줄바꿈 표시
    white-space: pre-wrap;
    overflow-wrap: break-word;
    overflow-y: scroll;
    text-overflow: ellipsis;

    line-height: 1.3em;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.65);

    display: -webkit-box;
    -webkit-line-clamp: 4; /* 원하는 줄 수 표시 */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const MainPageStyle = {
  TopWrapper,
  TopPost,
  TopPostWrapper,
  EmptyNoti,
  LoadingIconWrapper,
  HomeEl,
  MainEl,
  Pill,
  Space,
  TextWrapper,
  TextWrapper_Title,
  TextWrapper_Bold,
  TextWrapper_SubBold,
  TextWrapper_Bold_Color,
  TextWrapper_Normal
};

export default MainPageStyle;
