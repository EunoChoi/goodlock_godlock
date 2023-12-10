import styled from "styled-components";
import Animation from "./Animation";

const InputBG = styled.div`
  z-index: 1010;
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  /* background: rgba(255, 255, 255, 0.5); */
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  animation: ${Animation.smoothAppear} 0.3s;
`;
const EditBG = styled.div`
  z-index: 1010;
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  /* background: rgba(255, 255, 255, 0.5); */
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  animation: ${Animation.smoothAppear} 0.3s;
`;
const InputWrapper = styled.div`
  transition: all ease-in-out 0.5s;
  position: fixed;
  right: 0;
  top: 0;
  /* transform: translate(-50%, -50%); */
  height: 100vh;
  width: 500px;
  /* margin-bottom: 20px; */
  background-color: #fff;
  /* box-shadow: -10px 2px 10px rgba(0, 0, 0, 0.3); */
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);
  /* border-radius: 5px; */

  display: -webkit-box;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  @media (orientation: portrait) or (max-height: 480px) {
    position: fixed;
    left: 0;
    top: 0;

    height: calc(var(--vh, 1vh) * 100);
    width: 100%;

    background-color: #fff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
`;

const TextArea = styled.textarea`
  padding: 25px 40px;
  resize: none;

  width: 100%;
  flex-grow: 1;
  -webkit-box-flex: 1;

  background-color: #fff;
  /* border-radius: 7px 7px 0px 0px; */

  font-size: 1.1em;

  border: none;
  &:focus {
    outline: none;
  }
  &::placeholder {
    position: absolute;
    left: 50%;
    bottom: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    color: rgba(0, 0, 0, 0.3);
  }
  @media (orientation: portrait) or (max-height: 480px) {
    /* height: 300px; */
    /* height: 30vh; */
    border-radius: 5px;
    padding: 15px 20px;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100%;
  flex-shrink: 0;
  /* background-color: rgb(255, 192, 62); */
  background-color: #cbdcf3;
  /* border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px; */

  padding: 0px 10px;
  box-shadow: 0px -3px 20px rgba(0, 0, 0, 0.15);
  @media (orientation: portrait) or (max-height: 480px) {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 50px;
  }
`;

const InputImageWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  padding: 10px 0px;
  width: 100%;
  height: 150px;
  background-color: #cbdcf3;
`;

const InputImageBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
`;
const InputImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;
const ImageDeleteButton = styled.button`
  border: none;
  padding-top: 7px;
  font-weight: 600;
  span {
    color: grey;
  }
`;

const LoadingBox = styled.div`
  color: white;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateButton = styled.button`
  font-size: 16px;
  font-weight: 500;
  width: 150px;
  height: 32px;
  border: 2px solid #cbdbf3;
  border: 2px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  outline: none;

  text-align: center;
  @media (orientation: portrait) or (max-height: 480px) {
    width: calc((100vw - 40px - 24px) / 2);
  }
`;
const PostOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 130px;
  height: auto;

  padding: 30px 40px;
  padding-bottom: 5px;

  color: rgba(0, 0, 0, 0.8);

  @media (orientation: portrait) or (max-height: 480px) {
    padding: 20px;
    padding-bottom: 5px;
    height: 110px;
    height: auto;
  }

  > div:first-child {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;

    span {
      font-weight: 500;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const PostOptionValue = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;

  margin-top: 12px;
  color: rgba(0, 0, 0, 0.6);

  input {
    color: rgba(0, 0, 0, 0.8);
    font-size: 16px;
    width: 100%;

    height: 32px;
    border: 2px solid #cbdbf3;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    outline: none;
    padding: 0 8px;

    &::placeholder {
      text-align: center;
    }
  }

  @media (orientation: portrait) or (max-height: 480px) {
    justify-content: center;
  }
`;

const FlexButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0px 8px;
  color: rgba(0, 0, 0, 0.7);
  /* font-weight: 600; */
  font-size: 1.1em;
  span {
    font-weight: 500;
    padding-left: 5px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColorIcon = styled.span`
  color: white;
`;

const InputForm = {
  LoadingBox,
  DateButton,
  PostOptionWrapper,
  PostOptionValue,
  FlexButton,
  ButtonWrapper,
  ColorIcon,
  InputImageWrapper,
  InputImageBox,
  InputImage,
  ImageDeleteButton,
  InputBG,
  EditBG,
  InputWrapper,
  TextArea,
  ButtonArea
};

export default InputForm;
