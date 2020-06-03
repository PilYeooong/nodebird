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
      });
      return done(null, user); // req.user에 저장됨 (유저정보)
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
  local();
};
