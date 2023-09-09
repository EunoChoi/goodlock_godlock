const jwt = require("jsonwebtoken");
const db = require("../models/index.js");

const loginRequired = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const user = jwt.verify(accessToken, process.env.ACCESS_KEY);

    console.log("-----------login reqruied----------");
    console.log(user)
    console.log("--------------------");

    req.currentUserId = user.id;
    req.currentUserEmail = user.email;
    next();
  }
  catch (error) {
    res.status(401).send('로그인이 필요합니다.');
  }
};

module.exports = loginRequired;