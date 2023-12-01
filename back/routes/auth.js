const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt")
const router = express.Router();
const nodemailer = require("nodemailer");

const db = require("../models/index.js");
const User = db.User;


//naver login
router.post("/naverlogin", async (req, res) => {
  const { client_id, client_secret, redirect_uri, code, state } = req.body;

  let getTokenUrl = "https://nid.naver.com/oauth2.0/token";
  getTokenUrl += `?grant_type=authorization_code`;
  getTokenUrl += `&client_id=${client_id}`;
  getTokenUrl += `&client_secret=${client_secret}`;
  getTokenUrl += `&redirect_uri=${redirect_uri}`;
  getTokenUrl += `&code=${code}`;
  getTokenUrl += `&state=${state}`;

  access_token = await axios.get(getTokenUrl).then(res => res.data.access_token);
  console.log(access_token);
  const user = await axios.get('https://openapi.naver.com/v1/nid/me',
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  const email = user.data.response.email;
  const profilePic = user.data.response.pprofile_image;

  res.status(200).json({ email, profilePic })
});

router.post("/code", async (req, res) => {

  let { email } = req.body;
  console.log(email);
  try {
    //인증 코드 생성
    let code = "";
    for (let i = 0; i < 6; i++) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let index = Math.floor(Math.random() * 26) //0 ~ 25
      code += characters[index];
    }
    // console.log(code);


    //인증 코드 발송
    let transporter = nodemailer.createTransport({
      service: 'gmail'
      , port: 587
      , host: 'smtp.gmail.com'
      , secure: false
      , requireTLS: true
      , auth: {
        user: process.env.AUTH_EMAIL
        , pass: process.env.AUTH_PW
      }
    });
    await transporter.sendMail({
      from: 'goodlockgodlock@gmail.com',
      to: email,
      subject: '굿락갓락, 인증코드입니다.',
      text: code,
      html: `<div><b>안녕하세요. 굿락갓락입니다.</b></div>
      <div>${code}</div>`
    });

    const hashedCode = await bcrypt.hash(code, 8);
    // console.log(hashedCode);

    return res.status(200).json({ code: hashedCode });
  } catch (err) {
    console.err(err);
    return res.status(401).json("인증코드 발송 실패");
  }
});

router.post("/code/find/password", async (req, res) => {

  let { email } = req.body;
  console.log(email);
  try {
    //간편 로그인인지 확인
    const user = await User.findOne(
      { where: { email } }
    );

    if (user) {
      if (user.level === 2) {
        return res.status(401).json("간편 로그인으로 등록된 계정입니다.");
      }
    } else {
      return res.status(401).json("등록된 이메일 주소가 아닙니다.");
    }

    //인증 코드 생성
    let code = "";
    for (let i = 0; i < 6; i++) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let index = Math.floor(Math.random() * 26) //0 ~ 25
      code += characters[index];
    }
    // console.log(code);


    //인증 코드 발송
    let transporter = nodemailer.createTransport({
      service: 'gmail'
      , port: 587
      , host: 'smtp.gmail.com'
      , secure: false
      , requireTLS: true
      , auth: {
        user: process.env.AUTH_EMAIL
        , pass: process.env.AUTH_PW
      }
    });
    await transporter.sendMail({
      from: 'goodlockgodlock@gmail.com',
      to: email,
      subject: '굿락갓락, 회원가입 인증코드입니다.',
      text: code,
      html: `<div><b>안녕하세요. 굿락갓락입니다.</b></div>
      <div>${code}</div>`
    });

    const hashedCode = await bcrypt.hash(code, 8);
    // console.log(hashedCode);

    return res.status(200).json({ code: hashedCode });
  } catch (err) {
    console.err(err);
    return res.status(401).json("인증코드 발송 실패");
  }
});

router.post("/code/check", async (req, res) => {
  try {
    const { code, authCode } = req.body;
    const confirm = await bcrypt.compare(
      code, //입력코드
      authCode //인증코드
    );
    if (confirm) {
      return res.status(200).json({ result: true });
    }
    else {
      return res.status(200).json({ result: false });
    }
  } catch (err) {
    console.err(err);
    return res.status(400).json("확인 과정 중 에러 발생");
  }
})

router.post("/password/reset", async (req, res) => {
  let { email } = req.body;
  // console.log(email);
  try {
    //임시 비밀번호 생성
    let tempPassword = "";
    for (let i = 0; i < 8; i++) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let index = Math.floor(Math.random() * 26) //0 ~ 25
      tempPassword += characters[index];
    }

    //비밀번호 초기화
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await User.update({
      password: hashedPassword
    }, {
      where: { email }
    });


    //인증 코드 발송
    let transporter = nodemailer.createTransport({
      service: 'gmail'
      , port: 587
      , host: 'smtp.gmlail.com'
      , secure: false
      , requireTLS: true
      , auth: {
        user: process.env.AUTH_EMAIL
        , pass: process.env.AUTH_PW
      }
    });
    await transporter.sendMail({
      from: 'test@gmail.com',
      to: email,
      subject: '굿락갓락, 임시 비밀번호 입니다.',
      text: tempPassword,
      html: `<div><b>안녕하세요. 굿락갓락입니다.</b></div>
      <span>임시 비밀번호입니다. 로그인 후 비밀번호 재설정하시기 바랍니다.</span>
      <div>${tempPassword}</div>`
    });

    return res.status(200).json("비밀번호 초기화가 완료되었습니다.");
  } catch (err) {
    console.err(err);
    return res.status(401).json("인증코드 발송 실패");
  }
});

module.exports = router;