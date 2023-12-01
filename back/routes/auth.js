const express = require("express");
const axios = require("axios");
const router = express.Router();
const nodemailer = require("nodemailer");

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

router.post("/code/signup", async (req, res) => {

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
    console.log(code);


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
      from: 'goodlockgodlock@gmail.com',
      to: email,
      subject: '굿락갓락, 회원가입 인증코드입니다.',
      text: code,
      html: `<div><b>안녕하세요. 굿락갓락입니다.</b></div>
      <div>회원가입을 위한 인증코드 입니다.</div>
      <div>${code}</div>`
    });

    return res.status(200).json({ code });
  } catch (err) {
    console.err(err);
    return res.status(401).json("인증코드 발송 실패");
  }
});


module.exports = router;