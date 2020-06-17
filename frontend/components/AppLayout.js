import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";

import LoginForm from "../components/LoginForm";
import UserProfile from "../components/UserProfile";

import { Menu, Input, Row, Col } from "antd";
import Router from "next/router";

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   if (!me) {
  //     dispatch({
  //       type: LOAD_USER_REQUEST,
  //     });
  //   }
  // }, []);

  const onSearch = value => {
    Router.push({
      pathname: '/hashtag', query: { tag: value }}, `/hashtag/${value}`);
  };
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile" prefetch>
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} onSearch={onSearch} />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>

        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}></Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
