const express = require("express");
const bcrypt = require("bcrypt")
const db = require("../models/index.js");
const jwt = require("jsonwebtoken");

const userController = require("../controller/userController.js");
const tokenCheck = require("../middleware/tokenCheck.js");


const User = db.User;
const Post = db.Post;
const router = express.Router();

//회원가입
router.post("/register", async (req, res) => {
  try {
    const newUser = await userController.register(req.body);
    console.log(newUser);
    res.status(newUser.status).json(newUser.message);
  }
  catch (error) {
    console.error(error);
  };
})
//로그인
router.post("/login", async (req, res) => {
  try {
    const user = await userController.login(req.body);
    if (user.status === 200) {
      res.cookie("accessToken", user.accessToken, {
        secure: false,
        httpOnly: true,
      })
      res.cookie("refreshToken", user.refreshToken, {
        secure: false,
        httpOnly: true,
      })
      res.status(200).json("로그인 성공, 토큰 발급 완료");
    }
    else {
      res.status(user.status).json({ message: user.message });
    }
  }
  catch (error) {
    console.error(error);
  }
})
//구글 로그인
router.post("/login/social", async (req, res) => {
  try {
    const email = req.body.email;
    const nickname = email.split("@")[0] + "#";
    const password = process.env.SOCIAL_PW;
    const profilePic = req.body.profilePic;

    console.log(email);

    const isEmailExist = await User.findOne({
      where: { email }
    });

    //가입되어있지 않은 경우 -> 회원가입
    if (!isEmailExist) {
      //회원가입 
      const newUser = await userController.register({ email, password, nickname, profilePic });
      console.log(newUser);
      //로그인
      const user = await userController.login({ email, password });
      if (user.status === 200) {
        res.cookie("accessToken", user.accessToken, {
          secure: false,
          httpOnly: true,
        })
        res.cookie("refreshToken", user.refreshToken, {
          secure: false,
          httpOnly: true,
        })
        res.status(200).json("로그인 성공, 토큰 발급 완료");
      }
      else {
        res.status(user.status).json({ message: user.message });
      }
    }
    //이메일이 존재한 경우 -> 로그인 시도
    else {
      const user = await userController.login({ email, password });
      if (user.status === 200) {
        res.cookie("accessToken", user.accessToken, {
          secure: false,
          httpOnly: true,
        })
        res.cookie("refreshToken", user.refreshToken, {
          secure: false,
          httpOnly: true,
        })
        res.status(200).json("로그인 성공, 토큰 발급 완료");
      }
      else {
        return res.status(user.status).json({ message: "이미 가입된 일반 계정이 존재합니다." });
      }
    }
    return res.status(401).json({ errr: "error" });

  }
  catch (error) {
    console.error(error);
  }
})

