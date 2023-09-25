import React, { ReactElement } from "react";
import styled from "styled-components";

const Loading = () => {
  return (
    <LoadingWrapper>
      <img src={`${process.env.PUBLIC_URL}/img/loading.gif`}></img>
      <span>NARANG</span>
    </LoadingWrapper>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    /* margin-top: 30px; */
    color: #d7dbef;
    font-size: 3em;
    /* font-weight: 800; */
  }
`;
