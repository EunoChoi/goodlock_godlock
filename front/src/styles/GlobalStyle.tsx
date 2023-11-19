// styles/GlobalStyle
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import "../fonts/pretendard.css";

const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'OAGothic-ExtraBold';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/OAGothic-ExtraBold.woff2') format('woff2');
      font-weight: 800;
      font-style: normal;
  }
  ${reset}
  * {
    font-family: Pretendard;
    -webkit-tap-highlight-color : transparent !important;
    box-sizing: border-box;
  }
  span, div, button{
   font-family: Pretendard;
   font-weight: 400;
   /* font-weight: 500; */
   /* color: rgba(0,0,0,0.7) */
  }
  
  html{
    background-color: whitesmoke;

  }

  
  a {
  color: inherit;
  text-decoration: none;
  }
  li {
  list-style: none;
  }

  button{
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color : transparent !important;
  }
`;

export default GlobalStyle;
