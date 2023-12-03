import { useMutation } from "@tanstack/react-query";
import Axios from "../../apis/Axios";

const Auth = {
  codeSendForSignUp: () => {
    return useMutation(({ email }: { email: string }) => {
      return Axios.post("auth/code", { email });
    });
  },
  codeSendForFindPW: () => {
    return useMutation(({ email }: { email: string }) => {
      return Axios.post("auth/code/find/password", { email });
    });
  },
  codeCheck: () => {
    return useMutation(({ code, authCode }: { code: string; authCode: string }) => {
      return Axios.post("auth/code/check", { code, authCode });
    });
  },
  passwordUpdate: () => {
    return useMutation(({ email }: { email: string }) => {
      return Axios.post("auth/password/reset", { email });
    });
  }
};

export default Auth;
