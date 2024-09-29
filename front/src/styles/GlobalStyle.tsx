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
    font-weight: 400;
    -webkit-tap-highlight-color : transparent !important;
    box-sizing: border-box;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
  span, div, button{
   font-family: Pretendard;
   font-weight: 400;
   color: #656565;
  }
  
  html{
    /* background-color: whitesmoke; */
    background-color: #fff;

    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
  }

  body{
    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
    &::-webkit-scrollbar {
      display: none !important; /* Chrome, Safari, Opera*/
    }
  }
  html::-webkit-scrollbar {
    display: none;
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
