import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Axios from "../../apis/Axios";

//styled component
import LogInSignUp from "../../styles/LogInSignUp";

interface SignInForm {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
}
interface Props {
  setToggle: (b: boolean) => void;
}

const SignUp = ({ setToggle }: Props) => {
  const {
    register,
    formState: { errors, isDirty, isValid },
    watch,
    handleSubmit,
    getValues
  } = useForm<SignInForm>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      passwordCheck: ""
    }
  });

  const onSubmit = () => {
    const { email, nickname, password } = getValues();

    Axios.post("/user/register", {
      email,
      nickname,
      password
    })
      .then((res) => {
        setToggle(true);
        toast.success(res.data);
        // alert(res.data);
      })
      .catch((res) => {
        console.log(res);
        toast.error(res?.response?.data);
        // alert(res.response.data);
      });
  };

  return (
    <LogInSignUp.Wrapper>
      <LogInSignUp.Title>회원가입</LogInSignUp.Title>
      <LogInSignUp.Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <LogInSignUp.Input
          placeholder="이메일"
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "이메일을 입력해주세요."
            },
            maxLength: {
              value: 30,
              message: "최대 30자 입력가능합니다."
            },
            pattern: {
              value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              message: "이메일 형식에 맞지 않습니다."
            }
          })}
        ></LogInSignUp.Input>
        <LogInSignUp.WarningText>{errors.email?.message}</LogInSignUp.WarningText>
        <LogInSignUp.Input
          placeholder="닉네임"
          type="text"
          {...register("nickname", {
            required: {
              value: true,
              message: "닉네임을 입력해주세요."
            },
            maxLength: {
              value: 10,
              message: "최대 10자 입력가능합니다."
            },
            pattern: {
              value: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/i,
              message: "2자 이상 10자 이하, 영어 또는 숫자 또는 한글"
            }
          })}
        ></LogInSignUp.Input>
        <LogInSignUp.WarningText>{errors.nickname?.message}</LogInSignUp.WarningText>

        <LogInSignUp.FakePassword></LogInSignUp.FakePassword>
        <LogInSignUp.FakePassword></LogInSignUp.FakePassword>
        <LogInSignUp.Input
          placeholder="비밀번호"
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "비밀번호를 입력해주세요."
            },
            minLength: {
              value: 8,
              message: "최소 8자 이상 입력해주세요."
            },
            maxLength: {
              value: 30,
              message: "최대 30자 입력가능합니다."
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
              message: "최소 8자, 영문자, 숫자, 특수 문자(@$!%*#?&) 최소 하나씩 포함 필요"
            }
          })}
        ></LogInSignUp.Input>
        <LogInSignUp.WarningText>{errors.password?.message}</LogInSignUp.WarningText>
        <LogInSignUp.Input
          placeholder="비밀번호 확인"
          type="password"
          {...register("passwordCheck", {
            required: {
              value: true,
              message: "비밀번호를 입력해주세요."
            },
            minLength: {
              value: 8,
              message: "최소 8자 이상 입력해주세요."
            },
            maxLength: {
              value: 30,
              message: "최대 30자 입력가능합니다."
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
              message: "최소 8자, 영문자, 숫자, 특수 문자(@$!%*#?&) 최소 하나씩 포함 필요"
            },
            validate: (value: string) => {
              if (watch("password") != value) {
                return "비밀번호가 일치하지 않습니다.";
              }
            }
          })}
        ></LogInSignUp.Input>
        <LogInSignUp.WarningText>{errors.passwordCheck?.message}</LogInSignUp.WarningText>
        <LogInSignUp.Button type="submit" disabled={!isDirty || !isValid} bgColor="">
          회원가입
        </LogInSignUp.Button>
      </LogInSignUp.Form>

      <LogInSignUp.TextWrapper>
        <LogInSignUp.Text color="" pointer={false}>
          이미 계정이 있으신가요?
        </LogInSignUp.Text>
        <LogInSignUp.Text color="#4284F3" pointer={true} onClick={() => setToggle(true)}>
          로그인
        </LogInSignUp.Text>
      </LogInSignUp.TextWrapper>
      <LogInSignUp.Bar></LogInSignUp.Bar>
      <LogInSignUp.Button bgColor="#4284F3" onClick={() => toast.error("구현 예정")}>
        구글 아이디로 로그인
      </LogInSignUp.Button>
    </LogInSignUp.Wrapper>
  );
};

export default SignUp;
