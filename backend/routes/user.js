const express = require('express');
const db = require("../models");
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn } = require('./middleware');
const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {

  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  return res.json(user);
});

router.post('/', async (req, res, next) => {
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      }
    });
    if(exUser){
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 2번째 인자는 salt , 보통 10 ~ 13
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리는 여기서 
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10)},
      include: [{
        model: db.Post,
        as: 'Posts',
        attributes: ['id']
      }, {
        model: db.User,
        as: 'Followings',
        attributes: ['id']
      }, {
        model: db.User,
        as: 'Followers',
        attributes: ['id'],
      }],
      attribute: ['id', 'nickname']
    });
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    return res.json(jsonUser);
  } catch(e) {
    console.error(e);
    next(e);
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('logout 성공');
})

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { // local에 정의한 strategy
    if(err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => { // serializeUser가 진행됨
      if (loginErr){
        return next(loginErr);
      }
      const fullUser = await db.User.findOne({
        where: { id: user.id },
        include: [{
          model: db.Post,
          as: 'Posts',
          attribute: ['id'],
        }, {
          model: db.User,
          as: 'Followings',
          attribute: ['id'],
        }, {
          model: db.User,
          as: "Followers",
          attribute: ['id'],
        }],
        attribute: ['id', 'nickname', 'userId'],
      })
      return res.json(fullUser);
    })
  })(req, res, next);
})

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where : { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
    });
    const followers = await user.getFollowers({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    return res.json(followers);
  } catch(e){
    console.error(e);
    next(e);
  }
})
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where : { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
    });
    const followings = await user.getFollowings({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    return res.json(followings);
  } catch(e){
    console.error(e);
    next(e);
  }
})
router.delete('/:id/follower', async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id }
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch(e){
    console.error(e);
    next(e);
  }
})

router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        RetweetId: null,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      },
      {
        model: db.User,
        through: "Like",
        as: "Likers",
        attributes: ['id']
      },]
    });
    return res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
})

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
 try {
  await db.User.update({
    nickname: req.body.nickname,
  }, {
    where: { id: req.user.id }
  });
  res.send(req.body.nickname);
}
  catch(e){
   console.error(e);
   next(e);
 }
})

module.exports = router;