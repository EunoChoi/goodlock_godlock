const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const db = require("../models/index.js");
const User = db.User;

//회원가입, 로그인, 유저 불러오기, 유저 정보 수정
const userController = {
  register: async (data) => {
    let message;
    const { email, nickname, password } = data;
    const isEmailExist = await User.findOne({
      where: { email }
    });
    const isNicknameExist = await User.findOne({
      where: { nickname }
    });
    //이미 등록된 이메일인 경우
    if (isEmailExist) {
      message =
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.";
      return {
        status: 400,
        message
      };
    }
    if (isNicknameExist) {
      message =
        "이 닉네임은 현재 사용중입니다. 다른 닉네임을 입력해 주세요.";
      return { status: 400, message };
    }
    //회원가입이 가능한 경우
    else {
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create(
        {
          level: 1,
          email,
          nickname,
          password: hashedPassword //암호화된 비밀번호로 회원가입
        }
      );
      message =
        "회원가입이 완료되었습니다.";
      return { status: 200, message };
    }
  },
  login: async (data) => {
    let message;
    const { email, password } = data;

    //이메일 일치 확인
    const user = await User.findOne({
      where: { email }
    });
    if (!user) {
      message = "가입된 이메일이 아닙니다.";
      return { status: 400, message }
    }

    //비밀번호 일치확인
    const isPasswordCorrect = await bcrypt.compare(
      password, //입력된 비밀번호
      user.password //서버에 저장된 올바른 비밀번호
    );
    if (!isPasswordCorrect) {
      message =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { status: 400, message };
    }

    //이메일, 비밀번호 일치 확인 완료 후 토큰 발급
    // access Token 발급
    const accessToken = jwt.sign({
      email: user.email,
      id: user.id,
    }, process.env.ACCESS_KEY, {
      expiresIn: '15m',
      issuer: 'narang',
    });

    // refresh Token 발급
    const refreshToken = jwt.sign({
      email: user.email,
      id: user.id,
    }, process.env.REFRECH_KEY, {
      expiresIn: '60m',
      issuer: 'narang',
    })

    return { status: 200, accessToken, refreshToken };
  }
}

module.exports = userController;