import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

//styled component
import LogInSignUp from "../../styles/LogInSignUp";
import Axios from "../../apis/Axios";

interface Props {
  setToggle: (b: boolean) => void;
  setPopupOpen: (b: boolean) => void;
}
interface LogInForm {
  email: string;
  password: string;
}
interface LoginValue {
  email: string;
  password: string;
}
interface CustomError extends Error {
  response?: {
    data: { message: string };
    status: number;
    headers: string;
  };
}

const LogIn = ({ setToggle }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const login = useMutation(
    (loginValue: LoginValue) =>
      Axios.post("/user/login", {
        email: loginValue.email,
        password: loginValue.password
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        navigate("/main/0");
        window.location.reload();
      },
      onError: (err: CustomError) => {
        toast.error(err.response?.data?.message);
        // alert(err.response?.data?.message);
        if (err.response?.data?.message) {
          console.log(err.response?.data?.message);
        } else {
          toast.error("로그인 중 에러 발생");
        }
        console.log(err);
        console.log("로그인 중 에러 발생");
      }
    }
  );

  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    getValues
  } = useForm<LogInForm>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    login.mutate({ email, password });
  };

  return (
    <LogInSignUp.Wrapper>
      <LogInSignUp.Title>로그인</LogInSignUp.Title>
      <LogInSignUp.Form onSubmit={handleSubmit(onSubmit)}>
        <LogInSignUp.Input
          placeholder="이메일"
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "이메일을 입력해주세요."
            }
          })}
        />
        <LogInSignUp.WarningText>{errors.email?.message}</LogInSignUp.WarningText>
        <LogInSignUp.Input
          placeholder="비밀번호"
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "비밀번호를 입력해주세요."
            }
          })}
        />
        <LogInSignUp.WarningText>{errors.password?.message}</LogInSignUp.WarningText>
        <LogInSignUp.TextWrapper>
          <LogInSignUp.Text color="#4284F3" pointer={true} onClick={() => toast.error("구현 예정")}>
            혹시 비밀번호를 잊으셨나요?
          </LogInSignUp.Text>
        </LogInSignUp.TextWrapper>
        <LogInSignUp.Button disabled={!isDirty || !isValid} bgColor="">
          로그인
        </LogInSignUp.Button>
      </LogInSignUp.Form>

      <LogInSignUp.TextWrapper>
        <LogInSignUp.Text color="" pointer={false}>
          아직 회원이 아니신가요?
        </LogInSignUp.Text>
        <LogInSignUp.Text
          color="#4284F3"
          pointer={true}
          onClick={() => {
            setToggle(false);
          }}
        >
          회원가입
        </LogInSignUp.Text>
      </LogInSignUp.TextWrapper>
      <LogInSignUp.Bar />
      <LogInSignUp.Button bgColor="#4284F3" onClick={() => toast.error("구현 예정")}>
        구글 아이디로 로그인
      </LogInSignUp.Button>
    </LogInSignUp.Wrapper>
  );
};

export default LogIn;
