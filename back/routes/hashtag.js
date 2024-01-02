const express = require("express");
const router = express.Router();

const db = require("../models/index.js");
const Post = db.Post;
const Hashtag = db.Hashtag;

const sequelize = db.Sequelize;

router.get("/", async (req, res) => {
  try {
    const type = parseInt(req.query.type);
    const limit = parseInt(req.query.limit);

    const Hashtags = await Hashtag.findAll({
      where: {},
      through: { attributes: [] },
      include: [
        {
          model: Post,//게시글 작성자
          attributes: ['id', 'type'],
          where: { type }
        },
      ],
      limit,
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM goodlockgodlock.PostHashtag WHERE HashtagId = Hashtag.id)'),
            'hashCount'
          ]
        ],
      },
      group: ['id'],
      order: [[sequelize.col("hashCount"), "DESC"], [sequelize.literal('rand()')]]
    });

    return res.status(200).json(Hashtags);
  } catch (e) {
    console.error(e);
  }


});

module.exports = router;