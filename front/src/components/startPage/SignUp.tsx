import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

//styled component
import LogInSignUp from "../../styles/LogInSignUp";
import User from "../../functions/reactQuery/User";
import styled from "styled-components";

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

  const [authCodeConfirm, setAuthCodeConfirm] = useState(false);
  const [codeRequest, setCodeRequest] = useState(false);
  const [code, setCode] = useState("");
  const signUpFunction = User.signUp();

  const onSubmit = () => {
    const { email, nickname, password } = getValues();
    signUpFunction.mutate({ email, nickname, password });
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

        <LogInSignUp.FakePassword></LogInSignUp.FakePassword>
        <LogInSignUp.FakePassword></LogInSignUp.FakePassword>

        <LogInSignUp.WarningText>{errors.passwordCheck?.message}</LogInSignUp.WarningText>
        {authCodeConfirm ? (
          <SignUpButton type="submit" disabled={!isDirty || !isValid} bgColor="">
            회원가입
          </SignUpButton>
        ) : (
          <AuthCodeWrapper>
            <input placeholder="인증 코드" value={code} onChange={(e) => setCode(e.target.value)} />
            {codeRequest ? (
              <button
                onClick={() => {
                  //인증코드 확인
                  //setauthcode로 결정되는 authcode와 비교해서 인증코드와 일치하는지 확인
                  if ("authcode" === code) {
                    setAuthCodeConfirm(true);
                  }
                }}
              >
                확인
              </button>
            ) : (
              <button
                onClick={() => {
                  const email = getValues();
                  if (email) {
                    //이메일로 보낸 코드를 리턴 = axios 코드 발송 api
                    //setauthcode() 이메일 발송되면 바로 setauthcode로 코드 업데이트
                    //어찌되었든 발송 버튼 눌리기만 하면 authcode가 업데이트 된다.
                    //3분 제한 이런거 필요한가.?
                    //settimeout으로 authcode 변경하면 될듯
                    toast.success("인증번호가 발송되었습니다.");
                    console.log(email);
                  } else {
                    toast.error("이메일 정보가 입력되어있지않습니다.");
                  }
                  // setCodeRequest(true);
                }}
              >
                인증코드 받기
              </button>
            )}
          </AuthCodeWrapper>
        )}
      </LogInSignUp.Form>

      <LogInSignUp.TextWrapper>
        <LogInSignUp.Text color="" pointer={false}>
          이미 계정이 있으신가요?
        </LogInSignUp.Text>
        <LogInSignUp.Text
          color="#4284F3"
          pointer={true}
          onClick={() => {
            setToggle(true);
            setCodeRequest(false); //인증 코드 요청 state
            setAuthCodeConfirm(false); //인증 코드 확인 state
          }}
        >
          로그인
        </LogInSignUp.Text>
      </LogInSignUp.TextWrapper>
    </LogInSignUp.Wrapper>
  );
};

export default SignUp;

const SignUpButton = styled.button<{ bgColor: string }>`
  transition: all 0.7s ease-in-out;
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 6px;
  background-color: rgb(190, 190, 231);
  color: white;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
  &:disabled {
    background-color: lightgrey;
  }
`;
const AuthCodeWrapper = styled.div`
  display: flex;

  width: 100%;
  input {
    height: 50px;
    width: 100%;
    flex-grow: 1 !important;

    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;

    font-size: 16px;
    font-weight: 500;

    padding-left: 15px;
    box-sizing: border-box;

    border-left: 1px solid #cacaca;
    border-top: 1px solid #cacaca;
    border-bottom: 1px solid #cacaca;
    border-right: none;
    outline: none;
  }
  button {
    width: 100px;
    height: 50px;
    background-color: #c7d7ff;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;

    border: 1px solid #cacaca;

    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
  }
`;
