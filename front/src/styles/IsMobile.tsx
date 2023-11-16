import { useMediaQuery } from "react-responsive";

const IsMobile = () => {
  return useMediaQuery({ query: "(orientation:portrait) or (max-height:480px)" });
};

export default IsMobile;
