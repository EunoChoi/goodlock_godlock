const express = require("express");

const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');

const path = require('path'); //path는 노드에서 기능하는 기능
const fs = require('fs');//파일 시스템 조작 가능한 모듈

const tokenCheck = require("../middleware/tokenCheck.js");

const db = require("../models/index.js");
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;

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

//AWS 권한 획득
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2'
})

console.log(process.env.S3_ACCESS_KEY_ID);

//로컬 멀터
/* const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) { 
      done(null, 'uploads');
    },
    filename(req, file, done) { 
      const ext = path.extname(file.originalname); 
      const basename = path.basename(file.originalname.slice(0, 10), ext);
      done(null, basename + '_' + new Date().getTime() + ext); 
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024
  },
});
*/


//AWS S3 multer
let s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'moseoree-s3',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname).split(' ').join('')}`)
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
});

router.post('/images', upload.array('image'), async (req, res, next) => {
  //router.post('/images', isLoggedIn, upload.single('image'), async (res, req, next) //한번의 파일첨부에서 1개 올릴때 array
  //router.post('/images', isLoggedIn, upload.fields('image'), async (res, req, next) //여러번의 파일첨부에서 여러개 올릴때 array

  // res.json(req.files.map((v) => v.filename));  //로컬 multer

  //s3 multer
  res.json(req.files.map((v) => decodeURIComponent(v.location).replace(/\/original\//, '/thumb/')));
});


//load posts - single post
router.get("/single", async (req, res) => {
  const { id } = req.query;
  try {
    const where = {};
    const SinglePost = await Post.findOne({
      where: [{
        id
      }],
      order: [
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
    if (!SinglePost) return res.status(403).json("포스트 id가 올바르지 않습니다.");
    return res.status(201).json(SinglePost);
  } catch (e) {
    console.error(e);
  }
})
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
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})
//load posts - info active
router.get("/activinfo", async (req, res) => {
  const { type, pageParam, tempDataNum } = req.query;

  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  const today = new Date(year, month, date);

  try {
    const where = {};
    const Posts = await Post.findAll({
      where: [{
        type: 1,
        [Op.or]: [
          { end: { [Op.gte]: today } },
          { end: null }
        ]
      }],
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})
//load - top post this week
router.get("/thisweek/top", tokenCheck, async (req, res) => {

  const { type } = req.query;

  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  let day = todayfull.getDay(); // 요일

  const today = new Date(year, month, date);
  const rangeStart = new Date(year, month, date - ((day + 6) % 7));
  const rangeEnd = new Date(year, month, date - ((day + 6) % 7) + 6, 23, 59, 59);

  try {
    const where = {};
    const Posts = await Post.findAll({
      where: [{
        type,
        [Op.and]: [
          { createdAt: { [Op.gte]: rangeStart } },
          { createdAt: { [Op.lte]: rangeEnd } }
        ],
      }],
      limit: 10,
      through: { attributes: [] },
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM goodlockgodlock.Like WHERE Post_id = Post.id)'),
            'LikeCount'
          ]
        ],
      },
      group: ['id'],
      include: [
        {
          model: User,//게시글 작성자
          attributes: ['id', 'nickname', 'profilePic', 'email'],
        },
        {
          model: User, //좋아요 누른 사람
          as: 'Likers', //모델에서 가져온대로 설정
          attributes: ['id'],
        },
        {
          model: Image, //게시글의 이미지
        },
      ],
      order: [[sequelize.col("LikeCount"), "DESC"], [sequelize.literal('rand()')]]
    });

    return res.status(200).json(Posts);

  } catch (e) {
    console.error(e);
  }
})


//length - new post this week
router.get("/thisweek/new", tokenCheck, async (req, res) => {

  const { type } = req.query;

  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  let day = todayfull.getDay(); // 요일

  const today = new Date(year, month, date);
  const rangeStart = new Date(year, month, date - ((day + 6) % 7));
  const rangeEnd = new Date(year, month, date - ((day + 6) % 7) + 6, 23, 59, 59);


  //일 0, 월 1, 화 2, 수 3, 목 4, 금 5, 토 6
  console.log("===================")
  console.log(day);
  console.log((day + 6) % 7);

  console.log(rangeStart)
  console.log(rangeEnd)

  console.log("===================")


  try {
    const where = {};
    const Posts = await Post.findAndCountAll({
      where: [{
        type,
        [Op.and]: [
          { createdAt: { [Op.gte]: rangeStart } },
          { createdAt: { [Op.lte]: rangeEnd } }
        ],
      }]
      // , attributes: ['id', 'createdAt'],
    });

    return res.status(201).json(Posts.count);
  } catch (e) {
    console.error(e);
  }
})
//length - end liked post this week
router.get("/thisweek/likeEnd", tokenCheck, async (req, res) => {

  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  let day = todayfull.getDay(); // 요일

  const today = new Date(year, month, date);
  //this week range date
  const rangeStart = new Date(year, month, date - ((day + 6) % 7));
  const rangeEnd = new Date(year, month, date - ((day + 6) % 7) + 6, 23, 59, 59);



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
      const Posts = await Post.findAndCountAll({
        attributes: ['id'],
        where: [{
          type: 1,
          id: { [Op.in]: likedPosts.map(v => v.id) },
          [Op.and]: [
            { end: { [Op.gte]: rangeStart } },
            { end: { [Op.lte]: rangeEnd } }
          ],
        }]
      });
      return res.status(201).json(Posts.count);
    }
    else return res.status(201).json(0);
  } catch (e) {
    console.error(e);
  }
})
//length - feed posts in this week
router.get("/thisweek/feed", tokenCheck, async (req, res) => {
  const { type } = req.query;
  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  let day = todayfull.getDay(); // 요일

  const today = new Date(year, month, date);
  const rangeStart = new Date(year, month, date - ((day + 6) % 7));
  const rangeEnd = new Date(year, month, date - ((day + 6) % 7) + 6, 23, 59, 59);

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

    const Posts = await Post.findAndCountAll({
      where: [{
        type,
        UserId: { [Op.in]: followings.map(v => v.id) },
        [Op.and]: [
          { createdAt: { [Op.gte]: rangeStart } },
          { createdAt: { [Op.lte]: rangeEnd } }
        ],
      }],
    });
    return res.status(201).json(Posts.count);
  } catch (e) {
    console.error(e);
  }
})
//length - ongoing in this week
router.get("/thisweek/activeinfo", async (req, res) => {
  const { type, pageParam, tempDataNum } = req.query;

  const todayfull = new Date();
  let year = todayfull.getFullYear(); // 년도
  let month = todayfull.getMonth();  // 월
  let date = todayfull.getDate();  // 날짜
  let day = todayfull.getDay(); // 요일

  const today = new Date(year, month, date);
  const rangeStart = new Date(year, month, date - ((day + 6) % 7));
  const rangeEnd = new Date(year, month, date - ((day + 6) % 7) + 6, 23, 59, 59);

  try {
    const Posts = await Post.findAndCountAll({
      where: [{
        type: 1,
        [Op.and]: [
          { createdAt: { [Op.gte]: rangeStart } },
          { createdAt: { [Op.lte]: rangeEnd } }
        ],
        [Op.or]: [
          { end: { [Op.gte]: today } },
          { end: null }
        ]
      }],
    });

    return res.status(201).json(Posts.count);
  } catch (e) {
    console.error(e);
  }
})

//load posts - feed post(팔로잉 유저 포스트 모아보기)
router.get("/feed", tokenCheck, async (req, res) => {
  const { pageParam, tempDataNum, type } = req.query;
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
        type,
        UserId: { [Op.in]: followings.map(v => v.id) }
      }],
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})


//load posts - my post, type 구분
router.get("/my", tokenCheck, async (req, res) => {
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
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})
//load posts - my liked
router.get("/liked", tokenCheck, async (req, res) => {
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
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})

//load posts - search contents
router.get("/search", async (req, res) => {
  const { type, search, pageParam, tempDataNum } = req.query;

  try {
    const where = {};
    const Posts = await Post.findAll({
      where: [{
        type: type,
        content: {
          [Op.like]: "%" + `${search}` + "%"
        }
      }],
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
        [Image, 'id', 'ASC'],
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
    // return res.status(201).json({ search, Posts });
    return res.status(201).json(Posts.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.error(e);
  }
})


//load posts - target user post (type)
router.get("/user", tokenCheck, async (req, res) => {
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
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})
//load posts - target user bookmarked tip
router.get("/user/liked", tokenCheck, async (req, res) => {
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
        [Image, 'id', 'ASC'],
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
    console.error(e);
  }
})


//add, edit, delete post
router.post("/", tokenCheck, async (req, res) => {
  try {
    //현재 로그인된 유저의 id와 포스트 text로 post 모델의 요소 생성
    console.log(req.body);
    const { type, UserId } = req.body;
    if (type === 0) {
      const user = await User.findOne({
        id: UserId
      })
      if (user.level !== 10) {
        return res.status(400).json("유저 레벨이 올바르지 않습니다.");
      }
    }
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
      const images = [];
      for (i = 0; i < postImages.length; i++) {
        const temp = await Image.create({ src: postImages[i] });
        images.push(temp);
      }
      post.addImages(images);
      return setTimeout(() => {
        res.status(200).json({ postImages, images, post });
      }, 1000);
    }
    return setTimeout(() => {
      res.status(200).json(post);
    }, 1000);
  } catch (e) {
    console.error(e);
  }

})
router.patch("/:postId", tokenCheck, async (req, res) => {
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
      const images = [];
      for (i = 0; i < postImages.length; i++) {
        const temp = await Image.create({ src: postImages[i] });
        images.push(temp);
      }
      post.addImages(images);

      return setTimeout(() => {
        res.status(200).json({ postImages, images, post });
      }, 1000);
    }
    return setTimeout(() => {
      res.status(200).json(post);
    }, 1000);
  } catch (e) {
    console.error(e);
  }
})
router.delete("/:postId", tokenCheck, async (req, res) => {
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
    console.error(e);
  }
  res.status(200).json("post edit success");
})


//add, edit, delete comment
router.post("/:postId/comment", tokenCheck, async (req, res) => {
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
    return setTimeout(() => {
      res.status(201).json(comment);
    }, 1000);
  }
  catch (e) {
    console.error(e);
  }
});
router.delete("/:postId/comment/:commentId", tokenCheck, async (req, res) => {
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
    console.error(e);
  }
  res.status(200).json("comment delete success");
})
router.patch("/:postId/comment/:commentId", tokenCheck, async (req, res) => {
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

    return setTimeout(() => {
      res.status(200).json("post edit success");
    }, 1000);
  } catch (e) {
    console.error(e);
  }
})


//post like, unlike
router.patch("/:postId/like", tokenCheck, async (req, res) => {
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
      return res.status(200).json({ type: post.type, result: "좋아요 완료" });
    }
    else {
      return res.status(400).json("오류 발생");
    }
  }
  catch (e) { console.error(e) }
})
router.delete("/:postId/like", tokenCheck, async (req, res) => {
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
      return res.status(200).json({ type: post.type, result: "좋아요 해제 완료" });
    }
    else {
      return res.status(400).json("오류 발생");
    }
  }
  catch (e) { console.error(e) }
})


module.exports = router;