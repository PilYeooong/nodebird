const dummyUser = {
  nickname: "필영",
  Post: [],
  Followings: [],
  Followers: [],
  id: 1
};

export const initialState = {
  me: null, // 내 정보
  isLoggedIn: false, // 로그인 여부
  isLoggingOut: false, // 로그아웃 시도중
  isLoggingIn: false, // 로그인 시도중
  loginErrorReason: '', // 로그인 에러 사유
  signedUp: false, // 회원가입 성공
  isSigningUp: false, // 회원가입 중
  signUpErrorReason: '', //회원가입 실패 사유
  followingList: [], // 팔로잉 리스트
  followerList: [], // 팔로워 리스트
  userInfo: null, // 남의 정보
};

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

// export const INCREMENT_NUMBER;

export const signUpRequestAction = (data) => ({
    type: SIGN_UP_REQUEST,
    data: data,
})

// export const signUpSuccess = {
//   type: SIGN_UP_SUCCESS,
// }

export const loginRequestAction = (data) => ({
    type: LOG_IN_REQUEST,
    data
});

export const logoutRequestAction = {
  type: LOG_OUT_REQUEST,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
        isLoading: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: action.data,
        isLoading: false,
      }
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        loginErrorReason: action.error,
        me: null,
      }
    }
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    }
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        isSigningUp: true,
        signedUp: false,
      };
    }
    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        isSigningUp: false,
        signedUp: true,
        signUpData: action.data
      };
    }
    case SIGN_UP_FAILURE: {
      return {
        ...state,
        isSigningUp: false,
        signedUp: false,
        signUpErrorReason: action.error,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
