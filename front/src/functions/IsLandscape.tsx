import { useMediaQuery } from "react-responsive";

const IsLandscape = () => {
  return useMediaQuery({ query: "(orientation:landscape)" });
};

export default IsLandscape;
