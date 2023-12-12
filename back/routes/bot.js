const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


//문의 메일
router.post("/mail", async (req, res) => {
  const { email, text } = req.body;

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

  //goodlockgodlock -> godlock.info 
  //문의 
  await transporter.sendMail({
    from: 'goodlockgodlock@gmail.com',
    to: 'godlock.info@gmail.com',
    subject: `굿락갓락, ${email} 회원 문의 내역`,
    text: text,
    html: `
      <div style="width: 100%;height: auto;background-color: #C7D7FF; box-sizing: border-box; border-radius: 8px; padding: 12px;">
        <div style="background-color: white; width: 100%; box-sizing: border-box; border-radius: 8px; padding: 24px;margin-top: 40px;">
        <div style="font-size: 14px;">나만의 감성 더하기, 굿락갓락</div>
          <div style="font-size: 24px;margin-top: 8px;margin-bottom: 20px;font-weight: 600;">굿락갓락, ${email} 회원님의 문의 내역</div>
          <div style="font-size: 16px;line-height: 24px;margin-bottom: 20px;">${text}</div>
        </div>
        <img src="https://moseoree-s3.s3.ap-northeast-2.amazonaws.com/mainImage.png" style="margin-top: 40px; width: 100%;object-fit: contain;">
      </div>  
      `
  });
  //goodlockgodlock -> user email
  //문의 확인 
  await transporter.sendMail({
    from: 'goodlockgodlock@gmail.com',
    to: email,
    subject: `굿락갓락, 문의접수 안내`,
    text: text,
    html: `
      <div style="width: 100%;height: auto;background-color: #C7D7FF; box-sizing: border-box; border-radius: 8px; padding: 12px;">
        <div style="background-color: white; width: 100%; box-sizing: border-box; border-radius: 8px; padding: 24px;margin-top: 40px;">
        <div style="font-size: 14px;">나만의 감성 더하기, 굿락갓락</div>
          <div style="font-size: 24px;margin-top: 8px;margin-bottom: 20px;font-weight: 600;">굿락갓락, 문의접수 안내</div>
          <div>
            <div style="font-size: 16px;line-height: 24px;">안녕하세요.</div>
            <div style="font-size: 16px;line-height: 24px;">문의접수 안내 메일입니다.</div>
            <div style="font-size: 16px;line-height: 24px;">아래의 내용으로 회원님의 문의가 접수 되었습니다.</div>
            <div style="font-size: 16px;line-height: 24px;">답변을 남기기까지 많은 시일이 걸릴 수 있음을 널리 양해해 주시기 바랍니다.</div>
            <div style="font-size: 16px;line-height: 24px;">감사합니다.</div>
            <div style="font-size: 16px;margin-top: 20px;margin-bottom: 20px;font-weight: 500;">문의 내용 : ${text}</div>
          </div>
        </div>
        <img src="https://moseoree-s3.s3.ap-northeast-2.amazonaws.com/mainImage.png" style="margin-top: 40px; width: 100%;object-fit: contain;">
      </div>  
      `
  });

  return res.status(200).json("문의 메일이 성공적으로 발송되었습니다.");
});

module.exports = router;