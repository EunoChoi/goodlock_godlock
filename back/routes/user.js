const express = require("express");
const bcrypt = require("bcrypt")
const db = require("../models/index.js");
const jwt = require("jsonwebtoken");

const userController = require("../controller/userController.js");
const tokenCheck = require("../middleware/tokenCheck.js");
const nodemailer = require("nodemailer");


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
//회원탈퇴
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const isUserExist = await User.findOne({
      where: { id }
    });
    if (isUserExist) {
      //유저가 작성한 게시글도 모두 삭제
      await Post.destroy({
        where: { UserId: id }
      });
      console.log("탈퇴 유저가 작성한 게시글 모두 삭제 완료");

      //유저 삭제 처리
      await User.destroy({
        where: { id }
      });
      console.log("탈퇴 처리 완료");

      return res.status(200).json("탈퇴가 완료되었습니다.");
    }
    else return res.status(401).json("존재하지 않은 유저입니다.");
  } catch (err) {
    console.error(err);
  }
});
//일반 로그인
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    //user level확인 후 간편 로그인 아이디인지 구분
    const isEmailExist = await User.findOne({
      where: { email },
    });
    if (isEmailExist && isEmailExist.level === 2) {
      res.status(401).json({ message: "간편 로그인으로 가입된 계정입니다." });
    }



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
//소셜 로그인
router.post("/login/social", async (req, res) => {
  try {
    const email = req.body.email;
    const nickname = email;
    const password = process.env.SOCIAL_PW;
    const profilePic = req.body.profilePic;

    console.log(email);

    const isEmailExist = await User.findOne({
      where: { email }
    });
    const lastUser = await User.findOne({
      where: {},
      order: [['createdAt', 'DESC']],
    });

    //가입되어있지 않은 경우 -> 회원가입
    if (!isEmailExist) {
      //회원가입 
      console.log("가입되어있지 않음, 회원가입 진행 중...");
      const newUser = await userController.register({ email, password, nickname: `신규-${lastUser.id + 1}`, profilePic });
      // console.log(newUser);

      //회원가입 메일 발송
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
        subject: '굿락갓락에 오신 것을 환영합니다.',
        text: '굿락갓락에 오신 것을 환영합니다.',
        html: `
        <div style="width: 100%;height: auto;background-color: #C7D7FF; box-sizing: border-box; border-radius: 8px; padding: 12px;">
          <div style="background-color: white; width: 100%; box-sizing: border-box; border-radius: 8px; padding: 24px;margin-top: 40px;">
          <div style="font-size: 14px;">나만의 감성 더하기, 굿락갓락</div>
            <div style="font-size: 32px;margin-top: 8px;margin-bottom: 20px;font-weight: 600;">굿락갓락에 오신 것을 환영합니다. 🎉🎉🎉</div>
            <div>
              <div style="font-size: 16px;line-height: 24px;">안녕하세요.</div>
              <div style="font-size: 16px;line-height: 24px;">굿락갓락에 오신 것을 환영합니다.</div>
              <div style="font-size: 16px;line-height: 24px;">아래의 정보로 회원가입이 완료되었습니다.</div>
              <div style="font-size: 16px;line-height: 16px;color:salmon">*간편가입의 경우 임시로 이메일과 같은 닉네임이 설정되었습니다. 로그인 후 마이페이지에서 변경가능합니다.</div>
              <div style="font-size: 16px;line-height: 24px;">감사합니다.</div>
              <div style="font-size: 20px;margin-top: 20px;margin-bottom: 20px;font-weight: 500;">이메일 : ${email}</div>
              <div style="font-size: 20px;margin-top: 20px;margin-bottom: 20px;font-weight: 500;">닉네임 : ${nickname}</div>
            </div>
          </div>
          <img src="https://moseoree-s3.s3.ap-northeast-2.amazonaws.com/mainImage.png" style="margin-top: 40px; width: 100%;object-fit: contain;">
        </div>
        `
      });
      console.log("회원가입 메일 발송");

      //로그인
      console.log("로그인 진행 중...");
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
      console.log("간편가입 되어있음, 로그인 진행 중...");
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
        return res.status(user.status).json({ message: "일반 계정으로 가입된 계정입니다." });
      }
    }
    return res.status(401).json({ errr: "error" });

  }
  catch (error) {
    console.error(error);
  }
})

//비밀번호 확인
router.post("/password/confirm", async (req, res) => {
  try {
    //사용자가 입력한 비밀번호로 userController.login()
    //user가 존재하지 않다면 틀린 비밀번호를 입력
    const user = await userController.login(req.body);
    if (user.status === 200) {
      console.log("비밀번호 확인 완료");
      return res.status(200).json({ result: true, message: "비밀번호 확인 완료" });
    }
    else {
      return res.status(user.status).json({ result: false, message: "비밀번호가 올바르지 않습니다." });
    }
  }
  catch (error) {
    console.error(error);
  }
})
//비밀번호 변경
router.patch("/password", async (req, res) => {
  try {
    const { userId, afterPassword } = req.body;

    const hashedPassword = await bcrypt.hash(afterPassword, 12);

    await User.update({
      password: hashedPassword
    }, {
      where: { id: userId }
    });
    return res.status(200).json("비밀번호 변경이 완료되었습니다.");
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
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'nickname', 'profilePic', 'usertext'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id', 'nickname', 'profilePic', 'usertext'],
      }, {
        model: Post,
        attributes: ['id', 'type'],
      }, {
        model: Post,
        as: 'Liked',
        attributes: ['id', 'type'],
      }]
    });
    if (currentUser) res.status(200).json(currentUser);
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
//로그아웃
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
    console.error(e)
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
    console.error(e)
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
    return setTimeout(() => {
      res.status(200).json("profilePic change success");
    }, 1000);
  } catch (e) {
    console.error(e)
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
    console.error(err);
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
    console.error(err);
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
    return res.status(200).json(targetUserId)
  }
  catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
  }
});

//타겟 유저 정보 불러오기
router.get("/info", tokenCheck, async (req, res) => {
  try {
    const { id } = req.query;

    // if (id == 0) return res.status(200).json(null);

    const user = await User.findOne(
      {
        where: { id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: User, //
          as: 'Followers',
          attributes: ['id', 'nickname', 'profilePic', 'usertext'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id', 'nickname', 'profilePic', 'usertext'],
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
    console.error(err);
  }
});
module.exports = router;