const express = require("express");
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
const Hashtag = db.Hashtag;

router.get("/", async (req, res) => {
  res.status(200).json("comment router");
});


//comment - add, edit, delete
// router.post("/:postId/comment", tokenCheck, async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const currentPost = await Post.findOne(
//       { where: { id: postId } }
//     );
//     if (!currentPost) {
//       return res.status(403).json("존재하지 않는 게시글입니다.");
//     }

//     const comment = await Comment.create({
//       content: req.body.content,
//       PostId: postId,
//       UserId: req.currentUserId,
//     });
//     return setTimeout(() => {
//       res.status(201).json(comment);
//     }, 1000);
//   }
//   catch (e) {
//     console.error(e);
//   }
// });
// router.delete("/:postId/comment/:commentId", tokenCheck, async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const commentId = req.params.commentId;

//     const comment = await Comment.findOne({
//       where: { id: commentId, PostId: postId, UserId: req.currentUserId }
//     });
//     if (!comment) return res.status(403).json("대상이 올바르지 않거나 자신의 댓글이 아닙니다.");

//     await Comment.destroy({
//       where: { id: commentId, PostId: postId, UserId: req.currentUserId }
//     });
//   } catch (e) {
//     console.error(e);
//   }
//   res.status(200).json("comment delete success");
// })
// router.patch("/:postId/comment/:commentId", tokenCheck, async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const commentId = req.params.commentId;

//     //comment 확인
//     const comment = await Comment.findOne({
//       where: { id: commentId, PostId: postId, UserId: req.currentUserId }
//     });
//     if (!comment) return res.status(403).json("대상이 올바르지 않거나 자신의 댓글이 아닙니다.");

//     //comment 수정
//     await Comment.update({
//       content: req.body.content,
//     }, {
//       where: { id: commentId, PostId: postId, UserId: req.currentUserId }
//     }
//     );

//     return setTimeout(() => {
//       res.status(200).json("post edit success");
//     }, 1000);
//   } catch (e) {
//     console.error(e);
//   }
// })

//Reply - add, edit, delete
router.post("/:commentId/reply", tokenCheck, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const currentComment = await Comment.findOne(
      { where: { id: commentId } }
    );
    if (!currentComment) {
      return res.status(403).json("존재하지 않는 댓글입니다.");
    }

    const comment = await Comment.create({
      content: req.body.content,
      CommentId: commentId,
      UserId: req.currentUserId,
    });

    await currentComment.addReplyChild(comment.id);

    return setTimeout(() => {
      res.status(201).json(comment);
    }, 1000);
  }
  catch (e) {
    console.error(e);
  }
});
router.delete("/reply/:replyId", tokenCheck, async (req, res) => {
  try {
    const replyId = req.params.replyId;

    //current user
    const currentUser = await User.findOne({
      where: { id: req.currentUserId },
    });

    const reply = await Comment.findOne({
      where: { id: replyId }
    });

    if (!reply) return res.status(403).json("게시글이 올바르지 않습니다.");
    if (reply && (reply.UserId !== req.currentUserId) && (currentUser.level !== 10)) {
      return res.status(403).json("다른 사람의 게시글 입니다.");
    }

    await Comment.destroy({
      where: { id: replyId }
    });
  } catch (e) {
    console.error(e);
  }
  res.status(200).json("reply delete success");
})
router.patch("/reply/:replyId", tokenCheck, async (req, res) => {
  try {
    const replyId = req.params.replyId;

    //current user
    const currentUser = await User.findOne({
      where: { id: req.currentUserId },
    });

    //reply 확인
    const reply = await Comment.findOne({
      where: { id: replyId }
    });

    if (!reply) return res.status(403).json("게시글이 올바르지 않습니다.");
    if (reply && (reply.UserId !== req.currentUserId) && (currentUser.level !== 10)) {
      return res.status(403).json("다른 사람의 게시글 입니다.");
    }

    //comment 수정
    await Comment.update({
      content: req.body.content,
    }, {
      where: { id: replyId }
    }
    );

    return setTimeout(() => {
      res.status(200).json("reply edit success");
    }, 1000);
  } catch (e) {
    console.error(e);
  }
})


module.exports = router;