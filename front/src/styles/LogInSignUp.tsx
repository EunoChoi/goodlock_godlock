import styled from "styled-components";
import Animation, { ANIMATION_APPEAR } from "./Animation";

/* eslint-disable */
const LogInSignUp = {
  Background: styled.div<{ animation: string }>`
    z-index: 20;
    /* transition: all ease-in-out 0.2s; */
    width: 100vw;
    height: 100vh;

    position: absolute;
    top: 0;
    left: 0;
    /* background: rgba(0, 0, 0, 0.05); */
    backdrop-filter: blur(12px);

    animation: ${(props) =>
      props.animation === ANIMATION_APPEAR
        ? Animation.smoothAppear
        : Animation.smoothDisappear}
      0.5s;
    @media (orientation: portrait) or (max-height: 480px) {
        height: calc(var(--vh, 1vh) * 100);
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
  `,
  Box: styled.div`
    width: 500px;
    height: 100vh; //모바일에서 380px, 데스크탑에선 500px

    padding: 60px 100px;
    background-color: white;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.7);
    /* border-radius: 24px; */

    position: absolute;
    /* transform: translate(-50%, -50%); */
    top: 0;
    right: 0;
    @media (orientation: portrait) or (max-height: 480px) {
      width: 100vw;
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      overflow-y: scroll;

      padding: 60px 50px;

      /* position: static; */
    }
    @media (orientation: landscape) and (max-height: 480px) {
      width: 45vw;
      padding: 0px 4vw;
      overflow-y: scroll;
    }
  `,
  Wrapper: styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    animation: ${Animation.smoothAppear} 0.6s;

    
    @media (orientation: portrait) or (max-height: 480px) {
      justify-content: start;
    }
    @media (orientation: landscape) and (max-height: 480px) {
      justify-content: start;
      
      height: auto;
      margin: 40px 0;
    }

  `,
  Form: styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  `,
  Title: styled.span`
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 30px;
    font-weight: 600;
  `,
  TextWrapper: styled.div`
    margin-top: 28px;
  `,
  Text: styled.span<{ color: string; pointer: boolean }>`
    font-size: 14px;
    font-weight: 400;
    margin: 0px 5px;

    cursor: ${(props) => props.pointer && "Pointer"};
    color: ${(props) => props.color || "black"};
  `,
  Button: styled.button<{ bgColor: string }>`
    transition: all 0.7s ease-in-out;
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 6px;
    background-color: ${(props) => props.bgColor || "rgb(190, 190, 231)"};
    color: white;
    margin-top: 28px;
    font-size: 16px;
    flex-shrink: 0;
    &:disabled{
      background-color: lightgrey;
    }
  `,
  Input: styled.input`
    width: 100%;
    height: 50px;
    border: none;
    /* margin-top: 10px; */
    border: 1px solid #cacaca;
    border-radius: 6px;
    padding: 0 15px;

    font-size: 16px;

    outline: none;
  `,
  FakePassword: styled.input`
    position: absolute;
    top: 0;
    left: 0;
    z-index: -100;

    -webkit-text-security: disc;
    width: 0;
    /* display: none; */
  `,

  Bar: styled.div`
    font-size: 16px;
    margin-top: 28px;
    background-color: #cacaca;
    width: 100%;
    height: 1px;
    position: relative;
    &::before {
      content: "Or";
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      background-color: white;
      padding: 0px 15px;
    }
  `,
  WarningText: styled.span`
    color: salmon;
    margin: 10px 0px;
    text-align: center;
  `
};

export default LogInSignUp;
