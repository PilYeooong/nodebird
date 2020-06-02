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

function* loginAPI() {
  // 서버에 요청을 보냄
}
// call 함수 동기적 호출
// fork 함수 비동기적 호출

function* login() {
  try {
    // yield call(loginAPI);
    yield delay(2000);
    yield put({
      // put은 dispatch랑 동일
      type: LOG_IN_SUCCESS,
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

function* signUpAPI() {
  // 서버에 요청을 보냄
}

function* signUp() {
  try {
    yield call(signUpAPI);
    yield delay(2000);
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