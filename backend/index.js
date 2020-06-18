const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const passportConfig = require("./passport");
const hpp = require('hpp');
const helmet = require('helmet');
const db = require("./models");

const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");
const hashtagAPIRouter = require("./routes/hashtag");

dotenv.config();

const prod = process.env.NODE_ENV === 'production';

const app = express();
db.sequelize.sync();

passportConfig();
if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
} else {
  app.use(morgan("dev"));
}

app.use(cors({ origin: true, credentials: true }));
app.use('/', express.static('uploads')); // uploads의 경로가 아닌 / 로 접근이 가능토록 한다. (프론트의 접근주소, 실제 서버에서의 경로)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, // https를 이용할 때 true
      domain: prod && '.ap-northeast-2.compute.amazonaws.com',
    },
    name: 'rnbck',
  })
);
app.use(passport.initialize());
app.use(passport.session()); // express-session이 실행후에 동작해야함

app.get('/', (req, res) => {
  res.send('nodebird working');
})
app.use("/api/user", userAPIRouter);
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);
app.use("/api/hashtag", hashtagAPIRouter);

app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 3065, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
