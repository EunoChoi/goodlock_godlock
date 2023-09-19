const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;

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
      //리프레시 토큰 확인 절차 진행
      const refreshToken = req.cookies.refreshToken;
      const user = jwt.verify(refreshToken, process.env.REFRECH_KEY);
      const currentUser = await User.findOne({
        where: { email: user.email }
      });

      const accessToken = jwt.sign({
        email: currentUser.email,
        id: currentUser.id,
      }, process.env.ACCESS_KEY, {
        expiresIn: '15m',
        issuer: 'euno',
      });

      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });

      req.body.newAccessToken = accessToken;

      req.currentUserId = user.id;
      req.currentUserEmail = user.email;

      next();
    } catch (error) {
      //엑세스 토큰, 리프레시 토큰 모두 승인 거절된 경우
      res.status(401).send('로그인이 필요합니다.');
    };
  }
};

module.exports = tokenCheck;