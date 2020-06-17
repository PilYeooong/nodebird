import {
  all,
  fork,
  takeLatest,
  takeEvery,
  call,
  put,
  take,
  delay,
} from "redux-saga/effects";
import axios from "axios";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOAD_USER_REQUEST,
  LOAD_USER_FAILURE,
  LOAD_USER_SUCCESS,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  EDIT_NICKNAME_REQUEST,
  EDIT_NICKNAME_SUCCESS,
  EDIT_NICKNAME_FAILURE,
} from "../reducers/user";


function loginAPI(loginData) {
  return axios.post("/user/login", loginData, {
    withCredentials: true, // 추가하면 서로 쿠키를 주고 받을 수 있음
  });
  // 서버에 요청을 보냄
}
// call 함수 동기적 호출
// fork 함수 비동기적 호출

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({
      // put은 dispatch랑 동일
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response && e.response.data,
    });
  }
}

function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  return axios.post("/user/", signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: "성공",
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: "12312",
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logOutAPI() {
  return axios.post(
    "/user/logout",
    {},
    {
      withCredentials: true,
    }
  );
}

function* logOut(action) {
  try {
    yield call(logOutAPI, action.data);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: "성공",
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: "12312",
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI(userId) {
  return axios.get(userId ? `/user/${userId}` : "/user/", {
    withCredentials: true, // 클라이언트에서 요청 보낼때는 브라우저가 쿠키를 전송
  }); // 서버사이드렌더링일때는 , 브라우저가 없음, 쿠키를 직접 넣어야함
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function followAPI(userId) {
  // 서버에 요청을 보내는 부분
  return axios.post(
    `/user/${userId}/follow`,
    {},
    {
      withCredentials: true,
    }
  );
}

function* follow(action) {
  try {
    // yield call(followAPI);
    const result = yield call(followAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
  // 서버에 요청을 보내는 부분
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true,
  });
}

function* unfollow(action) {
  try {
    // yield call(unfollowAPI);
    const result = yield call(unfollowAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

function loadFollowersAPI(userId, offset=0, limit=3) {
  // 서버에 요청을 보내는 부분
  return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  });
}

function* loadFollowers(action) {
  try {
    // yield call(unfollowAPI);
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      // put은 dispatch 동일
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollwers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}


function loadFollowingsAPI(userId, offset=0, limit=3) {
  // 서버에 요청을 보내는 부분
  return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  });
}

function* loadFollowings(action) {
  try {
    // yield call(unfollowAPI);
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      // put은 dispatch 동일
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
  // 서버에 요청을 보내는 부분
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
  });
}

function* removeFollower(action) {
  try {
    // yield call(unfollowAPI);
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
  // 서버에 요청을 보내는 부분
  return axios.patch(`/user/nickname`, { nickname }, {
    withCredentials: true,
  });
}

function* editNickname(action) {
  try {
    // yield call(unfollowAPI);
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e,
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollwers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
  ]);
}
