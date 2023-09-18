const express = require("express");

const multer = require('multer');
const path = require('path'); //path는 노드에서 기능하는 기능
const fs = require('fs');//파일 시스템 조작 가능한 모듈

const loginRequired = require("../middleware/loginRequired.js");

const db = require("../models/index.js");
const Op = db.Sequelize.Op;
// const { where } = require("sequelize");
const router = express.Router();

//model load
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;
const Image = db.Image;

//image upload
try {
  //upload폴더가 존재하는지 확인
  fs.accessSync('uploads');
} catch (err) {
  console.log('upload folder do not exist')
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) { //저장위치 결정 함수
      done(null, 'uploads');
    },
    filename(req, file, done) { //파일명 결정 함수
      const ext = path.extname(file.originalname); //파일 확장자 추출
      const basename = path.basename(file.originalname.slice(0, 10), ext); //path에서 파일명 추출
      done(null, basename + '_' + new Date().getTime() + ext); //파일명 + 시간 + 확장자 
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024 //20MB, MB=2^10*바이트, KM=2^3*바이트
  },
});
router.post('/images', upload.array('image'), async (req, res, next) => {
  //router.post('/images', isLoggedIn, upload.single('image'), async (res, req, next) //한번의 파일첨부에서 1개 올릴때 array
  //router.post('/images', isLoggedIn, upload.fields('image'), async (res, req, next) //여러번의 파일첨부에서 여러개 올릴때 array
  res.json(req.files.map((v) => v.filename));
});



