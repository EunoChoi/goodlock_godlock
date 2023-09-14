import styled from "styled-components";
import Animation from "./Animation";

const InputBG = styled.div`
  z-index: 1000;
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
  @media screen and (max-width: 720px) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: auto;
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;

    width: 90%;
  }
`;

const TextArea = styled.textarea`
  padding: 40px;
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
    text-align: center;
    padding: 60px 0px;
    font-size: 1.5em;
    /* font-weight: 600; */
    color: rgba(0, 0, 0, 0.3);
  }
  @media screen and (max-width: 720px) {
    height: 300px;
    /* height: 30vh; */
    border-radius: 5px;
    padding: 20px;
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
  @media screen and (max-width: 720px) {
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

const InputForm = {
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
