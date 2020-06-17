import React from "react";
import Helmet from "react-helmet";
// import Head from "next/head";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import AppLayout from "../components/AppLayout";
import reducer from "../reducers/";
import rootSaga from "../sagas";
import { LOAD_USER_REQUEST } from "../reducers/user";
import Axios from "axios";
import App, { Container } from "next/app";

// class NodeBird extends App {
//   static getInitialProps(context) {

//   }
//   render() {

//   }
// }
const NodeBird = ({ Component, store, pageProps }) => {
  return (
    <Container>
      <Provider store={store}>
        <Helmet
          title="NodeBird"
          htmlAttributes={{ lang: "ko" }}
          meta={[
            {
              charset: "UTF-8",
            },
            {
              name: "viewport",
              content:
                "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover",
            },
            {
              "http-equiv": "X-UA-Compatible",
              content: "IE=edge",
            },
            {
              name: "description",
              content: "필영의 NodeBird SNS",
            },
            {
              name: "og:title",
              content: "NodeBird",
            },
            {
              name: "og:description",
              content: "필영의 NodeBird SNS",
            },
            {
              property: "og:type",
              content: "website",
            },
            {
              property: "og:image",
              content: "https://localhost:3060/favicon.ico",
            }
          ]}
          link={[
            {
              rel: "shortcut icon",
              href: "/favicon.ico",
            },
            {
              rel: "stylesheet",
              href:
                "https://cdnjs.cloudflare.com/ajax/libs/antd/4.2.5/antd.css",
            },
            {
              rel: "stylesheet",
              href:
                "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css",
            },
            {
              rel: "stylesheet",
              href:
                "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css",
            },
          ]}
        />

        {/* 
      <Head>
        <title>NodeBird</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.2.5/antd.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head> */}
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </Provider>
    </Container>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object,
};

NodeBird.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  let pageProps = {};
  const state = ctx.store.getState(); // redux state에 접근
  const cookie = ctx.isServer ? ctx.req.headers.cookie : ""; // 서버요청에서는 req.headers, 프론트에서의 요청은 req.headers가 없기때문에 빈 문자열
  if (ctx.isServer && cookie) {
    Axios.defaults.headers.Cookie = cookie;
  }
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }
  if (Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(ctx);
  }
  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
    (store) => (next) => (action) => {
      console.log(action);
      next(action);
    },
  ];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f
        );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBird));
