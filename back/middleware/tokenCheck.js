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
    //리프레시 토큰으로 엑세스 토큰 재발급 과정 진행...

    console.log(error.name);

    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      let accessTokenUserEmail;
      let accessTokenUserId; //guest 계정에서 사용
      if (accessToken) {
        accessTokenUserEmail = parseJwt(accessToken)?.email;
        accessTokenUserId = parseJwt(accessToken)?.id;
      }

      //guest 계정인 경우 - 다중 접속 필요, 서버 리프레시 토큰과 비교 과정 불필요
      if (accessTokenUserEmail === 'guest') {
        //guest 계정이라도 리프레시 토큰 검증 과정 필요
        jwt.verify(refreshToken, process.env.REFRECH_KEY);

        const guestEmail = accessTokenUserEmail;
        const guestId = accessTokenUserId;

        const newAccessToken = jwt.sign({
          email: guestEmail,
          id: guestId,
        }, process.env.ACCESS_KEY, {
          expiresIn: '1m',
          issuer: 'godlock',
        });

        res.cookie("accessToken", newAccessToken, {
          secure: false,
          httpOnly: true,
        });

        req.body.newAccessToken = newAccessToken;
        req.currentUserId = guestId;
        req.currentUserEmail = guestEmail;

        next();
      }
      //guest 계정이 아닌 경우 - 다중 접속 불가능, 서버 리프레시 토큰과 비교 과정 필요
      else {
        //리프레시 토큰 검증 과정 진행
        jwt.verify(refreshToken, process.env.REFRECH_KEY);
        //쿠키 리프레시 토큰, 서버 리프레시 토큰 일치하는지 확인
        const currentUser = await User.findOne({
          where: { email: accessTokenUserEmail, refreshToken: refreshToken },
        });

        if (currentUser) {
          console.log("리프레시 토큰 일치 확인");

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
        //guest 계정 아니며서 서버 리프레시 토큰과 쿠키 리프레시 토큰이 일치하지 않은 경우 -> 재로그인 필요
        else {
          res.status(401).send('로그인이 필요합니다.');
        }
      }
    } catch (error) {
      //엑세스 토큰, 리프레시 토큰 모두 승인 거절된 경우
      res.status(401).send('로그인이 필요합니다.');
    };
  }
};

module.exports = tokenCheck;