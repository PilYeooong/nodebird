const passport = require("passport");
const db = require("../models");
const local = require("./local");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 로그인 동작 시, 서버 쪽에 [{ id: 3, cookie: "123213 "}] , 가벼운 객체로 변환 후 서버에 저장
    return done(null, user.id);
  });

  // front에서 사용자 관련 쿠키를 보내오면 deserialize 진행
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
        include: [{
          model: db.Post,
          as: 'Posts',
          attributes: ['id']
        }, {
          model: db.User,
          as: "Followers",
          attributes: ['id']
        }, {
          model: db.User,
          as: "Followings",
          attributes: ['id']
        }],
      });
      return done(null, user); // req.user에 저장됨 (유저정보)
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
  local();
};

// 프론트에서 서버로는 cookie만 보내요(asdfgh)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
// id: 3이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