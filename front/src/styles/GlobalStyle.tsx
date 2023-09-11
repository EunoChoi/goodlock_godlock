// styles/GlobalStyle
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Animation from "./Animation";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard-SemiBold';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Medium.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
  ${reset}
  * {
    box-sizing: border-box;
    /* font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
    font-family: Pretendard-SemiBold, system-ui, -apple-system;
  }
  span, div{
    /* font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
    font-family: Pretendard-SemiBold, system-ui, -apple-system;
  }
  a {
  color: inherit;
  text-decoration: none;
  }
  li {
  list-style: none;
  }

  button{
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
`;

export default GlobalStyle;
