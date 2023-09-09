const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;

const tokenCheck = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    jwt.verify(accessToken, process.env.ACCESS_KEY);
    next();
  }
  catch (error) {
    console.log(error.name);
    // if (error.name === "TokenExpiredError") {
    try {
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
      next();
    } catch (error) {
      next();
    };
  }
  // }
};

module.exports = tokenCheck;