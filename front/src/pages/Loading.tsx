import React, { ReactElement } from "react";
import styled from "styled-components";

const Loading = () => {
  return (
    <LoadingWrapper>
      <img src={`${process.env.PUBLIC_URL}/img/loading.png`}></img>
      <img src={`${process.env.PUBLIC_URL}/img/loading.gif`}></img>
    </LoadingWrapper>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img:first-child {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
  img:nth-child(2) {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
`;
