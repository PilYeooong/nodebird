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
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from "../reducers/user";

axios.defaults.baseURL = "http://localhost:3065/api/";

function loginAPI(loginData) {
  return axios.post('/user/login', loginData, {
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
    });
  }
}


function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  return axios.post('/user/', signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: "성공"
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: "12312"
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchSignUp),
  ]);
}

// const HELLO_SAGA = "HELLO_SAGA";

// function* hello() {
//   yield delay(1000);
//   yield put({
//     type: "BYE_SAGA"
//   })
// }

// function* watchHello() {
//   yield takeLatest(HELLO_SAGA, hello);
// }