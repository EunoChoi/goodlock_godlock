const express = require("express");

const router = express.Router();

const db = require("../models/index.js");
const Image = db.Image;
const Post = db.Post;

const Op = db.Sequelize.Op;



//images
router.get("/", async (req, res) => {
  const { type, pageParam, tempDataNum } = req.query;

  try {
    const Images = await Image.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [{
        model: Post,
        attributes: ['type', 'UserId'],
        where: [{
          type,
          UserId: { [Op.is]: !null },
        }]
      }],
    });
    if (!Images) {
      return res.status(401).json("이미지가 존재하지 않습니다. ");
    }
    return res.status(201).json(Images.slice(tempDataNum * (pageParam - 1), tempDataNum * pageParam));
  } catch (e) {
    console.error(e);
  }
})


module.exports = router;