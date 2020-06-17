const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  try {
    let where = {};
    if(parseInt(req.query.lastId, 10)){
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        }
      }
    }
    const posts = await db.Post.findAll({
      where,
      include: [{
        model: db.Hashtag,
        where: { name: decodeURIComponent(req.params.tag) } // 모델은 post이나 hashtag의 조건을 주기 때문에 include절 안에서 where절 호출한다.
      }, {
        model: db.User,
        attribute: ['id', 'nickname']
      }, {
        model: db.Image,
      },
      {
        model: db.User,
        through: "Like",
        as: "Likers",
        attributes: ['id']
      },],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10),
    })
    return res.json(posts);
  } catch(e) {
    console.error(e);
    next(e);
  }
})

module.exports = router;