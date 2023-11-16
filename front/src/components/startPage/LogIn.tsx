import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

//styled component
import LogInSignUp from "../../styles/LogInSignUp";
import User from "../../functions/reactQuery/User";

interface Props {
  setToggle: (b: boolean) => void;
  setPopupOpen: (b: boolean) => void;
}
interface LogInForm {
  email: string;
  password: string;
}

const LogIn = ({ setToggle }: Props) => {
  const login = User.login();

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
    if (login.isLoading === false) {
      login.mutate({ email, password });
    }
  };

  return (
    <LogInSignUp.Wrapper>
      <LogInSignUp.Title>로그인</LogInSignUp.Title>
      <LogInSignUp.Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <LogInSignUp.Input
          autoComplete="new-password"
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
          autoComplete="current-password"
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
          <LogInSignUp.Text color="#4284F3" pointer={true} onClick={() => toast.error("구현 예정입니다.")}>
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
      <LogInSignUp.Button bgColor="#4284F3" onClick={() => toast.error("구현 예정입니다.")}>
        구글 아이디로 로그인
      </LogInSignUp.Button>
    </LogInSignUp.Wrapper>
  );
};

export default LogIn;