//load posts - all
router.get("/", async (req, res) => {
  const { type, pageParam, tempDataNum } = req.query;
  try {
    const where = {};
    const Posts = await Post.findAll({
      where: [{
        type
      }],
      // limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });

    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})
//load posts - info active
router.get("/activinfo", async (req, res) => {
  const { type, pageParam, tempDataNum } = req.query;

  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  const today = new Date(year, month, date, 0, 0, 0);

  try {
    const where = {};
    const Posts = await Post.findAll({
      where: [{
        type: 1,
        end: { [Op.gte]: today }
      }],
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });

    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})


//length - today upload info posts
router.get("/todayinfo", async (req, res) => {
  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  const today = new Date(year, month, date, 0, 0, 0);

  try {
    const where = {};
    const Posts = await Post.findAll({
      where: [{
        type: 1,
        createdAt: { [Op.gte]: today }
      }]
      , attributes: ['id'],
    });

    return res.status(201).json({ len: Posts.length });
  } catch (e) {
    console.err(e);
  }
})
//length - today end info posts
router.get("/todayendliked", loginRequired, async (req, res) => {
  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  const today = new Date(year, month, date, 0, 0, 0);

  try {
    const UserId = req.currentUserId;

    //좋아요 누른 포스트 id 배열 ,ex : [1, 2, 3]
    const likedPosts = await Post.findAll({
      attributes: ["id"],
      include: [{
        model: User,
        as: "Likers",
        where: { id: UserId }
      }]
    })
    if (likedPosts.length >= 1) {
      const Posts = await Post.findAll({
        attributes: ['id'],
        where: [{
          type: 1,
          id: { [Op.in]: likedPosts.map(v => v.id) },
          end: { [Op.eq]: today }
        }]
      });
      return res.status(201).json({ len: Posts.length });
    }
    else return res.status(201).json({ len: 0 });
  } catch (e) {
    console.err(e);
  }
})

//load posts - feed post(팔로잉 유저 포스트 모아보기)
router.get("/feed", loginRequired, async (req, res) => {
  const { pageParam, tempDataNum } = req.query;
  try {
    const UserId = req.currentUserId;

    const followings = await User.findAll({
      attributes: ["id"],
      include: [{
        model: User,
        as: "Followers",
        where: {
          id: UserId
        }
      }]
    })

    const Posts = await Post.findAll({
      where: [{
        type: 2,
        UserId: { [Op.in]: followings.map(v => v.id) }
      }],
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });
    // return res.status(201).json(Posts);
    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})


//load posts - my post, type 구분
router.get("/my", loginRequired, async (req, res) => {
  const { type, pageParam, tempDataNum } = req.query;
  try {
    const UserId = req.currentUserId;
    const Posts = await Post.findAll({
      where: [{
        type,
        UserId
      }],
      // limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });

    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})
//load posts - my liked
router.get("/liked", loginRequired, async (req, res) => {
  const { pageParam, tempDataNum } = req.query;
  try {
    const UserId = req.currentUserId;
    const likedPosts = await Post.findAll({
      attributes: ["id"],
      include: [{
        model: User,
        as: "Likers",
        where: { id: UserId }
      }]
    })
    const Posts = await Post.findAll({
      where: [{
        type: 1,
        id: { [Op.in]: likedPosts.map(v => v.id) }
      }],
      // limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });

    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})


//load posts - target user post (type)
router.get("/user", loginRequired, async (req, res) => {
  const { type, id } = req.query;
  const { pageParam, tempDataNum } = req.query;

  try {
    const Posts = await Post.findAll({
      where: [{
        type,
        UserId: id
      }],
      // limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });

    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})
//load posts - target user liked
router.get("/user/liked", loginRequired, async (req, res) => {
  const { id } = req.query;
  const { pageParam, tempDataNum } = req.query;

  try {
    const likedPosts = await Post.findAll({
      attributes: ["id"],
      include: [{
        model: User,
        as: "Likers",
        where: { id }
      }]
    })
    const Posts = await Post.findAll({
      where: [{
        type: 1,
        id: { [Op.in]: likedPosts.map(v => v.id) }
      }],
      // limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
      ],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id', 'nickname'],
        },
        {
          model: Image, //게시글의 이미지
        },
        {
          model: Comment, //게시글에 달린 댓글
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname', 'profilePic'],
            }
          ],
        }
      ],
    });

    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.err(e);
  }
})


//add, edit, delete post
router.post("/", loginRequired, async (req, res) => {
  try {
    //현재 로그인된 유저의 id와 포스트 text로 post 모델의 요소 생성
    console.log(req.body);
    const post = await Post.create({
      type: req.body.type,
      content: req.body.content,
      UserId: req.currentUserId,
      start: req.body.start,
      end: req.body.end,
      link: req.body.link
    });

    //image 모델 요소 생성 후 Post 모델과 연결
    const postImages = req.body.images;

    if (postImages.length >= 1) {
      const images = await Promise.all(req.body.images.map((i) => Image.create({ src: i })));
      post.addImages(images);
    }
  } catch (e) {
    console.err(e);
  }
  res.status(200).json("post upload success");
})
router.patch("/:postId", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;

    //수정 요청된 post가 로그인 유저의 post 인지 확인
    const post = await Post.findOne({
      where: { id: postId, UserId: req.currentUserId }
    });
    if (!post) return res.status(403).json("자신의 게시글이 아닙니다.");

    //현재 로그인된 유저의 id와 포스트 text로 post 모델의 요소 생성
    await Post.update({
      content: req.body.content,
      start: req.body.start,
      end: req.body.end,
      link: req.body.link
    }, {
      where: { id: postId, UserId: req.currentUserId }
    }
    );

    //기존에 등록되어 있는 이미지 모델 삭제
    await Image.destroy({
      where: {
        PostId: postId
      }
    })

    //수정된 이미지들을 image 모델 요소 생성 후 Post 모델과 연결
    const postImages = req.body.images;
    if (postImages.length >= 1) {
      const images = await Promise.all(req.body.images.map((i) => Image.create({ src: i })));
      post.addImages(images);
    }
  } catch (e) {
    console.err(e);
  }
  res.status(200).json("post edit success");
})
router.delete("/:postId", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findOne({
      where: { id: postId, UserId: req.currentUserId }
    });
    if (!post) return res.status(403).json("게시글이 존재하지 않거나 자신의 게시글이 아닙니다.");

    await Post.destroy({
      where: { id: postId, UserId: req.currentUserId }
    });
  } catch (e) {
    console.err(e);
  }
  res.status(200).json("post edit success");
})


//add, edit, delete comment
router.post("/:postId/comment", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;
    const currentPost = await Post.findOne(
      { where: { id: postId } }
    );
    if (!currentPost) {
      return res.status(403).json("존재하지 않는 게시글입니다.");
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: postId,
      UserId: req.currentUserId,
    });

    return res.status(201).json(comment);
  }
  catch (e) {
    console.error(e);
  }
});
router.delete("/:postId/comment/:commentId", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const comment = await Comment.findOne({
      where: { id: commentId, PostId: postId, UserId: req.currentUserId }
    });
    if (!comment) return res.status(403).json("대상이 올바르지 않거나 자신의 댓글이 아닙니다.");

    await Comment.destroy({
      where: { id: commentId, PostId: postId, UserId: req.currentUserId }
    });
  } catch (e) {
    console.err(e);
  }
  res.status(200).json("comment delete success");
})
router.patch("/:postId/comment/:commentId", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    //comment 확인
    const comment = await Comment.findOne({
      where: { id: commentId, PostId: postId, UserId: req.currentUserId }
    });
    if (!comment) return res.status(403).json("대상이 올바르지 않거나 자신의 댓글이 아닙니다.");

    //comment 수정
    await Comment.update({
      content: req.body.content,
    }, {
      where: { id: commentId, PostId: postId, UserId: req.currentUserId }
    }
    );
    res.status(200).json("post edit success");
  } catch (e) {
    console.err(e);
  }
})


//post like, unlike
router.patch("/:postId/like", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;

    const isMyPost = await Post.findOne(
      { where: { id: postId, UserId: req.currentUserId } }
    );
    if (isMyPost) return res.status(400).json("자신의 게시글에서 동작하지 않습니다.");

    const post = await Post.findOne(
      { where: { id: postId } }
    );
    if (!post) return res.status(400).json("게시글이 존재하지 않습니다.");

    if (req.currentUserId) {
      await post.addLikers(req.currentUserId);
      return res.status(200).json("좋아요 완료");
    }
    else {
      return res.status(400).json("오류 발생");
    }
  }
  catch (e) { console.error(e) }
})
router.delete("/:postId/like", loginRequired, async (req, res) => {
  try {
    const postId = req.params.postId;

    const isMyPost = await Post.findOne(
      { where: { id: postId, UserId: req.currentUserId } }
    );
    if (isMyPost) return res.status(400).json("자신의 게시글에서 동작하지 않습니다.");

    const post = await Post.findOne(
      { where: { id: postId } }
    );
    if (!post) return res.status(400).json("게시글이 존재하지 않습니다.");

    if (req.currentUserId) {
      await post.removeLikers(req.currentUserId);
      return res.status(200).json("좋아요 해제 완료");
    }
    else {
      return res.status(400).json("오류 발생");
    }
  }
  catch (e) { console.error(e) }
})


module.exports = router;