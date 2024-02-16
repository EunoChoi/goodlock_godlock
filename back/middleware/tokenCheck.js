const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;


const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const tokenCheck = async (req, res, next) => {

  try {
    const accessToken = req.cookies.accessToken;
    const user = jwt.verify(accessToken, process.env.ACCESS_KEY);

    req.currentUserId = user.id;
    req.currentUserEmail = user.email;

    next();
  }
  catch (error) {
    //엑세스 토큰 승인 거절
    console.log(error.name);

    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      let accessTokenUserEmail;
      if (accessToken) {
        accessTokenUserEmail = parseJwt(accessToken)?.email;
      }

      //쿠키 리프레시 토큰, 서버 리프레시 토큰 일치하는지 확인
      const currentUser = await User.findOne({
        where: { email: accessTokenUserEmail, refreshToken: refreshToken },
      });

      if (currentUser) {
        console.log("리프레시 토큰 가지고 있는 유저 존재함");

        const newAccessToken = jwt.sign({
          email: currentUser.email,
          id: currentUser.id,
        }, process.env.ACCESS_KEY, {
          expiresIn: '1m',
          issuer: 'godlock',
        });

        res.cookie("accessToken", newAccessToken, {
          secure: false,
          httpOnly: true,
        });

        req.body.newAccessToken = newAccessToken;
        req.currentUserId = currentUser.id;
        req.currentUserEmail = currentUser.email;

        next();
      }
      else {
        res.status(401).send('로그인이 필요합니다.');
      }
    } catch (error) {
      //엑세스 토큰, 리프레시 토큰 모두 승인 거절된 경우
      res.status(401).send('로그인이 필요합니다.');
    };
  }
};

module.exports = tokenCheck;