//유저 정보 불러오기 - 엑세스 토큰 확인 및 리프레시 토큰으로 엑세스 토큰을 발급받는 미들웨어를 만들고 미들웨어 거친 후 라우터에서 유저정보를 클라로 뿌랴줘야 한다.
router.get("/current", tokenCheck, async (req, res) => {
  console.log(req.body);
  try {
    const accessToken = req.cookies.accessToken;
    const user = jwt.verify(accessToken, process.env.ACCESS_KEY);

    const currentUser = await User.findOne({
      where: { email: user.email },
      include: [{
        model: User, //
        as: 'Followers',
        attributes: ['id', 'nickname', 'profilePic'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id', 'nickname', 'profilePic'],
      }, {
        model: Post,
        attributes: ['id', 'type'],
      }, {
        model: Post,
        as: 'Liked',
        attributes: ['id', 'type'],
      }]
    });
    res.status(200).json(currentUser);
  }
  catch (error) {
    //엑세스 토큰이 만료되었다면 새롭게 발급받은 엑세스 토큰이 있는지 확인하고 진행합니다.
    const newAccessToken = req.body.newAccessToken
    if (newAccessToken) {
      const user = jwt.verify(newAccessToken, process.env.ACCESS_KEY);

      const currentUser = await User.findOne({
        where: { email: user.email }
      });
      res.status(200).json(currentUser);
    }
    else {
      console.log("토큰이 올바르지 않습니다.");
      res.status(400).json("토큰이 올바르지 않습니다.");
    }
  }
})
router.get("/logout", (req, res) => {
  res.cookie("accessToken", "", {
    secure: false,
    httpOnly: true,
  })
  res.cookie("refreshToken", "", {
    secure: false,
    httpOnly: true,
  })
  res.status(200).json("로그아웃 완료");
})
//유저 정보 변경 - 닉네임
router.patch("/edit/nickname", tokenCheck, async (req, res) => {
  try {
    const userId = req.currentUserId;
    const nickname = req.body.nickname;

    const isNicknameExist = await User.findOne({
      where: { nickname }
    });
    if (isNicknameExist) return res.status(400).json("이미 존재하는 닉네임 입니다.");

    await User.update({
      nickname
    }, {
      where: { id: userId }
    }
    );
    res.status(200).json("nickname edit success");
  } catch (e) {
    console.err(e)
  };
})
//유저 정보 변경 - 상태메세지
router.patch("/edit/usertext", tokenCheck, async (req, res) => {
  try {
    const userId = req.currentUserId;
    const usertext = req.body.usertext;

    await User.update({
      usertext: usertext
    }, {
      where: { id: userId }
    }
    );
    res.status(200).json("usertext edit success");
  } catch (e) {
    console.err(e)
  };
})
//유저 정보 변경 - 프로필 이미지
router.patch("/edit/profilepic", tokenCheck, async (req, res) => {
  try {
    const userId = req.currentUserId;
    const profilePic = req.body.profilePic;

    await User.update({
      profilePic: profilePic
    }, {
      where: { id: userId }
    }
    );
    res.status(200).json("profilePic change success");
  } catch (e) {
    console.err(e)
  };
})


//
//팔로잉팔로워 관련 - 팔로우
router.patch("/:userId/follow", tokenCheck, async (req, res) => {
  const targetUserId = req.params.userId;
  if (targetUserId === req.currentUserId) return res.status(403).json("자기 자신을 팔로우할 수 없습니다.");

  try {
    const targetUser = await User.findOne(
      { where: { id: targetUserId } }
    );
    if (!targetUser) return res.status(403).json("존재하지 않은 유저입니다.");

    targetUser.addFollowers(req.currentUserId);
    return res.status(200).json(targetUserId)
  }
  catch (err) {
    console.err(err);
  }
});
//팔로잉팔로워 관련 - 언팔로우
router.delete("/:userId/follow", tokenCheck, async (req, res) => {
  const targetUserId = req.params.userId;
  if (targetUserId === req.currentUserId) return res.status(403).json("자기 자신을 언팔로우할 수 없습니다.");

  try {
    const targetUser = await User.findOne(
      { where: { id: targetUserId } }
    );
    if (!targetUser) return res.status(403).json("존재하지 않은 유저입니다.");

    targetUser.removeFollowers(req.currentUserId);
    return res.status(200).json(targetUserId)
  }
  catch (err) {
    console.err(err);
  }
});
router.delete("/:userId/follower", tokenCheck, async (req, res) => {
  const targetUserId = req.params.userId;
  if (targetUserId === req.currentUserId) return res.status(403).json("팔로워 id가 잘못되었습니다.");

  try {
    const targetUser = await User.findOne(
      { where: { id: targetUserId } }
    );
    if (!targetUser) return res.status(403).json("존재하지 않은 유저입니다.");

    targetUser.removeFollowings(req.currentUserId);
    return res.status(200).json(targetUser)
  }
  catch (err) {
    console.err(err);
  }
});

//팔로잉팔로워 관련 - 팔로잉 정보 불러오기
router.get("/followings", tokenCheck, async (req, res) => {
  try {
    const user = await User.findOne(
      { where: { id: req.currentUserId } }
    );
    if (!user) return res.status(403).json("로그인 정보가 올바르지 않습니다.");

    const followings = user.getFollowings();
    return res.status(200).json(followings)
  }
  catch (err) {
    console.err(err);
  }
});
//팔로잉팔로워 관련 - 팔로워 정보 불러오기
router.get("/followers", tokenCheck, async (req, res) => {
  try {
    const user = await User.findOne(
      { where: { id: req.currentUserId } }
    );
    if (!user) return res.status(403).json("로그인 정보가 올바르지 않습니다.");

    const followers = user.getFollowings();
    return res.status(200).json(followers)
  }
  catch (err) {
    console.err(err);
  }
});

//타겟 유저 정보 불러오기
router.get("/info", tokenCheck, async (req, res) => {
  try {
    const { id } = req.query;

    // if (id == 0) return res.status(200).json(null);

    const user = await User.findOne(
      {
        where: { id }, include: [{
          model: User, //
          as: 'Followers',
          attributes: ['id', 'nickname', 'profilePic'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id', 'nickname', 'profilePic'],
        }, {
          model: Post,
          attributes: ['id', 'type'],
        }, {
          model: Post,
          as: 'Liked',
          attributes: ['id', 'type'],
        }]
      }
    );
    if (!user) return res.status(403).json("유저가 존재하지 않습니다.");
    return res.status(200).json(user)
  }
  catch (err) {
    console.err(err);
  }
});
module.exports = router;